using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;
using System.Collections.Generic;
using System.Threading.Tasks;
using BCrypt.Net;
using CocktailApp;
using System;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;

namespace CocktailApp.Controllers
{
    [ApiController]
    [Route("api/user")]

    public class UserController : ControllerBase
    {  
        private readonly string _connectionString = "Data Source=cocktail.db";

        private string GenerateJwtToken(string mail, string UserName)
        {
            var secretKey = "y0uR$up3r$ecret!Key_Wh1ch_1s_Long#Enough!";
            var key = Encoding.ASCII.GetBytes(secretKey);

            Console.WriteLine($"generando token per email: {mail} e nome: {UserName}");
            var claims = new[]
            {
                new Claim(ClaimTypes.Email, mail),
                new Claim(ClaimTypes.Name, UserName)
            };

            var credentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(
                expires: DateTime.Now.AddHours(1),
                claims: claims,
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateUser([FromBody] JsonElement data)
        {
            Console.WriteLine("➡️ Entrato nel metodo create");

            try
            {
                var user = new User
                {
                    UserName = data.GetProperty("username").GetString() ?? "",
                    Mail = data.GetProperty("mail").GetString() ?? "",
                    Psw = data.GetProperty("psw").GetString() ?? "",
                    BirthDate = data.GetProperty("birthdate").GetDateTime(),
                    AcceptedTerms = data.GetProperty("acceptterms").GetBoolean()
                };


                Console.WriteLine($"✅ Parsed: username = {user.UserName}, mail = {user.Mail}, psw = {user.Psw}, birthdate = {user.BirthDate}, acceptedTerms = {user.AcceptedTerms}, IsOnline = false");

                string formattedBirthDate = user.BirthDate.ToString("yyyy-MM-dd");
                string hashedPassword = BCrypt.Net.BCrypt.HashPassword(user.Psw);

                using (var conn = new SqliteConnection(_connectionString))
                {
                    conn.Open();
                    string query = "INSERT INTO User (Mail, UserName, BirthDate, Psw, AcceptedTerms, Isonline) VALUES (@Mail, @UserName, @BirthDate, @Psw, @AcceptedTerms, 0)";

                    using (var cmd = new SqliteCommand(query, conn))
                    {
                        cmd.Parameters.AddWithValue("@Mail", user.Mail);
                        cmd.Parameters.AddWithValue("@UserName", user.UserName);
                        cmd.Parameters.AddWithValue("@BirthDate", formattedBirthDate);
                        cmd.Parameters.AddWithValue("@Psw", hashedPassword);
                        cmd.Parameters.AddWithValue("@AcceptedTerms", user.AcceptedTerms);
                        cmd.ExecuteNonQuery();
                    }
                }

                return Ok(new { message = "User created successfully"});
            }
            catch (Exception ex)
            {
                Console.WriteLine("❌ Errore: " + ex.Message);
                return BadRequest(new { message = "Errore: " + ex.Message });
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> LoginUser([FromBody] loginData ld)
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
                            
                            string UserName = reader["UserName"].ToString();
                            DateTime bd = reader.GetDateTime(reader.GetOrdinal("BirthDate"));
                            string bdStr = bd.ToString("yyyy-MM-dd");
                            Console.WriteLine($"Birthdate: {bdStr}");
                            var t = new {
                                 token = GenerateJwtToken(ld.Mail, UserName),
                                 birthdate = bdStr
                                 };
                            Console.WriteLine("Token generato: " + t.token);
                            return Ok(t);
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

        [HttpGet("{mail}")]
        public async Task<IActionResult> GetUser(string mail)
        {
            try
            {
            using var conn = new SqliteConnection(_connectionString);
            await conn.OpenAsync();
            var q = "SELECT UserName, Mail, BirthDate, AcceptedTerms FROM User WHERE Mail = @mail";
            using var cmd = new SqliteCommand(q, conn);
            cmd.Parameters.AddWithValue("@mail", mail);
            using var rdr = await cmd.ExecuteReaderAsync();
            if (!await rdr.ReadAsync())
                return NotFound();

            var bd = rdr.GetDateTime(rdr.GetOrdinal("BirthDate"))
                        .ToString("yyyy-MM-dd");
            return Ok(new {
                username    = rdr.GetString(rdr.GetOrdinal("UserName")),
                mail        = rdr.GetString(rdr.GetOrdinal("Mail")),
                birthdate   = bd,
                acceptterms = rdr.GetBoolean(rdr.GetOrdinal("AcceptedTerms"))
            });
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
        

        
    }
    
}