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

        [HttpDelete("{mail}/removefavorites/{id}")]
        public async Task<IActionResult> RemoveFavorite(string mail, long id)
        {
            try
            {
                using (SqliteConnection conn = new SqliteConnection(_connectionString))
                {
                    Console.WriteLine($"Removing favorite cocktail with ID {id} for user {mail}");
                    await conn.OpenAsync();
                    string removeQuery = "DELETE FROM UserPreferences WHERE Mail = @Mail AND CocktailIDs = @IdCocktail";
                    using var command = new SqliteCommand(removeQuery, conn);
                    command.Parameters.AddWithValue("@Mail", mail);
                    command.Parameters.AddWithValue("@IdCocktail", id);

                    var rowsAffected = await command.ExecuteNonQueryAsync();

                    if (rowsAffected > 0)
                    {
                        return Ok("Favorite removed successfully.");
                    }
                    else
                    {
                        return NotFound("Favorite not found.");
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal error: {ex.Message}");
            }
        }

        [HttpGet("{mail}/showfavorites")]
        public async Task<IActionResult> ShowFavorites(string mail)
        {
            try
            {
                using (SqliteConnection conn = new SqliteConnection(_connectionString))
                {
                    await conn.OpenAsync();

                    string selectQuery = "SELECT CocktailIDs FROM UserPreferences WHERE Mail = @Mail";
                    using var command = new SqliteCommand(selectQuery, conn);
                    command.Parameters.AddWithValue("@Mail", mail);

                    using var reader = await command.ExecuteReaderAsync();
                    var favoriteCocktailIds = new List<string>();

                    while (await reader.ReadAsync())
                    {
                        var cocktailId = reader.GetString(0);
                        favoriteCocktailIds.Add(cocktailId);
                    }

                    if (favoriteCocktailIds.Count == 0)
                    {
                        return NotFound("nessun favorito per te.");
                    }

                    // Ora scarichiamo i dettagli da TheCocktailDB per ogni ID
                    var cocktailDetails = new List<object>();  // Cambia il tipo per mappare solo le proprietà che ti servono

                    foreach (var id in favoriteCocktailIds)
                    {
                        var apiUrl = $"https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i={id}";
                        var response = await _httpClient.GetAsync(apiUrl);
                        var content = await response.Content.ReadAsStringAsync();
                        var json = JsonDocument.Parse(content);

                        if (json.RootElement.TryGetProperty("drinks", out var drinks) && drinks.GetArrayLength() > 0)
                        {
                            var drink = drinks[0];
                            var cocktailSummary = new
                            {
                                idDrink = drink.GetProperty("idDrink").GetString(),
                                strDrink = drink.GetProperty("strDrink").GetString(),
                                strDrinkThumb = drink.GetProperty("strDrinkThumb").GetString(),
                            };

                            cocktailDetails.Add(cocktailSummary);  // Aggiungi solo le proprietà necessarie
                        }
                    }

                    return Ok(cocktailDetails); // Ritorna la lista di cocktail parziali
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal error: {ex.Message}");
            }
        }



    }
}