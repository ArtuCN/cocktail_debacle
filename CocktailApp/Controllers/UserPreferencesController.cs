using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;
using System.Collections.Generic;
using System.Threading.Tasks;
using CocktailApp;
using System;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using CocktailApp.Utils;


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

        [HttpGet("{mail}/favorites/contains/{id}")]
        public async Task<IActionResult> IsFavorite(string mail, long id)
        {
            try
            {
                using (var conn = new SqliteConnection(_connectionString))
                {
                    await conn.OpenAsync();
                    var query = "SELECT 1 FROM UserPreferences WHERE Mail = @Mail AND INSTR(CocktailIDs, @Id) > 0";

                    using var cmd = new SqliteCommand(query, conn);
                    cmd.Parameters.AddWithValue("@Mail", mail);
                    cmd.Parameters.AddWithValue("@Id", id.ToString());

                    var result = await cmd.ExecuteScalarAsync();
                    bool found = result != null;
                    return Ok(found);
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Errore interno: {ex.Message}");
            }
        }


        [HttpPost("{mail}/favorites/{id}")]
        public async Task<IActionResult> AddFavorite(string mail, long id)
        {
            try
            {
                using (SqliteConnection conn = new SqliteConnection(_connectionString))
                {
                    await conn.OpenAsync();
                    string findQuery = "SELECT * FROM User WHERE Mail = @mail";
                    using var command = new SqliteCommand(findQuery, conn);
                    command.Parameters.AddWithValue("@mail", mail);
                    using var reader = await command.ExecuteReaderAsync();
                    if (await reader.ReadAsync())
                    {
                        ;
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
            return Ok(new { message = "Favorite added" });
        }

        [HttpDelete("{mail}/removefavorites/{id}")]
        public async Task<IActionResult> RemoveFavorite(string mail, long id)
        {
            try
            {
                using (SqliteConnection conn = new SqliteConnection(_connectionString))
                {
                    await conn.OpenAsync();
                    string removeQuery = "DELETE FROM UserPreferences WHERE Mail = @Mail AND CocktailIDs = @IdCocktail";
                    using var command = new SqliteCommand(removeQuery, conn);
                    command.Parameters.AddWithValue("@Mail", mail);
                    command.Parameters.AddWithValue("@IdCocktail", id);

                    var rowsAffected = await command.ExecuteNonQueryAsync();

                    if (rowsAffected > 0)
                    {
                        return Ok(new { message = "Favorite removed successfully."});
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
                    var favoriteCocktails = new List<string>(); // Lista per memorizzare gli ID dei cocktail

                    // Legge ogni riga e aggiunge l'ID del cocktail alla lista
                    while (await reader.ReadAsync())
                    {
                        var cocktailId = reader.GetString(0); // Supponiamo che la colonna sia CocktailIDs
                        favoriteCocktails.Add(cocktailId);
                    }

                    if (favoriteCocktails.Count >= 0)
                    {
                        return Ok(favoriteCocktails); // Restituisce gli ID dei cocktail preferiti come una lista
                    }
                    else
                    {
                        return NotFound("No favorites found for this user.");
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal error: {ex.Message}");
            }
        }

        [HttpGet("{mail}/terms")]
        public async Task<IActionResult> terms(string mail)
        {
            try
            {
                using (SqliteConnection conn = new SqliteConnection(_connectionString))
                {
                    await conn.OpenAsync();
                    string selectQuery = "SELECT AcceptedTerms FROM User WHERE Mail = @Mail";
                    using var command = new SqliteCommand(selectQuery, conn);
                    command.Parameters.AddWithValue("@Mail", mail);
                    using var reader = await command.ExecuteReaderAsync();
                    if (await reader.ReadAsync())
                    {
                        bool response = reader.GetBoolean(0);
                        if (response)
                        {
                            return Ok(true);
                        }
                        else
                        {
                            return Ok(false);
                        }
                    }
                    else
                    {
                        return NotFound("User not found.");
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal error: {ex.Message}");
            }
        }

        [HttpGet("{mail}/suggestions")]
        public async Task<IActionResult> showSuggestions(string mail)
        {
            try
            {
                List<string> favoriteIds =  UserUtils.GetFavoriteCocktailIds(mail);
                if (UserUtils.IsMinor(mail))
                {
                    List<string> suggestions = await UserUtils.Get3NonAlcoholicIdsAsync(favoriteIds);
                    return Ok(suggestions);
                }
                else
                {
                    List<string> suggestions = await UserUtils.Get3AlcoholicIdsAsync(favoriteIds);
                    return Ok(suggestions);
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal error: {ex.Message}");
            }
        }
    }
}