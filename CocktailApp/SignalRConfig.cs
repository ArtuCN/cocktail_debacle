using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
namespace CocktailApp;
using CocktailApp.hubs;


public static class SignalRConfig
{
    public static void ConfigureSignalR(IServiceCollection services)
    {
        services.AddSignalR(options =>
        {
            options.EnableDetailedErrors = true;
        });
    }

    public static void MapSignalRHubs(WebApplication app)
    {
        app.MapHub<CocktailHub>("/cocktailHub");
    }
}