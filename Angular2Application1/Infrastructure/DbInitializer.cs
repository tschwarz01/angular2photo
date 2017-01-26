using Angular2Application1.Entities;
using Angular2Application1.Infrastructure.Services;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Angular2Application1.Infrastructure
{
    public static class DbInitializer
    {
        private static readonly IImageService _imageService;
        private static PhotoGalleryContext context;
        private static string blobContainerName = "galleryimages";
        private static string blobContainerUri = "https://stgtwscloudimages.blob.core.windows.net/galleryimages/";
        public static void Initialize(IServiceProvider serviceProvider, string imagesPath)
        {
            context = (PhotoGalleryContext)serviceProvider.GetService(typeof(PhotoGalleryContext));

            InitializePhotoAlbums(imagesPath);
            InitializeUserRoles();

        }

        private static void InitializePhotoAlbums(string imagesPath)
        {
            if (!context.Albums.Any())
            {


                CloudStorageAccount storageAccount = new CloudStorageAccount(
                new Microsoft.WindowsAzure.Storage.Auth.StorageCredentials(
                    "stgtwscloudimages",
                    "7V+BZU552oCIg+9uhz4mq2gb76y6aHWzRzNqL8kFlojuQUEZGTfa7wgPjJJUP8rSNb9sNI63HG5OxVQktmfD1w=="), true);

                CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();

                // Get a reference to a container named “my-new-container.”
                CloudBlobContainer blobContainer = blobClient.GetContainerReference(blobContainerName);

                //await container.CreateIfNotExistsAsync();
                blobContainer.CreateIfNotExistsAsync();
                
                blobContainer.SetPermissionsAsync(new BlobContainerPermissions
                    {
                        PublicAccess = BlobContainerPublicAccessType.Blob
                    });

                

                List<Album> _albums = new List<Album>(); // I don't know if we need to build this List since we should be adding one album at a time

                string[] _albumPaths = Directory.GetDirectories(Path.Combine(imagesPath, "images"));
                int _albumId = 1;

                foreach (string _albumPath in _albumPaths)
                {
                    var _shortAlbumName = new DirectoryInfo(_albumPath).Name;
                    //var _safeAlbumName = DateTime.Now.ToString("yyyyMMdd", CultureInfo.InvariantCulture);
                    var _album = context.Albums.Add(
                        new Album
                        {
                            DateCreated = DateTime.Now,
                            SafeName = _shortAlbumName,
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

                        //string _azureUri = @"https://stgtwscloudimages.blob.core.windows.net/galleryimages/"+_fileName5;
                        string _azureUri = Path.Combine(blobContainerUri, _fileName3);

                        context.Photos.Add(
                            new Photo()
                            {
                                Title = _fileName,
                                DateUploaded = DateTime.Now,
                                Uri = _fileName3,
                                AzureUri = _azureUri,
                                Album = _albums.ElementAt(_selectedAlbum -1)
                            }
                            );

                        CloudBlockBlob blob = blobContainer.GetBlockBlobReference(_fileName3);
                        blob.UploadFromFileAsync(_image);
                    }

                    context.SaveChanges();
                    ++_albumId;
                }

               
            }
        }

        private static void InitializeUserRoles()
        {
            if (!context.Roles.Any())
            {
                // create roles
                context.Roles.AddRange(new Role[]
                {
                new Role()
                {
                    Name="Admin"
                }
                });

                context.SaveChanges();
            }

            if (!context.Users.Any())
            {
                context.Users.Add(new User()
                {
                    Email = "chsakells.blog@gmail.com",
                    Username = "chsakell",
                    HashedPassword = "9wsmLgYM5Gu4zA/BSpxK2GIBEWzqMPKs8wl2WDBzH/4=",
                    Salt = "GTtKxJA6xJuj3ifJtTXn9Q==",
                    IsLocked = false,
                    DateCreated = DateTime.Now
                });

                // create user-admin for chsakell
                context.UserRoles.AddRange(new UserRole[] {
                new UserRole() {
                    RoleId = 1, // admin
                    UserId = 1  // chsakell
                }
            });
                context.SaveChanges();
            }
        }
    }
}
