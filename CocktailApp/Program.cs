using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.FileProviders;
using Microsoft.AspNetCore.Mvc.ApplicationParts;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.AspNetCore.Routing;
using System;
using System.IO;
using System.Linq;
using CocktailApp.hubs;


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


var spaPath = Path.Combine(Directory.GetCurrentDirectory(), "../CocktailFrontend/dist/cocktail-frontend/browser");
Console.WriteLine($"🔍 Percorso SPA: {spaPath}");

if (!Directory.Exists(spaPath))
{
    Console.WriteLine("❌ ERRORE: Il percorso SPA non esiste!");
}
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
app.UseSpa(spa =>
{
    spa.Options.SourcePath = spaPath;

    spa.Options.DefaultPageStaticFileOptions = new StaticFileOptions
    {
        FileProvider = new PhysicalFileProvider(spaPath),
        RequestPath = "",
        OnPrepareResponse = ctx =>
        {
            // Log per debugging
            Console.WriteLine($"📄 Servendo file statico: {ctx.File.Name}");
        }
    };

    spa.Options.DefaultPage = "/index.csr.html"; // Indica che deve servire questo file come index
    Console.WriteLine($"🔍 SPA configurata per servire: {spa.Options.DefaultPage}");
});
app.UseSpaStaticFiles();
app.UseAuthorization();

// Aggiungi il routing per i controller
app.MapControllers();

// 📌 Recupera i controller registrati
var partManager = app.Services.GetRequiredService<ApplicationPartManager>();
var feature = new ControllerFeature();
partManager.PopulateFeature(feature);

Console.WriteLine("📌 Controller registrati:");
if (feature.Controllers.Count == 0)
{
    Console.WriteLine("❌ Nessun controller trovato!");
}
else
{
    foreach (var controller in feature.Controllers)
    {
        Console.WriteLine($" - {controller.Name.Replace("Controller", "")}");
    }
}
var controllerFeature = app.Services.GetRequiredService<Microsoft.AspNetCore.Mvc.ApplicationParts.ApplicationPartManager>()
    .FeatureProviders
    .OfType<Microsoft.AspNetCore.Mvc.Controllers.ControllerFeatureProvider>()
    .FirstOrDefault();
// 📌 Recupera gli endpoint registrati **DOPO** aver aggiunto il routing
Console.WriteLine("📌 Endpoint registrati:");
if (controllerFeature != null)
{
    foreach (var controller in feature.Controllers)
    {
        Console.WriteLine($"Controller trovato: {controller.Name}");
    }
}
else
{
    Console.WriteLine("❌ Nessun controller trovato!");
}
app.MapHub<CocktailHub>("/cocktailHub");
/*
app.UseSpa(spa =>
{
    spa.Options.SourcePath = spaPath;
    Console.WriteLine($"Current Environment: {app.Environment.EnvironmentName}");
});
*/
// 📌 Stampa gli URL su cui gira l'API
Console.WriteLine("✅ API running at:");
foreach (var url in builder.WebHost.GetSetting("urls")?.Split(';') ?? new string[0])
{
    Console.WriteLine($" - {url}");
}



app.Run();
