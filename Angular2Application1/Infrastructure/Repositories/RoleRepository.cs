using Angular2Application1.Entities;

namespace Angular2Application1.Infrastructure.Repositories
{
    public class RoleRepository : EntityBaseRepository<Role>, IRoleRepository
    {
        public RoleRepository(PhotoGalleryContext context)
            : base(context)
        { }
    }
}
