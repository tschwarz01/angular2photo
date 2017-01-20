using Angular2Application1.Entities;
using Angular2Application1.Infrastructure;
using Angular2Application1.Infrastructure.Core;
using Angular2Application1.Infrastructure.Repositories;
using Angular2Application1.ViewModels;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Angular2Application1.Controllers
{
    [Route("api/[controller]")]
    public class AlbumsController : Controller
    {
        private static PhotoGalleryContext context;
        private readonly IAuthorizationService _authorizationService;
        public IHostingEnvironment _env;

        ILoggingRepository _loggingRepository;
        IAlbumRepository _albumRepository;

        public string baseAlbumPath;

        public AlbumsController(
            IAuthorizationService authorizationService,
            IHostingEnvironment env,
            IAlbumRepository albumRepository,
            ILoggingRepository loggingRepository)
        {
            _authorizationService = authorizationService;
            _env = env;
            _loggingRepository = loggingRepository;
            _albumRepository = albumRepository;
            baseAlbumPath = Path.Combine(_env.WebRootPath, "images");
        }

        [HttpGet("GetAll")]
        public IActionResult GetAll()
        {
            var _albums = _albumRepository.GetAll();
            if (_albums == null)
            {
                return NotFound();
            }
            var results = Mapper.Map<IEnumerable<AlbumViewModel>>(_albums);

            return Ok(results);
        }

        [HttpGet("GetOne/{id}")]
        public IActionResult GetOne(int id)
        {
            Album _album = _albumRepository.GetSingle(id);
            if (_album == null)
            {
                return NotFound();
            }

            AlbumViewModel _albumVM = Mapper.Map<Album, AlbumViewModel>(_album);
            return Ok(_albumVM);
        }

        [HttpGet("{page:int=0}/{pageSize=12}")]
        public async Task<IActionResult> Get(int? page, int? pageSize)
        {
            PaginationSet<AlbumViewModel> pagedSet = new PaginationSet<AlbumViewModel>();

            try
            {
                //if (await _authorizationService.AuthorizeAsync(User, "AdminOnly"))
                //{
                    int currentPage = page.Value;
                    int currentPageSize = pageSize.Value;

                    List<Album> _albums = null;
                    int _totalAlbums = new int();


                    _albums = _albumRepository
                        .AllIncluding(a => a.Photos)
                        .OrderBy(a => a.Id)
                        .Skip(currentPage * currentPageSize)
                        .Take(currentPageSize)
                        .ToList();

                    _totalAlbums = _albumRepository.GetAll().Count();

                    IEnumerable<AlbumViewModel> _albumsVM = Mapper.Map<IEnumerable<Album>, IEnumerable<AlbumViewModel>>(_albums);

                    pagedSet = new PaginationSet<AlbumViewModel>()
                    {
                        Page = currentPage,
                        TotalCount = _totalAlbums,
                        TotalPages = (int)Math.Ceiling((decimal)_totalAlbums / currentPageSize),
                        Items = _albumsVM
                    };
                //}
                //else
                //{
                //    CodeResultStatus _codeResult = new CodeResultStatus(401);
                //    return new ObjectResult(_codeResult);
                //}
            }
            catch (Exception ex)
            {
                _loggingRepository.Add(new Error() { Message = ex.Message, StackTrace = ex.StackTrace, DateCreated = DateTime.Now });
                _loggingRepository.Commit();
            }

            return new ObjectResult(pagedSet);
        }

        //[Authorize(Policy = "AdminOnly")]
        [HttpPost("Create")]
        public async Task<IActionResult> CreateAlbum([FromBody] CreateAlbumViewModel vm)
        {
            IActionResult _result = new ObjectResult(false);
            GenericResult _createResult = null;

            try
            {
                //if (await _authorizationService.AuthorizeAsync(User, "AdminOnly"))
                //{

                    if (vm == null)
                    {
                        return BadRequest();
                    }

                    if (vm.Description == vm.Title)
                    {
                        ModelState.AddModelError("Description", "The provided album description should be different from the title.");
                    }

                    if (_albumRepository.AlbumExists(vm.Title))
                    {
                        ModelState.AddModelError("Description", $"An album with the title you specified already exists: {vm.Title}");
                    }

                    if (!ModelState.IsValid)
                    {
                        return BadRequest(ModelState);
                    }

                    // To Do - Add Exception Handling
                    if (!Directory.Exists(Path.Combine(baseAlbumPath, vm.Title)))
                    {
                        Directory.CreateDirectory(Path.Combine(baseAlbumPath, vm.Title));
                    }

                    var newAlbum = Mapper.Map<Album>(vm);
                    newAlbum.DateCreated = DateTime.UtcNow;

                    _albumRepository.Add(newAlbum);

                    if (await _albumRepository.SaveChangesAsync())
                    {
                        _createResult = new GenericResult()
                        {
                            Succeeded = true,
                            Message = $"The album was successfully created: {newAlbum.Title}"
                        };
                    }

                //}
                //else
                //{
                //    CodeResultStatus _codeResult = new CodeResultStatus(401);
                //    return new ObjectResult(_codeResult);
                //}
            }
            catch (Exception ex)
            {
                _createResult = new GenericResult()
                {
                    Succeeded = false,
                    Message = ex.Message
                };

                _loggingRepository.Add(new Error() { Message = ex.Message, StackTrace = ex.StackTrace, DateCreated = DateTime.Now });
                _loggingRepository.Commit();
            }

            _result = new ObjectResult(_createResult);
            return _result;
        }

        //[Authorize(Policy = "AdminOnly")]
        [HttpDelete("Delete/{id:int}")]
        public async Task<IActionResult> DeleteAlbum(int id)
        {
            IActionResult _result = new ObjectResult(false);
            GenericResult _removeResult = null;

            try
            {
                //if (await _authorizationService.AuthorizeAsync(User, "AdminOnly"))
                //{
                    Album _albumToRemove = this._albumRepository.GetSingle(id);
                    this._albumRepository.Delete(_albumToRemove);
                    this._albumRepository.Commit();

                    _removeResult = new GenericResult()
                    {
                        Succeeded = true,
                        Message = $"Album removed: {_albumToRemove.Title}"
                    };
                //}
                //else
                //{
                //    CodeResultStatus _codeResult = new CodeResultStatus(401);
                //    return new ObjectResult(_codeResult);
                //}
            }
            catch (Exception ex)
            {
                _removeResult = new GenericResult()
                {
                    Succeeded = false,
                    Message = ex.Message
                };

                _loggingRepository.Add(new Error() { Message = ex.Message, StackTrace = ex.StackTrace, DateCreated = DateTime.Now });
                _loggingRepository.Commit();
            }

            _result = new ObjectResult(_removeResult);
            return _result;
        }

        //[Authorize(Policy = "AdminOnly")]
        [HttpGet("{id:int}/photos/{page:int=0}/{pageSize=12}")]
        public PaginationSet<PhotoViewModel> Get(int id, int? page, int? pageSize)
        {
            PaginationSet<PhotoViewModel> pagedSet = null;

            try
            {
                int currentPage = page.Value;
                int currentPageSize = pageSize.Value;

                List<Photo> _photos = null;
                int _totalPhotos = new int();

                Album _album = _albumRepository.GetSingle(a => a.Id == id, a => a.Photos);

                _photos = _album
                            .Photos
                            .OrderBy(p => p.Id)
                            .Skip(currentPage * currentPageSize)
                            .Take(currentPageSize)
                            .ToList();

                _totalPhotos = _album.Photos.Count();

                IEnumerable<PhotoViewModel> _photosVM = Mapper.Map<IEnumerable<Photo>, IEnumerable<PhotoViewModel>>(_photos);

                pagedSet = new PaginationSet<PhotoViewModel>()
                {
                    Page = currentPage,
                    TotalCount = _totalPhotos,
                    TotalPages = (int)Math.Ceiling((decimal)_totalPhotos / currentPageSize),
                    Items = _photosVM
                };
            }
            catch (Exception ex)
            {
                _loggingRepository.Add(new Error() { Message = ex.Message, StackTrace = ex.StackTrace, DateCreated = DateTime.Now });
                _loggingRepository.Commit();
            }

            return pagedSet;
        }
    }
}
