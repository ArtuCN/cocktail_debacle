using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.Text;
using CocktailApp.Class;
using Microsoft.Extensions.Options;

namespace CocktailApp
{
    public static class BuilderConfig
    {
        public static string SpaPath = Path.Combine(Directory.GetCurrentDirectory(),
            "../CocktailFrontend/dist/cocktail-frontend/browser");

        public static WebApplicationBuilder ConfigureBuilder(WebApplicationBuilder builder)
        {
            builder.Services.AddControllers();
            builder.Services.AddHttpClient();

            ConfigureCors(builder.Services);
            ConfigureSpa(builder.Services);
            SignalRConfig.ConfigureSignalR(builder.Services);

            // Aggiungi configurazione JWT
            ConfigureJwtAuthentication(builder);

            return builder;
        }

        private static void ConfigureCors(IServiceCollection services)
        {
            services.AddCors(options =>
            {
                options.AddPolicy("AllowSpecificOrigin",
                    builder => builder.WithOrigins("http://127.0.0.1:5001", "http://localhost:4200")
                                    .AllowAnyHeader()
                                    .AllowAnyMethod()
                                    .AllowCredentials());
            });
        }

        private static void ConfigureSpa(IServiceCollection services)
        {
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = SpaPath;
            });
        }

        private static void ConfigureJwtAuthentication(WebApplicationBuilder builder)
        {
            var jwtSettings = builder.Configuration.GetSection("JwtSettings");
            builder.Services.Configure<JwtSettings>(jwtSettings);

            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                var secretKey = builder.Configuration["JwtSettings:Secret"];
                if (string.IsNullOrEmpty(secretKey))
                {
                    throw new InvalidOperationException("JWT Secret key is not configured in app settings.");
                }

                var key = Encoding.ASCII.GetBytes(secretKey);

                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key)
                };
            });

            builder.Services.AddAuthorization();
        }

    }
}
