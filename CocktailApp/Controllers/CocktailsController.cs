using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace CocktailApp.Controllers
{
    [Route("api/cocktail")]
    [ApiController]
    public class CocktailController : ControllerBase
    {
        private readonly string _connectionString = "Data Source=cocktail.db";
        private ILogger<CocktailController> _logger;

        public CocktailController(ILogger<CocktailController> logger)
        {
            _logger = logger;
            _logger.LogInformation("✅ CocktailController istanziato!");
            _logger.LogInformation("Daje aquila");
            Console.WriteLine("Daje aquila");
        }

        // Modello di Cocktail
        public class Cocktail
        {
            public long Id { get; set; }
            public string? Name { get; set; }
            public string? Category { get; set; }
            public string? Alcoholic { get; set; }
            public string? Glass { get; set; }
            public string? Instructions { get; set; }
            public string? ImageUrl { get; set; }
        }

        // Metodo GET per ottenere un cocktail per nome
        [HttpGet("{name}")]
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
                var cocktails = new List<Cocktail>();
                while (await reader.ReadAsync())
                {
                    cocktails.Add(new Cocktail
                    {
                        Id = Convert.ToInt64(reader["id"]),
                        Name = reader["name"].ToString(),
                        Category = reader["category"].ToString(),
                        Alcoholic = reader["alcoholic"].ToString(),
                        Glass = reader["glass"].ToString(),
                        Instructions = reader["instructions"].ToString(),
                        ImageUrl = reader["image_url"].ToString()
                    });
                }
                return Ok(cocktails);
            }

            return NotFound(new { message = "Cocktail non trovato" });
        }

        // Metodo POST per aggiungere un nuovo cocktail
        [HttpPost]
        public async Task<IActionResult> AddCocktail([FromBody] Cocktail cocktail)
        {
            if (cocktail == null)
            {
                return BadRequest(new { message = "Dati cocktail non validi" });
            }

            using var connection = new SqliteConnection(_connectionString);
            await connection.OpenAsync();

            string insertQuery = "INSERT INTO Cocktail (name, category, alcoholic, glass, instructions, image_url) " +
                                 "VALUES (@name, @category, @alcoholic, @glass, @instructions, @image_url)";
            using var command = new SqliteCommand(insertQuery, connection);
            command.Parameters.AddWithValue("@name", cocktail.Name);
            command.Parameters.AddWithValue("@category", cocktail.Category);
            command.Parameters.AddWithValue("@alcoholic", cocktail.Alcoholic);
            command.Parameters.AddWithValue("@glass", cocktail.Glass);
            command.Parameters.AddWithValue("@instructions", cocktail.Instructions);
            command.Parameters.AddWithValue("@image_url", cocktail.ImageUrl);

            var rowsAffected = await command.ExecuteNonQueryAsync();
            if (rowsAffected > 0)
            {
                return CreatedAtAction(nameof(GetCocktailByName), new { name = cocktail.Name }, cocktail);
            }

            return StatusCode(500, new { message = "Errore durante l'inserimento del cocktail" });
        }
    }
}
