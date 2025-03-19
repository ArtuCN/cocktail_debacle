using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.FileProviders;
using System.IO;
using Ext.Extensions;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSpaStaticFiles(configuration =>
{
    configuration.RootPath = Path.Combine(Directory.GetCurrentDirectory(), "../CocktailFrontend/dist/cocktail-frontend/browser");
});

var app = builder.Build();

app.UseSpa(spa =>
{
    spa.Options.SourcePath = "../CocktailFrontend/dist/cocktail-frontend/browser"; // Percorso del codice Angular

    // Se siamo in ambiente di sviluppo, usa il proxy verso il server di sviluppo Angular
    if (app.Environment.IsDevelopment())
    {
        spa.UseProxyToSpaDevelopmentServer("http://localhost:4200"); // Proxy per lo sviluppo
    }
});

// Esegui l'app
app.Run();
