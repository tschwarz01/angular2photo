using Angular2Application1.Entities;
using Angular2Application1.ViewModels;
using AutoMapper;
using System.Linq;

namespace Angular2Application1.Infrastructure.Mappings
{
    public class DomainToViewModelMappingProfile : Profile
    {
        protected override void Configure()
        {
            AutoMapper.Mapper.Initialize(cfg =>
            {
                cfg.CreateMap<Photo, PhotoViewModel>()
                    .ForMember(vm => vm.Uri, map => map.MapFrom(p => "/images/" + p.Uri));

                cfg.CreateMap<Album, AlbumViewModel>()
                    .ForMember(vm => vm.TotalPhotos, map => map.MapFrom(a => a.Photos.Count))
                    .ForMember(vm => vm.Thumbnail, map =>
                        map.MapFrom(a => (a.Photos != null && a.Photos.Count > 0) ?
                        "/images/" + a.Photos.First().Uri : "/images/thumbnail-default.png"));


                cfg.CreateMap<ViewModels.AlbumViewModel, Entities.Album>().ReverseMap();
            });

        }
    }
}
