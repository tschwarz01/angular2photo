using Angular2Application1.Entities;
using System.Collections.Generic;

namespace Angular2Application1.Infrastructure.Repositories
{
    public interface IAlbumRepository : IEntityBaseRepository<Album>
        {
            bool AlbumExists(string albumTitle);
        }

        public interface ILoggingRepository : IEntityBaseRepository<Error> { }

        public interface IPhotoRepository : IEntityBaseRepository<Photo> { }

        public interface IRoleRepository : IEntityBaseRepository<Role> { }

        public interface IUserRepository : IEntityBaseRepository<User>
        {
            User GetSingleByUsername(string username);
            IEnumerable<Role> GetUserRoles(string username);
        }

        public interface IUserRoleRepository : IEntityBaseRepository<UserRole> { }

}
