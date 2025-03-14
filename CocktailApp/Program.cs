using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.FileProviders;
using System.IO;

var builder = WebApplication.CreateBuilder(new WebApplicationOptions
{
    WebRootPath = "../CocktailFrontend/src" // Indica il percorso dei file statici
});

var app = builder.Build();

app.UseStaticFiles();

// Aggiungi un middleware personalizzato per tracciare le richieste
app.Use(async (context, next) =>
{
    var filePath = Path.Combine(builder.Environment.WebRootPath, "index.html");
    Console.WriteLine($"Cerco di servire il file: {filePath}");

    // Se il file esiste, stamperò un messaggio
    if (File.Exists(filePath))
    {
        Console.WriteLine($"Il file {filePath} è presente!");
    }
    else
    {
        Console.WriteLine($"Il file {filePath} NON è stato trovato.");
    }

    // Continua la pipeline di richiesta
    await next();
});

app.Run();
