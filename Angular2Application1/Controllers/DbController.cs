using Microsoft.Extensions.Configuration;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Globalization;
using Microsoft.AspNetCore.Hosting;
using System.IO;
using Angular2Application1.Infrastructure.Core;
using Angular2Application1.Infrastructure.Repositories;
using Angular2Application1.Entities;
using System.Collections.Generic;
using Angular2Application1.Infrastructure;
using System.Linq;
using Angular2Application1.Infrastructure.Services;

namespace Angular2Application1.Controllers
{
    [Route("api/[controller]")]
    public class DbController : Controller
    {
        private static PhotoGalleryContext context;
        private readonly IImageService _imageService;
        private static string _applicationPath = string.Empty;
        private static string _albumRootPath;
        private readonly string _imageRootPath;
        private readonly string _containerName;
        private static string imagesPath;

        public DbController(IHostingEnvironment env, IServiceProvider serviceProvider, IImageService imageService)
        {
            context = (PhotoGalleryContext)serviceProvider.GetService(typeof(PhotoGalleryContext));
            _applicationPath = env.WebRootPath;
            _imageService = imageService;
            imagesPath = _applicationPath;
        }
        [HttpGet("initialize")]
        private async Task InitializeAzurePhotoAlbums()
        {
            if (!context.Albums.Any())
            {
                List<Album> _albums = new List<Album>(); // I don't know if we need to build this List since we should be adding one album at a time

                string[] _albumPaths = Directory.GetDirectories(Path.Combine(imagesPath, "images"));
                int _albumId = 1;

                foreach (string _albumPath in _albumPaths)
                {
                    var _shortAlbumName = new DirectoryInfo(_albumPath).Name;
                    var _safeAlbumName = DateTime.Now.ToString("yyyyMMdd", CultureInfo.InvariantCulture);
                    var _album = context.Albums.Add(
                        new Album
                        {
                            DateCreated = DateTime.Now,
                            SafeName = DateTime.Now.ToString("yyyyMMdd", CultureInfo.InvariantCulture),
                            Title = _shortAlbumName,
                            Description = $"Detailed description will be added later for: {_shortAlbumName}"
                        }).Entity;

                    _albums.Add(_album);

                    string[] _images = Directory.GetFiles(_albumPath);
                    foreach (string _image in _images)
                    {
                        int _selectedAlbum = _albumId;
                        string _fileName = Path.GetFileName(_image);
                        string _fileName2 = _shortAlbumName + @"/";
                        string _fileName3 = Path.Combine(_fileName2, _fileName);

                        context.Photos.Add(
                            new Photo()
                            {
                                Title = _fileName,
                                DateUploaded = DateTime.Now,
                                Uri = _fileName3,
                                Album = _albums.ElementAt(_selectedAlbum - 1)
                            }
                            );
                        await _imageService.AddImageToAzureBlogStorageAsync(_safeAlbumName, _fileName, _image);
                    }

                    context.SaveChanges();
                    ++_albumId;
                }
            }
        }
    }
}
