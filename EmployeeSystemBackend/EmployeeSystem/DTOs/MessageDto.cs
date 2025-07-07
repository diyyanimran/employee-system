namespace EmployeeSystem.DTOs
{
    public class MessageDto
    {
        public string Text { get; set; }
        public int SenderId { get; set; }
        public int RecieverId { get; set; }
        public DateTime Time { get; set; }
    }
}
