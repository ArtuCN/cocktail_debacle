using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;
using System.Collections.Generic;
using System.Threading.Tasks;

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
                    Console.WriteLine("Gioco");
                    Console.WriteLine($"Received User: FirstName = {user.FirstName}, LastName = {user.LastName}, Mail = {user.Mail}, BirthDate = {user.BirthDate}, Psw = {user.Psw}");
                    string formattedBirthDate = user.BirthDate.ToString("yyyy-MM-dd");
                    Console.WriteLine($"Data formattata {formattedBirthDate}");
                    conn.Open();
                    string query = "INSERT INTO User (Mail, FirstName, LastName, BirthDate, Psw) VALUES (@Mail, @FirstName, @LastName, @BirthDate, @Psw)";
                    
                    using (SqliteCommand cmd = new SqliteCommand(query, conn))
                    {
                        Console.WriteLine("Pirografo1");
                        cmd.Parameters.AddWithValue("@Mail", user.Mail);
                        Console.WriteLine("Pirografo2");
                        cmd.Parameters.AddWithValue("@FirstName", user.FirstName);
                        Console.WriteLine("Pirografo3");
                        cmd.Parameters.AddWithValue("@LastName", user.LastName);
                        Console.WriteLine("Pirografo4");
                        cmd.Parameters.AddWithValue("@BirthDate", formattedBirthDate);
                        Console.WriteLine("Pirografo5");
                        cmd.Parameters.AddWithValue("@Psw", user.Psw);
                        Console.WriteLine("Pirografo6");

                        cmd.ExecuteNonQuery();
                        Console.WriteLine("Pirografo7");
                    }
                }
                Console.WriteLine("Pirografo");
                return Ok("User created successfully");
            }
            catch (SqliteException ex)
            {
                Console.WriteLine("Pisello");
                return BadRequest($"Database error: {ex.Message}");
            }
            catch (Exception ex)
            {
                Console.WriteLine("Cuscino");
                return BadRequest($"Unexpected error: {ex.Message}");
            }
        }
    }
}