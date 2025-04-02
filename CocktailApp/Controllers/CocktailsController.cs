using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CocktailApp.Controllers
{
    [ApiController]
    [Route("api/cocktails")]
    public class CocktailController : ControllerBase
    {
         public CocktailController()
    {
        Console.WriteLine("✅ CocktailController istanziato!");
    }
        private readonly string _connectionString = "Data Source=cocktail.db";

        [HttpGet("{name}")]
        [HttpPost("cocktail")]
        public async Task<IActionResult> GetCocktailByName(string name)
        {
            using var connection = new SqliteConnection(_connectionString);
            await connection.OpenAsync();

            string findQuery = "SELECT * FROM Cocktail WHERE name = @name";
            using var command = new SqliteCommand(findQuery, connection);
            command.Parameters.AddWithValue("@name", name);

            using var reader = await command.ExecuteReaderAsync();
            if (reader.HasRows)
            {
                var cocktails = new List<object>();
                while (await reader.ReadAsync())
                {
                    cocktails.Add(new
                    {
                        Id = reader["id"],
                        Name = reader["name"],
                        Category = reader["category"],
                        Alcoholic = reader["alcoholic"],
                        Glass = reader["glass"],
                        Instructions = reader["instructions"],
                        ImageUrl = reader["image_url"]
                    });
                }
                return Ok(cocktails);
            }

            return NotFound(new { message = "Cocktail non trovato" });
        }
    }
}
