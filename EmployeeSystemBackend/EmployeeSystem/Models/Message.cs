using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EmployeeSystem.Models
{
    public class Message
    {
        [Key]
        public int Id { get; set; }
        public string Text { get; set; } = string.Empty;
        public int SenderId { get; set; }
        public int ReceiverId { get; set; }
        public DateOnly Date { get; set; }

        [ForeignKey(nameof(SenderId))]
        public Employee Sender { get; set; }

        [ForeignKey(nameof(ReceiverId))]
        public Employee Receiver { get; set; }
        
    }
}
