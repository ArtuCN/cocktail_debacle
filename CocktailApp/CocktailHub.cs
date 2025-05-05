using Microsoft.AspNetCore.SignalR;
using Microsoft.Data.Sqlite;
using System.Threading.Tasks;
using System.Text.Json;
using CocktailApp;

namespace CocktailApp.hubs {
    public class CocktailHub : Hub
    {
        private static Dictionary<string, string> _connectedUsers = new();
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

            if (_connectedUsers.TryGetValue(Context.ConnectionId, out var username))
            {
                using var conn = new SqliteConnection(_connectionString);
                await conn.OpenAsync();

                var query = "UPDATE User SET IsOnline = 0 WHERE UserName = @name";
                using var cmd = new SqliteCommand(query, conn);
                cmd.Parameters.AddWithValue("@name", username);
                await cmd.ExecuteNonQueryAsync();

                _connectedUsers.Remove(Context.ConnectionId);
            }

            await base.OnDisconnectedAsync(exception);
        }

        public async Task AnnounceUser(string mail)
        {
            Console.WriteLine($"{mail} Joined our community!");
            _connectedUsers[Context.ConnectionId] = mail;

            using var conn = new SqliteConnection(_connectionString);
            await conn.OpenAsync();

            var query = "UPDATE User SET IsOnline = 1 WHERE Mail = @mail";
            using var cmd = new SqliteCommand(query, conn);
            cmd.Parameters.AddWithValue("@mail", mail);
            await cmd.ExecuteNonQueryAsync();

            await Clients.All.SendAsync("UserJoined", $"{mail} joined our community!");
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

        public async Task SendAllMessagesToCaller()
        {
            Console.WriteLine("sending all messages to client");
            var messages = new List<Message>();
            using var connection = new SqliteConnection("Data Source=cocktail.db");
            await connection.OpenAsync();
            const string queryString = "SELECT Id, Sender, MessageText, SendingTime FROM Message ORDER BY SendingTime";
            using var command = new SqliteCommand(queryString, connection);
            using var reader = await command.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                var message = new Message
                {
                    Sender = reader.GetString(1),
                    Text = reader.GetString(2),
                    Timestamp = DateTime.Parse(reader.GetString(3)).ToString("HH:mm")
                };
                messages.Add(message);
            }
            await Clients.Caller.SendAsync("ReceiveAllMessages", messages);
        }



        public async Task SendMessage(string user, string text)
        {
            Console.WriteLine($"{user} ha scritto: {text}");
            var message = new Message {
                Sender = user,
                Text = text,
                Timestamp = DateTime.Now.ToString("HH:mm")
            };

            using var connection = new SqliteConnection("Data Source=cocktail.db");
            await connection.OpenAsync();

            using var command = connection.CreateCommand();
            command.CommandText = @"
                INSERT INTO Message (Sender, MessageText, SendingTime)
                VALUES ($sender, $text, $time);
            ";
            command.Parameters.AddWithValue("$sender", user);
            command.Parameters.AddWithValue("$text", text);
            command.Parameters.AddWithValue("$time", DateTime.Now);

            await command.ExecuteNonQueryAsync();
            await Clients.All.SendAsync("ReceiveMessage", message);
        }

    }
}