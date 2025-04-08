using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using System.IO;

namespace CocktailApp;

public static class BuilderConfig
{
    public static string SpaPath = Path.Combine(Directory.GetCurrentDirectory(), 
        "../CocktailFrontend/dist/cocktail-frontend/browser");

    public static WebApplicationBuilder ConfigureBuilder(WebApplicationBuilder builder)
    {
        builder.Services.AddControllers();
        builder.Services.AddHttpClient();

        ConfigureCors(builder.Services);
        ConfigureSpa(builder.Services);
        SignalRConfig.ConfigureSignalR(builder.Services);
        
        return builder;
    }

    private static void ConfigureCors(IServiceCollection services)
    {
        services.AddCors(options =>
        {
            options.AddPolicy("AllowSpecificOrigin",
                builder => builder.WithOrigins("http://127.0.0.1:5001", "http://localhost:4200")
                                .AllowAnyHeader()
                                .AllowAnyMethod()
                                .AllowCredentials());
        });
    }

    private static void ConfigureSpa(IServiceCollection services)
    {
        services.AddSpaStaticFiles(configuration => 
        {
            configuration.RootPath = SpaPath;
        });
    }
}