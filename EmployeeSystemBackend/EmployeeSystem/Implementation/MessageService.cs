using EmployeeSystem.Data;
using EmployeeSystem.DTOs;
using EmployeeSystem.Hubs;
using EmployeeSystem.Interface;
using EmployeeSystem.Models;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace EmployeeSystem.Implementation
{
    public class MessageService : IMessageService
    {
        private EmployeeDbContext context;
        private IHubContext<ChatHub> hubContext;
        public MessageService(EmployeeDbContext _context, IHubContext<ChatHub> hubContext_) 
        {
            context = _context;
            hubContext = hubContext_;
        }
        public async Task<List<MessageDto>> GetMessages(MessageIdsDto ids)
        {
            List<MessageDto> messages = await context.Messages
                .Where(m => (m.SenderId == ids.SenderId && m.ReceiverId == ids.ReceiverId) 
                || (m.ReceiverId == ids.SenderId && m.SenderId == ids.ReceiverId))
                .OrderByDescending(m => m.Time)
                .Select(m => new MessageDto
                {
                    SenderId = m.SenderId,
                    Text = m.Text,
                    Time = m.Time,
                    ReceiverId = m.ReceiverId
                }
                )
                .ToListAsync();

            return messages;
        }

        public async Task<bool> SendMessage(MessageDto message)
        {
            if (message is null)
                return false;

            Message newMessage = new Message
            {
                SenderId = message.SenderId,
                Text = message.Text,
                Time = DateTime.Now,
                ReceiverId = message.ReceiverId
            };
           
            context.Messages.Add(newMessage);
            await context.SaveChangesAsync();

            if (ChatHub.connections.TryGetValue(message.ReceiverId, out var connectionId))
            {
                await hubContext.Clients.Client(connectionId)
                    .SendAsync("receiveMessage", message.SenderId, message.Text);       
            }

            return true;

        }   
    }
}
