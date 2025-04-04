using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;
using System.Collections.Generic;
using System.Threading.Tasks;
using BCrypt.Net;

namespace CocktailApp.Controllers
{
    public class User
    {
        public long Id {get; set;}
        public required string? FirstName {get; set;}
        public required string? LastName {get; set;}
        public required string? Mail {get; set;}
        public required string? Psw {get; set;}
        public DateTime BirthDate {get; set;}
    }
    [ApiController]
    [Route("api/user")]

    public class UserController : ControllerBase
    {  
        private readonly string _connectionString = "Data Source=cocktail.db";

        [HttpPost("create")]
        public IActionResult CreateUser([FromBody] User user)
        {
            try
            {
                using (SqliteConnection conn = new SqliteConnection(_connectionString))
                {
                    Console.WriteLine($"Received User: FirstName = {user.FirstName}, LastName = {user.LastName}, Mail = {user.Mail}, BirthDate = {user.BirthDate}, Psw = {user.Psw}");
                    string hashedPsw = BCrypt.Net.BCrypt.HashPassword(user.Psw);
                    Console.WriteLine($"Cripted psw {hashedPsw}");
                    string formattedBirthDate = user.BirthDate.ToString("yyyy-MM-dd");
                    conn.Open();
                    string query = "INSERT INTO User (Mail, FirstName, LastName, BirthDate, Psw) VALUES (@Mail, @FirstName, @LastName, @BirthDate, @Psw)";
                    
                    using (SqliteCommand cmd = new SqliteCommand(query, conn))
                    {
                        cmd.Parameters.AddWithValue("@Mail", user.Mail);
                        cmd.Parameters.AddWithValue("@FirstName", user.FirstName);
                        cmd.Parameters.AddWithValue("@LastName", user.LastName);
                        cmd.Parameters.AddWithValue("@BirthDate", formattedBirthDate);
                        cmd.Parameters.AddWithValue("@Psw", hashedPsw);

                        cmd.ExecuteNonQuery();
                    }
                }
                return Ok("User created successfully");
            }
            catch (SqliteException ex)
            {
                return BadRequest($"Database error: {ex.Message}");
            }
            catch (Exception ex)
            {
                return BadRequest($"Unexpected error: {ex.Message}");
            }
        }
    }
}