using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.FileProviders;

using System.IO;
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers(); // Aggiunge il supporto per API

var spaPath = Path.Combine(Directory.GetCurrentDirectory(), "../CocktailFrontend/dist/cocktail-frontend/browser");

builder.Services.AddSpaStaticFiles(configuration =>
{
    configuration.RootPath = spaPath;
});

var app = builder.Build();

app.MapControllers(); // Nuovo modo consigliato per registrare le API


// Middleware per i file statici di Angular
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(spaPath),
    RequestPath = ""
});
app.UseSpaStaticFiles();

app.UseSpa(spa =>
{
    spa.Options.SourcePath = spaPath;

    if (app.Environment.IsDevelopment())
    {
        // Usa il server di sviluppo Angular in locale
        spa.UseProxyToSpaDevelopmentServer("http://localhost:4200");
    }
});

app.Run();
