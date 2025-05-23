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
        public IActionResult CreateUser([FromBody] JsonElement data)
        {
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

                return Ok(new { message = "User created successfully" });
            }
            catch (Exception ex)
            {
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
                    await conn.OpenAsync();
                    string findQuery = "SELECT * FROM User WHERE Mail = @mail";
                    using var command = new SqliteCommand(findQuery, conn);
                    command.Parameters.AddWithValue("@mail", ld.Mail);
                    using var reader = await command.ExecuteReaderAsync();
                    if (await reader.ReadAsync())
                    {
                        string? storedHash = reader["Psw"]?.ToString();
                        if (!string.IsNullOrEmpty(storedHash) && BCrypt.Net.BCrypt.Verify(ld.Psw, storedHash))
                        {
                            string? UserName = reader["UserName"].ToString();
                            DateTime bd = reader.GetDateTime(reader.GetOrdinal("BirthDate"));
                            string bdStr = bd.ToString("yyyy-MM-dd");
                            var t = new {
                                 token = GenerateJwtToken(ld.Mail ?? "", UserName ?? ""),
                                 birthdate = bdStr
                                 };
                            return Ok(t);
                        }
                        else
                        {
                            return BadRequest("Invalid login credentials");
                        }
                    }
                    else
                    {
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
        [HttpPut("{mail}/terms")]
        public async Task<IActionResult> UpdateTerms(string mail, [FromBody] TermsDto dto)
        {
            try
            {
                using var conn = new SqliteConnection(_connectionString);
                await conn.OpenAsync();
                string updateQuery = "UPDATE User SET AcceptedTerms = @AcceptedTerms WHERE Mail = @Mail";
                using var command = new SqliteCommand(updateQuery, conn);
                command.Parameters.AddWithValue("@AcceptedTerms", dto.Accepted);
                command.Parameters.AddWithValue("@Mail", mail);
                int rowsAffected = await command.ExecuteNonQueryAsync();
                if (rowsAffected > 0)
                {
                    return Ok(new {success="User terms updated successfully."});
                }
                else
                {
                    return NotFound(new {failed="User not found."});
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal error: {ex.Message}");
            }
        }
    }
    
}