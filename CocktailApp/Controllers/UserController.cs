using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;
using System.Collections.Generic;
using System.Threading.Tasks;
using BCrypt.Net;
using CocktailApp;

namespace CocktailApp.Controllers
{
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
                    string formattedBirthDate = user.BirthDate.ToString("yyyy-MM-dd");
                    string hashedPassword = BCrypt.Net.BCrypt.HashPassword(user.Psw);
                    Console.WriteLine($"Data formattata {formattedBirthDate}");
                    conn.Open();
                    string query = "INSERT INTO User (Mail, FirstName, LastName, BirthDate, Psw) VALUES (@Mail, @FirstName, @LastName, @BirthDate, @Psw)";
                    
                    using (SqliteCommand cmd = new SqliteCommand(query, conn))
                    {
                        cmd.Parameters.AddWithValue("@Mail", user.Mail);
                        cmd.Parameters.AddWithValue("@FirstName", user.FirstName);
                        cmd.Parameters.AddWithValue("@LastName", user.LastName);
                        cmd.Parameters.AddWithValue("@BirthDate", formattedBirthDate);
                        cmd.Parameters.AddWithValue("@Psw", hashedPassword);

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
        [HttpPost("login")]
        public async Task<IActionResult> loginUser([FromBody] loginData ld)
        {
            try
            {
                using (SqliteConnection conn = new SqliteConnection(_connectionString))
                {
                    Console.WriteLine($"Searching if {ld.Mail} exists and {ld.Psw} is correct");

                    await conn.OpenAsync();

                    string findQuery = "SELECT * FROM User WHERE Mail = @mail";
                    using var command = new SqliteCommand(findQuery, conn);
                    command.Parameters.AddWithValue("@mail", ld.Mail);
                    using var reader = await command.ExecuteReaderAsync();
                    if (await reader.ReadAsync())
                    {
                        string storedHash = reader["Psw"].ToString();
                        if (BCrypt.Net.BCrypt.Verify(ld.Psw, storedHash))
                        {
                            Console.WriteLine("User found and password is correct!");
                            return Ok("Login successful");
                        }
                        else
                        {
                            Console.WriteLine("Password is incorrect.");
                            return BadRequest("Invalid login credentials");
                        }
                    }
                    else
                    {
                        Console.WriteLine("No matching user found.");
                        return BadRequest("Invalid login credentials");
                    }
                }
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