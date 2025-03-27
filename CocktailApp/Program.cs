using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.FileProviders;
using System.IO;
using CocktailApp.Services;


var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder => builder.AllowAnyOrigin()
                          .AllowAnyMethod()
                          .AllowAnyHeader());
});
var spaPath = Path.Combine(Directory.GetCurrentDirectory(), 
    "../CocktailFrontend/dist/cocktail-frontend/browser");
builder.Services.AddSpaStaticFiles(configuration =>
{
    configuration.RootPath = spaPath;
});
builder.Services.AddSignalR();
var app = builder.Build();
app.UseCors("AllowAll");
app.UseStaticFiles();
app.UseSpaStaticFiles();
app.MapControllers();
app.MapHub<CocktailHub>("/cocktailHub");
app.UseSpa(spa =>
{
    spa.Options.SourcePath = spaPath;
    if (app.Environment.IsDevelopment())
        spa.UseProxyToSpaDevelopmentServer("http://localhost:4200");
});
app.Run();
