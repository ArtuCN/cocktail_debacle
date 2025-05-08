namespace CocktailApp.Class;

public class JwtSettings
{
    public string Secret { get; set; } = string.Empty;
    public int ExpiryInMinutes { get; set; }
}
