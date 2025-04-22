using Microsoft.AspNetCore.SignalR;
using Microsoft.Data.Sqlite;
using System.Threading.Tasks;
using System.Text.Json;

namespace CocktailApp.hubs {
    public class CocktailHub : Hub
    {
        private readonly string _connectionString = "Data Source=cocktail.db";
        private readonly HttpClient _httpClient;
        private static int _connectedClients = 0;
        public CocktailHub(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }
        public async Task NotLoggedMessage(string user, string message)
        {
            Console.WriteLine($"Inviato da {user}: {message}");
            message = "remember to login or to create an account!";
            await Clients.All.SendAsync("ReminderToLogin", user, message);
        }

        public override async Task OnConnectedAsync()
        {
            _connectedClients++;
            await Clients.All.SendAsync("UpdateConnectedClients", _connectedClients);
            
            
            var today = DateTime.UtcNow.Date.ToString("yyyy-MM-dd");
            using var conn = new SqliteConnection(_connectionString);
            await conn.OpenAsync();

            var checkQuery = "SELECT * FROM DailyCocktail WHERE creation = @date";
            using var checkCmd = new SqliteCommand(checkQuery, conn);
            checkCmd.Parameters.AddWithValue("@date", today);
            using var reader = await checkCmd.ExecuteReaderAsync();

            string? cocktailId = null;

            if (await reader.ReadAsync())
            {
                cocktailId = reader["cocktailId"].ToString();
            }
            else
            {
                var apiUrl = "https://www.thecocktaildb.com/api/json/v1/1/random.php";
                var response = await _httpClient.GetAsync(apiUrl);

                if (response.IsSuccessStatusCode)
                {
                    var content = await response.Content.ReadAsStringAsync();
                    var json = JsonDocument.Parse(content);
                    var drink = json.RootElement.GetProperty("drinks")[0];
                    cocktailId = drink.GetProperty("idDrink").GetString();

                    var insertQuery = "INSERT INTO DailyCocktail (creation, cocktailId) VALUES (@date, @id)";
                    using var insertCmd = new SqliteCommand(insertQuery, conn);
                    insertCmd.Parameters.AddWithValue("@date", today);
                    insertCmd.Parameters.AddWithValue("@id", cocktailId);
                    await insertCmd.ExecuteNonQueryAsync();
                }
            }

            if (cocktailId != null)
            {
                await Clients.All.SendAsync("ReceiveDailyCocktail", cocktailId);
            }

            await base.OnConnectedAsync();
        }

        

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            _connectedClients = Math.Max(0, _connectedClients - 1);
            await Clients.All.SendAsync("UpdateConnectedClients", _connectedClients);
            await base.OnDisconnectedAsync(exception);
        }
        public async Task AnnounceUser(string username)
        {
            Console.WriteLine($"{username} Joined in our community!");
            await Clients.All.SendAsync("UserJoined", $"{username} Joined in our comunity!");
        }
    }
}