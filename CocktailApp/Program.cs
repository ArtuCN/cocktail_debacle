using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.FileProviders;
using System.IO;
using Ext.Extensions;

var builder = WebApplication.CreateBuilder(args);

// Registra i servizi
builder.Services.ConfigureCors();
builder.Services.AddControllers();
builder.Services.AddSpaStaticFiles(configuration =>
{
    configuration.RootPath = "ClientApp/dist"; // Dove Angular genera i file
});

var app = builder.Build();

// Abilita CORS
app.UseCors("AllowAngular");

app.UseStaticFiles(); // Serve file statici
app.UseSpaStaticFiles(); // Serve l'app Angular



app.MapControllers();


app.UseSpa(spa =>
{
    spa.Options.SourcePath = "../CocktailFrontend"; // Percorso del codice Angular

    if (app.Environment.IsDevelopment())
    {
        spa.UseProxyToSpaDevelopmentServer("http://localhost:4200"); // Proxy per lo sviluppo
    }
});

app.Run();