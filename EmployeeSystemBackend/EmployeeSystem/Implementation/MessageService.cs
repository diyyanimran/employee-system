using EmployeeSystem.Data;
using EmployeeSystem.DTOs;
using EmployeeSystem.Interface;
using EmployeeSystem.Models;
using Microsoft.EntityFrameworkCore;

namespace EmployeeSystem.Implementation
{
    public class MessageService : IMessageService
    {
        private EmployeeDbContext context;
        public MessageService(EmployeeDbContext _context) 
        {
            context = _context;
        }
        public async Task<List<MessageDto>> GetMessages(MessageIdsDto ids)
        {
            for (int i = 0; i < 5; i++)
                Console.WriteLine("Ids: " + ids.SenderId + " " + ids.ReceiverId);
            List<MessageDto> messages = await context.Messages
                .Where(m => m.SenderId == ids.SenderId && m.ReceiverId == ids.ReceiverId)
                .Select(m => new MessageDto
                {
                    SenderId = m.SenderId,
                    Text = m.Text,
                    Time = m.Time,
                    RecieverId = m.ReceiverId
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
                ReceiverId = message.RecieverId
            };
           
            context.Messages.Add(newMessage);
            await context.SaveChangesAsync();
            return true;

        }
    }
}
