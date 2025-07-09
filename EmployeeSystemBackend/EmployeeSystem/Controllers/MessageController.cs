using System.Diagnostics.Metrics;
using EmployeeSystem.DTOs;
using EmployeeSystem.Hubs;
using EmployeeSystem.Interface;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace EmployeeSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MessageController : ControllerBase
    {
        private IMessageService messageService;
        
        public MessageController(IMessageService messageService_)
        {
            messageService = messageService_;
            
        }

        [HttpPost("get")]
        public async Task<ActionResult<List<MessageDto>>> GetMessages([FromBody] MessageIdsDto messageIds)
        {
            var messages = await messageService.GetMessages(messageIds);
            if (messages is null || messages.Count == 0)
                return BadRequest("No Messages Found");
            return Ok(messages);
        }

        [HttpPost("send")]
        public async Task<IActionResult> SendMessage([FromBody] MessageDto message)
        {
            bool sent = await messageService.SendMessage(message);
            if (!sent) return BadRequest("Message could not be sent");
            return Ok();
        }

        [HttpGet("unread")]
        public async Task<ActionResult<List<UnreadCountDto>>> GetUnreadCount()
        {
            List<UnreadCountDto> counts = await messageService.GetUnreadCount();
            if (counts.Count == 0)
                return BadRequest("All messages read");
            return Ok(counts);
        }

        [HttpPost("read")]
        public async Task<IActionResult> MarkAsRead(MessageIdsDto ids)
        {
            bool marked = await messageService.MarkAsRead(ids);
            if (!marked)
                return BadRequest("Messages could not be marked as read");
            return Ok();
        }
    }
}
