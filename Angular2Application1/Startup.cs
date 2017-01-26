using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SpaServices.Webpack;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using AutoMapper;
using Angular2Application1.Infrastructure.Repositories;
using Newtonsoft.Json.Serialization;
using Angular2Application1.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Angular2Application1.Infrastructure.Mappings;
using Angular2Application1.ViewModels;
using Angular2Application1.Entities;

namespace Angular2Application1
{
    public class Startup
    {
        
        public IHostingEnvironment _env;
        private static string _contentRootPath = string.Empty;
        private static string _applicationPath = string.Empty;

        public Startup(IHostingEnvironment env)
        {
            _env = env;
            _applicationPath = env.WebRootPath;
            _contentRootPath = env.ContentRootPath;

            var builder = new ConfigurationBuilder()
                .SetBasePath(_contentRootPath)
                .AddJsonFile("appsettings.json")
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true);

            builder.AddEnvironmentVariables();
            Configuration = builder.Build();
        }

        public IConfigurationRoot Configuration { get; set; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            //  Connection String to photogallery db
            //string sqlConnectionString = Configuration["ConnectionStrings:DefaultConnection"];
            string sqlConnectionString = "Server=.;Database=photogallery3;Trusted_Connection=true;MultipleActiveResultSets=True;";

            // Register Configuration as a singleton service
            services.AddSingleton(Configuration);

            services.AddDbContext<PhotoGalleryContext>(options =>
                options.UseSqlServer(sqlConnectionString));

            services.AddScoped<IPhotoRepository, PhotoRepository>();
            services.AddScoped<IAlbumRepository, AlbumRepository>();
            services.AddScoped<ILoggingRepository, LoggingRepository>();

            // Add framework services.
            services.AddMvc()
            .AddJsonOptions(opt =>
            {
                var resolver = opt.SerializerSettings.ContractResolver;
                if (resolver != null)
                {
                    var res = resolver as DefaultContractResolver;
                    res.NamingStrategy = null;
                }
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            //loggerFactory.AddConsole(Configuration.GetSection("Logging"));
            loggerFactory.AddConsole();
            loggerFactory.AddDebug();

            if (_env.IsEnvironment("Development") || _env.IsEnvironment("Testing") || _env.IsEnvironment("Production"))
            {
                app.UseDeveloperExceptionPage();
                app.UseWebpackDevMiddleware(new WebpackDevMiddlewareOptions {
                    HotModuleReplacement = true
                });
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
            }

            app.UseStaticFiles();

            //app.UseCookieAuthentication(new CookieAuthenticationOptions
            //{
            //    AutomaticAuthenticate = true,
            //    AutomaticChallenge = true
            //});

            AutoMapper.Mapper.Initialize(cfg =>
            {
                //cfg.CreateMap<ViewModels.AlbumViewModel, Entities.Album>().ReverseMap();

                cfg.CreateMap<Photo, PhotoViewModel>()
                    .ForMember(vm => vm.Uri, map => map.MapFrom(p => "/images/" + p.Uri));

                cfg.CreateMap<Album, AlbumViewModel>()
                    .ForMember(vm => vm.TotalPhotos, map => map.MapFrom(a => a.Photos.Count))
                    .ForMember(vm => vm.Thumbnail, map =>
                        map.MapFrom(a => (a.Photos != null && a.Photos.Count > 0) ?
                        "/images/" + a.Photos.First().Uri : "/images/thumbnail-default.png"));
            });

            Mapper.Configuration.AssertConfigurationIsValid();

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");

                //routes.MapSpaFallbackRoute(
                //    name: "spa-fallback",
                //    defaults: new { controller = "Home", action = "Index" });
            });

            DbInitializer.Initialize(app.ApplicationServices, _applicationPath);
        }
    }
}
