using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;


namespace Ext.Extensions
{
    public static class ServiceExtensions
    {
        public static void ConfigureCors(this IServiceCollection services)
        {
            services.AddCors(options =>
            {
                options.AddPolicy("AllowAngular",
                    policy =>
                    {
                        policy.WithOrigins("http://localhost:4200") // Cambia se serve
                              .AllowAnyMethod()
                              .AllowAnyHeader();
                    });
            });
        }
    }
}