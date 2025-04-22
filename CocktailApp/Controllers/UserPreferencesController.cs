using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;
using System.Collections.Generic;
using System.Threading.Tasks;
using CocktailApp;
using System;
using System.Security.Claims;
using System.Text;
using System.Text.Json;


namespace CocktailApp.Controllers
{
    [ApiController]
    [Route("api/user")]

    public class UserPreferencesController : ControllerBase
    {  
        private readonly string _connectionString = "Data Source=cocktail.db";
        private readonly HttpClient _httpClient;

        public UserPreferencesController(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }
        [HttpPost("{mail}/favorites/{id}")]
        public async Task<IActionResult> AddFavorite(string mail, long id)
        {
            try
            {
                using (SqliteConnection conn = new SqliteConnection(_connectionString))
                {
                    Console.WriteLine($"Searching if {mail} exists and {id} is correct");
                    await conn.OpenAsync();

                    string findQuery = "SELECT * FROM User WHERE Mail = @mail";
                    using var command = new SqliteCommand(findQuery, conn);
                    command.Parameters.AddWithValue("@mail", mail);
                    using var reader = await command.ExecuteReaderAsync();
                    if (await reader.ReadAsync())
                    {
                        Console.WriteLine("User exists!");
                    }
                    else
                    {
                        return NotFound("User not found");
                    }
                    var apiUrl = $"https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i={id}";
                    var response = await _httpClient.GetAsync(apiUrl);
                    var content = await response.Content.ReadAsStringAsync();
                    var json = JsonDocument.Parse(content);
                    var idDrink = json.RootElement
                        .GetProperty("drinks")[0]
                        .GetProperty("idDrink")
                        .GetString();
                    var insertQuery = @"INSERT INTO UserPreferences (Mail, CocktailIDs)
                            VALUES (@Mail, @CocktailIDs);";

                    using var insertCommand = new SqliteCommand(insertQuery, conn);
                    insertCommand.Parameters.AddWithValue("@Mail", mail);
                    insertCommand.Parameters.AddWithValue("@CocktailIDs", idDrink);

                    await insertCommand.ExecuteNonQueryAsync();
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal error: {ex.Message}");
            }
            return Ok("Favorite added");
        }
    }
}