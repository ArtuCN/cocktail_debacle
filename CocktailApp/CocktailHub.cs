using Microsoft.AspNetCore.SignalR;
using Microsoft.Data.Sqlite;
using System.Threading.Tasks;

namespace CocktailApp.hubs {
    public class CocktailHub : Hub
    {
        private static int _connectedClients = 0;
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