using System.Text.Json.Serialization;
namespace CocktailApp
{

    public class Drink
    {
        [JsonPropertyName("idDrink")]
        public string IdDrink { get; set; } = string.Empty;

        [JsonPropertyName("strDrink")]
        public string StrDrink { get; set; } = string.Empty;

        [JsonPropertyName("strDrinkThumb")]
        public string StrDrinkThumb { get; set; } = string.Empty;

        [JsonPropertyName("strIngredient1")]
        public string StrIngredient1 { get; set; } = string.Empty;

        [JsonPropertyName("strIngredient2")]
        public string StrIngredient2 { get; set; } = string.Empty;

        [JsonPropertyName("strIngredient3")]
        public string StrIngredient3 { get; set; } = string.Empty;

        [JsonPropertyName("strIngredient4")]
        public string StrIngredient4 { get; set; } = string.Empty;

        [JsonPropertyName("strIngredient5")]
        public string StrIngredient5 { get; set; } = string.Empty;

        [JsonPropertyName("strIngredient6")]
        public string StrIngredient6 { get; set; } = string.Empty;

        [JsonPropertyName("strIngredient7")]
        public string StrIngredient7 { get; set; } = string.Empty;

        [JsonPropertyName("strIngredient8")]
        public string StrIngredient8 { get; set; } = string.Empty;

        [JsonPropertyName("strIngredient9")]
        public string StrIngredient9 { get; set; } = string.Empty;

        [JsonPropertyName("strIngredient10")]
        public string StrIngredient10 { get; set; } = string.Empty;

        [JsonPropertyName("strIngredient11")]
        public string StrIngredient11 { get; set; } = string.Empty;

        [JsonPropertyName("strIngredient12")]
        public string StrIngredient12 { get; set; } = string.Empty;

        [JsonPropertyName("strIngredient13")]
        public string StrIngredient13 { get; set; } = string.Empty;

        [JsonPropertyName("strIngredient14")]
        public string StrIngredient14 { get; set; } = string.Empty;

        [JsonPropertyName("strIngredient15")]
        public string StrIngredient15 { get; set; } = string.Empty;
    }

    public class DrinkResponse
    {
        [JsonPropertyName("drinks")]
        public List<Drink> Drinks { get; set; } = new();
    }
}
