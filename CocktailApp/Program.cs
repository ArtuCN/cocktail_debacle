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
    await next();
});

app.Use(async (context, next) =>
{
    if (context.Request.Path.StartsWithSegments("/api"))
    {
        await next();
        return;
    }

    if (context.Request.Path.StartsWithSegments("/cocktailHub"))
    {
        await next();
        return;
    }

    await next();
});

app.UseSpa(spa =>
{
    spa.Options.SourcePath = CocktailApp.BuilderConfig.SpaPath;
    spa.Options.DefaultPageStaticFileOptions = new StaticFileOptions
    {
        FileProvider = new PhysicalFileProvider(BuilderConfig.SpaPath),
        RequestPath = "",
        OnPrepareResponse = ctx => Console.WriteLine($"📄 Using static file: {ctx.File.Name}")
    };
    spa.Options.DefaultPage = "/index.html";
});

app.Run();




