using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.FileProviders;
using System.IO;

var builder = WebApplication.CreateBuilder();

var frontendPath = Path.Combine(Directory.GetCurrentDirectory(), "../CocktailFrontend/src"); 


var app = builder.Build();


app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(frontendPath),
    RequestPath = ""
});

app.MapGet("/", async (context) =>
{
    var filePath = Path.Combine(frontendPath, "index.html");
    context.Response.ContentType = "text/html";
    await context.Response.SendFileAsync(filePath);
});

app.Run();
