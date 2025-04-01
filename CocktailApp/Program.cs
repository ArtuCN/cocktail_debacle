using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.FileProviders;
using System.IO;
using CocktailApp.hubs;
//using CocktailApp.Services; collegato a services non usato ora


var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin",
        builder => builder.WithOrigins("http://127.0.0.1:5001") // Imposta l'origine corretta
                          .AllowAnyHeader()
                          .AllowAnyMethod()
                          .AllowCredentials()); // Permette credenziali
});
var spaPath = Path.Combine(Directory.GetCurrentDirectory(), 
    "../CocktailFrontend/dist/cocktail-frontend/browser");
builder.Services.AddSpaStaticFiles(configuration =>
{
    configuration.RootPath = spaPath;
});
builder.Services.AddSignalR(options =>
{
    options.EnableDetailedErrors = true;  // Opzionale: per ottenere errori più dettagliati in caso di problemi
});

var app = builder.Build();
app.UseCors("AllowSpecificOrigin");
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(spaPath),
    RequestPath = ""
});
app.UseSpaStaticFiles();
app.UseAuthorization();
app.MapControllers();
app.MapHub<CocktailHub>("/cocktailHub");
app.UseSpa(spa =>
{
    spa.Options.SourcePath = spaPath;
    Console.WriteLine($"Current Environment: {app.Environment.EnvironmentName}");
});
app.Run();
