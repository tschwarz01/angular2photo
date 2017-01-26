using Angular2Application1.Entities;
using Angular2Application1.Infrastructure.Core;
using Angular2Application1.Infrastructure.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Angular2Application1.Infrastructure.Services
{
    public class ImageService : IImageService
    {
        private readonly CloudStorageAccount storageAccount;
        private readonly ILoggingRepository _loggingRepository;
        private readonly string blobContainerName = "galleryimages";

        public ImageService(ILoggingRepository loggingRepository)
        {
            _loggingRepository = loggingRepository;
            storageAccount = new CloudStorageAccount(
                new Microsoft.WindowsAzure.Storage.Auth.StorageCredentials(
                    "stgtwscloudimages",
                    "7V+BZU552oCIg+9uhz4mq2gb76y6aHWzRzNqL8kFlojuQUEZGTfa7wgPjJJUP8rSNb9sNI63HG5OxVQktmfD1w=="), true);
        }

        public async Task AddImageToAzureBlogStorageAsync(string safeAlbumName, string imageShortFileName, string imageFullPath)
        {
            IActionResult _result = new ObjectResult(false);
            GenericResult _uploadResult = null;

            try
            {
                CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();

                // Get a reference to a container named “my-new-container.”
                CloudBlobContainer blobContainer = blobClient.GetContainerReference(blobContainerName);

                //await container.CreateIfNotExistsAsync();
                if (await blobContainer.CreateIfNotExistsAsync())
                {
                    await blobContainer.SetPermissionsAsync(new BlobContainerPermissions
                    {
                        PublicAccess = BlobContainerPublicAccessType.Blob
                    });
                }

                string _imageName = $"{safeAlbumName}/{imageShortFileName}";
                CloudBlockBlob blob = blobContainer.GetBlockBlobReference(@"{safeAlbumName}/{imageShortFileName}");
                await blob.UploadFromFileAsync(imageFullPath);

                _uploadResult = new GenericResult()
                {
                    Succeeded = true,
                    Message = $"The image was copied to the Azure blob: {imageShortFileName}"
                };

            }
            catch (Exception ex)
            {
                _uploadResult = new GenericResult()
                {
                    Succeeded = false,
                    Message = ex.Message
                };

                _loggingRepository.Add(new Error() { Message = ex.Message, StackTrace = ex.StackTrace, DateCreated = DateTime.Now });
                _loggingRepository.Commit();
            }

            _result = new ObjectResult(_uploadResult);
        }
    }
}
