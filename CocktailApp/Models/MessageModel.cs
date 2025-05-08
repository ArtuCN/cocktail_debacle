namespace CocktailApp
{
    public class Message 
    {
        public required string? Sender {get; set;}
        public required string? Text {get; set;}
        public required string? Timestamp{get; set;}
    }

    public class Share
    {
        public required string? Sender {get; set;}
        public required string? Text {get; set;}
        public required string? Timestamp{get; set;}
        public required string? CocktailId{get; set;}
    }
    public class MessageAdmin
    {
        public int Id { get; set; }
        public string Sender { get; set; } = string.Empty;
        public string MessageText { get; set; } = string.Empty;
        public DateTime SendingTime { get; set; }
    }
}