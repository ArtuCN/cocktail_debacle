using Microsoft.AspNetCore.SignalR;
using Microsoft.Data.Sqlite;

namespace CocktailApp.Services
{
    public class CocktailHub : Hub
    {
        public async Task SendCocktailData(List<object> cocktails)
        {
            await Clients.All.SendAsync("ReceiveCocktails", cocktails);
        }
    }

    public class SearchDB
    {
        private readonly IHubContext<CocktailHub> _hubContext;
        private readonly string _connectionString = "../";

        public SearchDB(IHubContext<CocktailHub> hubContext, string connectionString)
        {
            _hubContext = hubContext;
            _connectionString = connectionString;
        }

        public async Task SearchByNameAndSendToFrontend(string data)
        {
            using var connection = new SqliteConnection(_connectionString);
            await connection.OpenAsync();

            string findQuery = "SELECT * FROM Cocktail WHERE name = @name";
            using var command = new SqliteCommand(findQuery, connection);
            command.Parameters.AddWithValue("@name", data);

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

                await _hubContext.Clients.All.SendAsync("ReceiveCocktails", cocktails);
            }
            else
            {
                await _hubContext.Clients.All.SendAsync("ReceiveError", "Cocktail non trovato");
            }
        }
    }
}
