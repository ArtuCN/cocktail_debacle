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
using CocktailApp;
using static CocktailApp.SignalRConfig;
using System.Text;
using Microsoft.Extensions.DependencyInjection;
using CocktailApp.Class;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);
builder = CocktailApp.BuilderConfig.ConfigureBuilder(builder);
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
builder.Services.Configure<JwtSettings>(jwtSettings);

var app = builder.Build();

app.UseCors("AllowSpecificOrigin");
app.UseRouting();
app.UseAuthorization();
app.MapControllers();
CocktailApp.SignalRConfig.MapSignalRHubs(app);
app.UseSpaStaticFiles();

app.Use(async (context, next) =>
{
    var acceptHeader = context.Request.Headers["Accept"].ToString();
    Console.WriteLine($"➡️ Tipo di contenuto richiesto: {acceptHeader}");
    await next();
});

app.Use(async (context, next) =>
{
    Console.WriteLine($"➡️ Richiesta ricevuta: {context.Request.Method} {context.Request.Path}");
    Console.WriteLine($"🌐 URL richiesta completa: {context.Request.Method} {context.Request.Path + context.Request.QueryString}");

    if (context.Request.Path.StartsWithSegments("/api"))
    {
        Console.WriteLine("➡️ Passando alla logica API");
        await next();  // Passa al controller API
        Console.WriteLine($"📡 Risposta API: {context.Response.StatusCode}");
        return;
    }

    if (context.Request.Path.StartsWithSegments("/cocktailHub"))
    {
        Console.WriteLine("🍹 Gestendo richiesta per /cocktailHub");
        await next();  // Passa a SignalR o API
        return;
    }

    // Continuo il normale flusso per le altre richieste
    await next();
});

app.UseSpa(spa =>
{
    spa.Options.SourcePath = CocktailApp.BuilderConfig.SpaPath;
    spa.Options.DefaultPageStaticFileOptions = new StaticFileOptions
    {
        FileProvider = new PhysicalFileProvider(BuilderConfig.SpaPath),
        RequestPath = "",
        OnPrepareResponse = ctx => Console.WriteLine($"📄 Servendo file statico: {ctx.File.Name}")
    };
    spa.Options.DefaultPage = "/index.csr.html";
});

app.Run();




