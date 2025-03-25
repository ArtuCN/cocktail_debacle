using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System.IO;

var builder = WebApplication.CreateBuilder(args);

// Abilita il supporto per file statici SPA
builder.Services.AddSpaStaticFiles(configuration =>
{
    configuration.RootPath = Path.Combine(Directory.GetCurrentDirectory(), "../CocktailFrontend/dist/cocktail-frontend/browser");
});

var app = builder.Build();

// Middleware di ASP.NET Core
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

// Abilita il supporto per file statici
app.UseStaticFiles();
app.UseSpaStaticFiles();

// Middleware di routing (necessario se hai API)
app.UseRouting();

app.UseSpa(spa =>
{
    spa.Options.SourcePath = "../CocktailFrontend/dist/cocktail-frontend/browser";

    if (app.Environment.IsDevelopment())
    {
        spa.UseProxyToSpaDevelopmentServer("http://localhost:4200");
    }
});

app.Run();
