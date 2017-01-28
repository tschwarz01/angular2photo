using Angular2Application1.Entities;

namespace Angular2Application1.Infrastructure.Repositories
{
    public class UserRoleRepository : EntityBaseRepository<UserRole>, IUserRoleRepository
    {
        public UserRoleRepository(PhotoGalleryContext context)
            : base(context)
        { }
    }
}
