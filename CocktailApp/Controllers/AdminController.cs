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
    [Route("api/admin")]
    public class AdminController : ControllerBase
    {
        private readonly string _connectionString = "Data Source=cocktail.db";
        private readonly HttpClient _httpClient;

        public AdminController(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = new List<UserInfo>();

            using (var connection = new SqliteConnection(_connectionString))
            {
                await connection.OpenAsync();
                
                var command = connection.CreateCommand();
                command.CommandText = "SELECT Id, Mail, UserName, BirthDate, AcceptedTerms FROM User";

                using (var reader = await command.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        var user = new UserInfo
                        {
                            Id = reader.GetInt32(0),
                            Mail = reader.GetString(1),
                            UserName = reader.GetString(2),
                            BirthDate = reader.GetDateTime(3),
                            AcceptedTerms = reader.GetBoolean(4)
                        };
                        users.Add(user);
                    }
                }
            }

            return Ok(users);
        }
    }
}