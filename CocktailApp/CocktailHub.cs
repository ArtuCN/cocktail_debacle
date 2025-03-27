using Microsoft.AspNetCore.SignalR;
using Microsoft.Data.Sqlite;
using System.Threading.Tasks;

namespace CocktailApp.hubs {
    public class CocktailHub : Hub
    {
        public async Task SendMessage(string user, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }
        public async Task SearchCocktailByName(string name)
        {
            using var connection = new SqliteConnection("Data Source=cocktail.db");
            await connection.OpenAsync();

            string findQuery = "SELECT * FROM Cocktail WHERE name = @name";
            using var command = new SqliteCommand(findQuery, connection);
            command.Parameters.AddWithValue("@name", name);

            using var reader = await command.ExecuteReaderAsync();
            if (reader.HasRows)
            {
                var cocktails = new List<object>();
                while (await reader.ReadAsync())
                {
                    cocktails.Add(new
                    {
                        Id = reader["id"],
                        Name = reader["name"],
                        Category = reader["category"],
                        Alcoholic = reader["alcoholic"],
                        Glass = reader["glass"],
                        Instructions = reader["instructions"],
                        ImageUrl = reader["image_url"]
                    });
                }
                await Clients.All.SendAsync("ReceiveCocktails", cocktails);
                Console.WriteLine($"Cocktail found: {name}");
                
            }
            else
            {
                await Clients.All.SendAsync("ReceiveError", "Cocktail not found");
            }
        }
    }
}