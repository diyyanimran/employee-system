using EmployeeSystem.DTOs;

namespace EmployeeSystem.Interface
{
    public interface IMessageService
    {
        public Task<List<MessageDto>> GetMessages(MessageIdsDto messageIds);
        public Task<bool> SendMessage(MessageDto message);
        public Task<List<UnreadCountDto>> GetUnreadCount();
        public Task<bool> MarkAsRead(MessageIdsDto ids);
    }
}
