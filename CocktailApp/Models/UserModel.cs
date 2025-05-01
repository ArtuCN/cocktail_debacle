namespace CocktailApp
{
    public class User
    {
        public long Id {get; set;}
        public required string? UserName {get; set;}
        public required string? Mail {get; set;}
        public required DateTime BirthDate {get; set;}
        public required string? Psw {get; set;}
        public required bool AcceptedTerms {get; set;}
    }
    public class loginData
    {
        public required string? Mail {get; set;}
        public required string? Psw {get; set;}
    }
    public class UserInfo
    {
        public long Id {get; set;}
        public required string? UserName {get; set;}
        public required string? Mail {get; set;}
        public required DateTime BirthDate {get; set;}
        public required bool AcceptedTerms {get; set;}
        public required bool IsOnline {get; set;}

    }
}

