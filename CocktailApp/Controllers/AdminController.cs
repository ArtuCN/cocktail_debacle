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
                command.CommandText = "SELECT Id, Mail, UserName, BirthDate, AcceptedTerms, IsOnline FROM User";

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
                            AcceptedTerms = reader.GetBoolean(4),
                            IsOnline = reader.GetBoolean(5)
                        };
                        users.Add(user);
                    }
                }
            }

            return Ok(users);
        }
        [HttpDelete("kickout/{UserName}")]
        public async Task<IActionResult> KickUserAndRelatedData([FromRoute] string UserName)
        {
            Console.WriteLine($"Ingresso {UserName}");
            if (string.IsNullOrWhiteSpace(UserName))
            {
                return BadRequest("User parameter cannot be null or empty.");
            }
            using (var connection = new SqliteConnection(_connectionString))
            {
                await connection.OpenAsync();
                Console.WriteLine("Daje");

                using (var transaction = await connection.BeginTransactionAsync())
                {
                    try
                    {
                        // Ottieni la mail dell'utente
                        var getUserMailCommand = connection.CreateCommand();
                        getUserMailCommand.CommandText = "SELECT Mail FROM User WHERE UserName = @UserName";
                        var userNameParam = getUserMailCommand.CreateParameter();
                        userNameParam.ParameterName = "@UserName";
                        userNameParam.Value = UserName;
                        userNameParam.DbType = System.Data.DbType.String;
                        getUserMailCommand.Parameters.Add(userNameParam);
                        var userMailObj = await getUserMailCommand.ExecuteScalarAsync();
                        if (userMailObj == null)
                        {
                            Console.WriteLine("Not found");
                            return NotFound($"User '{UserName}' not found.");
                        }
                        string userMail = userMailObj.ToString();
                        Console.WriteLine($"Mail = {userMail}");

                        // Elimina da UserPreferences
                        var deletePreferencesCommand = connection.CreateCommand();
                        deletePreferencesCommand.CommandText = "DELETE FROM UserPreferences WHERE Mail = @Mail";
                        var mailParam = deletePreferencesCommand.CreateParameter();
                        mailParam.ParameterName = "@Mail";
                        mailParam.Value = userMail;
                        mailParam.DbType = System.Data.DbType.String;
                        deletePreferencesCommand.Parameters.Add(mailParam);
                        await deletePreferencesCommand.ExecuteNonQueryAsync();

                        // Elimina da User
                        var deleteUserCommand = connection.CreateCommand();
                        deleteUserCommand.CommandText = "DELETE FROM User WHERE Mail = @Mail";
                        deleteUserCommand.Parameters.Add(mailParam);
                        var rowsAffected = await deleteUserCommand.ExecuteNonQueryAsync();

                        await transaction.CommitAsync();

                        if (rowsAffected > 0)
                        {
                            return Ok($"User '{UserName}' and related data have been removed.");
                        }
                        else
                        {
                            return NotFound($"User '{UserName}' not found.");
                        }
                    }
                    catch (Exception ex)
                    {
                        await transaction.RollbackAsync();
                        return StatusCode(500, $"An error occurred: {ex.Message}");
                    }
                }
            }
        }
        [HttpGet("messages")]
        public async Task<IActionResult> GetAllMessages()
        {
            var messages = new List<MessageAdmin>();

            using (var connection = new SqliteConnection(_connectionString))
            {
                await connection.OpenAsync();
                var command = connection.CreateCommand();
                command.CommandText = "SELECT Id, Sender, MessageText, SendingTime FROM Message";

                using (var reader = await command.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        messages.Add(new MessageAdmin
                        {
                            Id = reader.GetInt32(0),
                            Sender = reader.GetString(1),
                            MessageText = reader.GetString(2),
                            SendingTime = reader.GetDateTime(3)
                        });
                    }
                }
            }

            return Ok(messages);
        }
        [HttpDelete("messages/{id}")]
        public async Task<IActionResult> DeleteMessage(int id)
        {
            using (var connection = new SqliteConnection(_connectionString))
            {
                await connection.OpenAsync();
                var command = connection.CreateCommand();
                command.CommandText = "DELETE FROM Message WHERE Id = @Id";
                var idParam = command.CreateParameter();
                idParam.ParameterName = "@Id";
                idParam.Value = id;
                idParam.DbType = System.Data.DbType.Int32;
                command.Parameters.Add(idParam);

                var rowsAffected = await command.ExecuteNonQueryAsync();
                if (rowsAffected > 0)
                {
                    return Ok($"Message {id} deleted successfully.");
                }
                else
                {
                    return NotFound($"Message with ID {id} not found.");
                }
            }
        }

    }
}