namespace CocktailApp
{
    public class User
    {
        public long Id {get; set;}
        public required string? FirstName {get; set;}
        public required string? LastName {get; set;}
        public required string? Mail {get; set;}
        public required string? Psw {get; set;}
        public DateTime BirthDate {get; set;}
    }
    public class loginData
    {
        public required string? Mail {get; set;}
        public required string? Psw {get; set;}
    }
}

