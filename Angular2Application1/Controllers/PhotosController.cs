using Angular2Application1.Entities;
using Angular2Application1.Infrastructure;
using Angular2Application1.Infrastructure.Core;
using Angular2Application1.Infrastructure.Repositories;
using Angular2Application1.ViewModels;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Angular2Application1.Controllers
{
    [Route("api/[controller]")]
    public class PhotosController : Controller
    {
        IPhotoRepository _photoRepository;
        ILoggingRepository _loggingRepository;
        public PhotosController(IPhotoRepository photoRepository, ILoggingRepository loggingRepository)
        {
            _photoRepository = photoRepository;
            _loggingRepository = loggingRepository;
        }

        [HttpGet("{page:int=0}/{pageSize=12}")]
        public PaginationSet<PhotoViewModel> Get(int? page, int? pageSize)
        {
            PaginationSet<PhotoViewModel> pagedSet = null;

            try
            {
                int currentPage = page.Value;
                int currentPageSize = pageSize.Value;

                List<Photo> _photos = null;
                int _totalPhotos = new int();


                _photos = _photoRepository
                    .AllIncluding(p => p.Album)
                    .OrderBy(p => p.Id)
                    .Skip(currentPage * currentPageSize)
                    .Take(currentPageSize)
                    .ToList();

                _totalPhotos = _photoRepository.GetAll().Count();

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

        [HttpDelete("{id:int}")]
        public IActionResult Delete(int id)
        {
            IActionResult _result = new ObjectResult(false);
            GenericResult _removeResult = null;

            try
            {
                Photo _photoToRemove = this._photoRepository.GetSingle(id);
                this._photoRepository.Delete(_photoToRemove);
                this._photoRepository.Commit();

                _removeResult = new GenericResult()
                {
                    Succeeded = true,
                    Message = "Photo removed."
                };
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
    }
}
