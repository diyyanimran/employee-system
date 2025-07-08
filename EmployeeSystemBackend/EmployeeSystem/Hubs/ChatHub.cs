using Microsoft.AspNetCore.SignalR;

namespace EmployeeSystem.Hubs
{
    public class ChatHub : Hub
    {
        public static Dictionary<int, string> connections = new();
        public Task Register(int employeeId)
        {
            connections[employeeId] = Context.ConnectionId;
            return Task.CompletedTask;
        }

        public override Task OnDisconnectedAsync(Exception? exception)
        {
            var item = connections.FirstOrDefault(x => x.Value == Context.ConnectionId);
            if (item.Key != 0)
            {
                connections.Remove(item.Key);
            }

            return base.OnDisconnectedAsync(exception);
        }

        public Task SendMessage(int senderId, int receiverId, string message)
        {
            if (connections.TryGetValue(receiverId, out var connectionId))
                return Clients.Client(connectionId).SendAsync("receiveMessage", senderId, message);

            return Task.CompletedTask;
        }
    }
}
