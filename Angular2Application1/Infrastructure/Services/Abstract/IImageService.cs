using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Angular2Application1.Infrastructure.Services
{
    public interface IImageService
    {
        Task AddImageToAzureBlogStorageAsync(string safeAlbumName, string imageShortFileName, string imageFullPath);
    }
}
