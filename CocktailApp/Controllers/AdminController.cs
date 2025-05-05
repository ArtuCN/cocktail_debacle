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
            if (string.IsNullOrWhiteSpace(UserName))
            {
            return BadRequest("User parameter cannot be null or empty.");
            }

            using (var connection = new SqliteConnection(_connectionString))
            {
            await connection.OpenAsync();

            // Start a transaction
            using (var transaction = await connection.BeginTransactionAsync())
            {
                try
                {
                // Get the user Id based on the UserName
                var getUserIdCommand = connection.CreateCommand();
                getUserIdCommand.CommandText = "SELECT Id FROM User WHERE UserName = @UserName";
                var userNameParam = getUserIdCommand.CreateParameter();
                userNameParam.ParameterName = "@UserName";
                userNameParam.Value = UserName;
                userNameParam.DbType = System.Data.DbType.String;
                getUserIdCommand.Parameters.Add(userNameParam);

                var userId = await getUserIdCommand.ExecuteScalarAsync();

                if (userId == null)
                {
                    return NotFound($"User '{UserName}' not found.");
                }

                // Delete related data using the foreign key (Id)
                var deleteRelatedDataCommand = connection.CreateCommand();
                deleteRelatedDataCommand.CommandText = "DELETE FROM RelatedTable WHERE UserId = @UserId"; // Replace 'RelatedTable' with the actual table name
                var userIdParam = deleteRelatedDataCommand.CreateParameter();
                userIdParam.ParameterName = "@UserId";
                userIdParam.Value = userId;
                userIdParam.DbType = System.Data.DbType.Int32;
                deleteRelatedDataCommand.Parameters.Add(userIdParam);

                await deleteRelatedDataCommand.ExecuteNonQueryAsync();

                // Delete the user
                var deleteUserCommand = connection.CreateCommand();
                deleteUserCommand.CommandText = "DELETE FROM User WHERE Id = @UserId";
                deleteUserCommand.Parameters.Add(userIdParam);

                var rowsAffected = await deleteUserCommand.ExecuteNonQueryAsync();

                // Commit the transaction
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
                // Rollback the transaction in case of an error
                await transaction.RollbackAsync();
                return StatusCode(500, $"An error occurred: {ex.Message}");
                }
            }
            }
        }
    }
}