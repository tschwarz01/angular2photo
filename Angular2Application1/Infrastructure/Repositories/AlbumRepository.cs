using Angular2Application1.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Angular2Application1.Infrastructure.Repositories
{
    public class AlbumRepository : EntityBaseRepository<Album>, IAlbumRepository
    {
        PhotoGalleryContext _context;
        public AlbumRepository(PhotoGalleryContext context)
            : base(context)
        {
            _context = context;
        }

        public bool AlbumExists(string albumTitle)
        {
            return _context.Albums.Any(a => a.Title == albumTitle);
        }
    }
}
