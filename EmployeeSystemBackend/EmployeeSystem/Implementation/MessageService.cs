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
                    ReceiverId = m.ReceiverId,
                    IsRead = m.IsRead
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
                ReceiverId = message.ReceiverId,
                IsRead = false
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

        public async Task<List<UnreadCountDto>> GetUnreadCount()
        {
            List<Message> messages = await context.Messages
                .Where(m => !m.IsRead)
                .ToListAsync();

            List<UnreadCountDto> counts = new List<UnreadCountDto>();
            foreach (Message message in messages)
            {
                var exists = counts
                    .FirstOrDefault(c => c.SenderId == message.SenderId && c.ReceiverId == message.ReceiverId);

                if (exists != null)
                {
                    exists.UnreadCount++;
                }
                else
                {
                    counts.Add(new UnreadCountDto
                    {
                        SenderId = message.SenderId,
                        ReceiverId = message.ReceiverId,
                        UnreadCount = 1
                    });
                }
            }
            return counts;
        }

        public async Task<bool> MarkAsRead(MessageIdsDto ids)
        {
            List<Message> messages = await context.Messages
                .Where(m => m.SenderId == ids.SenderId && m.ReceiverId == ids.ReceiverId)
                .ToListAsync();

            if (messages is null)
                return false;

            foreach(Message message in messages)
            {
                message.IsRead = true;
            }

            await context.SaveChangesAsync();
            return true;
        }
    }
}
