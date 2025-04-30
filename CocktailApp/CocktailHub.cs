using Microsoft.AspNetCore.SignalR;
using Microsoft.Data.Sqlite;
using System.Threading.Tasks;
using System.Text.Json;
using CocktailApp;

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

            // Controllo se i cocktail per oggi sono già presenti
            var existingIds = new List<string>();
            var checkQuery = "SELECT cocktailId FROM DailyCocktail WHERE creation = @date";
            using (var checkCmd = new SqliteCommand(checkQuery, conn))
            {
                checkCmd.Parameters.AddWithValue("@date", today);
                using var reader = await checkCmd.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                {
                    existingIds.Add(reader["cocktailId"].ToString()!);
                }
            }

            if (existingIds.Count == 0)
            {
                // Nessun cocktail salvato per oggi, ne recupero 5 diversi
                var fetchedCocktails = new HashSet<string>();
                int attempts = 0;

                while (fetchedCocktails.Count < 5 && attempts < 15)
                {
                    var apiUrl = "https://www.thecocktaildb.com/api/json/v1/1/random.php";
                    var response = await _httpClient.GetAsync(apiUrl);
                    attempts++;
                    if (response.IsSuccessStatusCode)
                    {
                        var content = await response.Content.ReadAsStringAsync();
                        var json = JsonDocument.Parse(content);
                        var drink = json.RootElement.GetProperty("drinks")[0];
                        var cocktailId = drink.GetProperty("idDrink").GetString();

                        if (!string.IsNullOrEmpty(cocktailId) && !fetchedCocktails.Contains(cocktailId))
                        {
                            fetchedCocktails.Add(cocktailId);

                            var insertQuery = "INSERT INTO DailyCocktail (creation, cocktailId) VALUES (@date, @id)";
                            using var insertCmd = new SqliteCommand(insertQuery, conn);
                            insertCmd.Parameters.AddWithValue("@date", today);
                            insertCmd.Parameters.AddWithValue("@id", cocktailId);
                            await insertCmd.ExecuteNonQueryAsync();
                        }
                    }
                }

                existingIds.AddRange(fetchedCocktails);
            }

            if (existingIds.Count > 0)
            {
                await Clients.All.SendAsync("ReceiveDailyCocktail", existingIds);
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

        public async Task ShareCocktail(string user, string text, string id)
        {
            var share = new Share {
                Sender = user,
                Text = text,
                Timestamp = DateTime.Now.ToString("HH:mm"),
                CocktailId = id
            };
            await Clients.All.SendAsync("ReciveCocktail", share);
        }


        public async Task SendMessage(string user, string text)
        {
            Console.WriteLine($"{user} ha scritto: {text}");
            var message = new Message {
                Sender = user,
                Text = text,
                Timestamp = DateTime.Now.ToString("HH:mm")
            };
            await Clients.All.SendAsync("ReceiveMessage", message);
        }

    }
}