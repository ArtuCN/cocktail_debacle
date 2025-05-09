using System;
using System.Collections.Generic;
using System.Data;
using Microsoft.Data.Sqlite;
using System.Net.Http;
using System.Threading.Tasks;
using System.Text.RegularExpressions;
using System.Collections.Generic;
using Newtonsoft.Json;
using System.Text.Json;


namespace CocktailApp.Utils
{

    public static class UserUtils
    {
        public class CocktailApiDto
        {
            public List<CocktailShort> drinks { get; set; } = new List<CocktailShort>();
        }

        public class CocktailShort
        {
            public string strDrink { get; set; }  = string.Empty;
            public string strDrinkThumb { get; set; }  = string.Empty;
            public string idDrink { get; set; }  = string.Empty;
        }
        private static string _connectionString = "Data Source=cocktail.db";
        //const ingredientCount: { [ingredient: string]: number } = {};

        public static bool IsMinor(string email)
        {
            var age = GetUserAge(email);
            return age < 18;
        }
        public static int GetUserAge(string email)
        {
            using var connection = new SqliteConnection(_connectionString);
            connection.Open();
            string query = "SELECT BirthDate FROM User WHERE Mail = @mail";
            using var command = new SqliteCommand(query, connection);
            command.Parameters.AddWithValue("@mail", email);
            using var reader = command.ExecuteReader();
            if (reader.Read())
            {
                DateTime birthDate = reader.GetDateTime(0);
                var today = DateTime.Today;
                int age = today.Year - birthDate.Year;
                if (birthDate > today.AddYears(-age)) age--;
                return age;
            }

            throw new Exception("User not found.");
        }
        public static List<string> GetFavoriteCocktailIds(string email)
        {
            var favoriteIds = new List<string>();
            using var conn = new SqliteConnection(_connectionString);
            conn.Open();
            string query = "SELECT CocktailIDs FROM UserPreferences WHERE Mail = @mail";
            using var command = new SqliteCommand(query, conn);
            command.Parameters.AddWithValue("@mail", email);
            using var reader = command.ExecuteReader();
            while (reader.Read())
            {
                favoriteIds.Add(reader.GetInt32(0).ToString());
            }
            return favoriteIds;
        }


        public static async Task<List<string>> Get3NonAlcoholicIdsAsync(List<string> favoriteCocktailIds)
        {
            var url = "https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Non_Alcoholic";
            var httpClient = new HttpClient();
            var response = await httpClient.GetStringAsync(url);

            var cocktails = JsonConvert.DeserializeObject<CocktailApiDto>(response);

            var nonAlcoholicCocktails = cocktails.drinks;
            var suggestedIds = new List<string>();

            foreach (var cocktail in nonAlcoholicCocktails)
            {
                if (!favoriteCocktailIds.Contains(cocktail.idDrink))
                {
                    suggestedIds.Add(cocktail.idDrink);
                }

                if (suggestedIds.Count >= 3) break;
            }

            return suggestedIds;
        }

        public static async Task<List<string>> Get3AlcoholicIdsAsync(List<string> favoriteCocktailIds)
        {
            Dictionary<string, int> ing = new Dictionary<string, int>();
            foreach (var element in favoriteCocktailIds)
            {
                var url = $"https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i={element}";
                var httpClient = new HttpClient();
                var response = await httpClient.GetStringAsync(url);
                var matches = Regex.Matches(response, "\"strIngredient[0-9]+\":\"(.*?)\"");
                foreach (Match match in matches)
                {
                    var ingredient = match.Groups[1].Value;
                    if (!string.IsNullOrEmpty(ingredient))
                    {
                        if (ing.ContainsKey(ingredient))
                            ing[ingredient] += 1;
                        else
                            ing[ingredient] = 1;
                    }
                }
            }
            var top3 = ing
                .OrderByDescending(kv => kv.Value)
                .Take(3)
                .Select(kv => kv.Key)
                .ToList();
            
            var ret = new List<string>();
            using (var httpClient = new HttpClient())
            {
                foreach (var i in top3)
                {
                    var url2 = $"https://www.thecocktaildb.com/api/json/v1/1/filter.php?i={i}";
                    var response = await httpClient.GetStringAsync(url2);

                    using var document = JsonDocument.Parse(response);
                    var drinks = document.RootElement.GetProperty("drinks");

                    if (drinks.GetArrayLength() > 0)
                    {
                        // Prendi un cocktail random
                        var random = new Random();
                        var index = random.Next(0, drinks.GetArrayLength());
                        var cocktailId = drinks[index].GetProperty("idDrink").GetString();

                        if (!string.IsNullOrEmpty(cocktailId))
                        {
                            ret.Add(cocktailId);
                            if (ret.Count >= 3)
                                return ret.GetRange(0, 3);
                        }
                    }
                }
                if (top3.Count == 0)
                {
                    var url = "https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Alcoholic";
                    var response = await httpClient.GetStringAsync(url);
                    var cocktails = JsonConvert.DeserializeObject<CocktailApiDto>(response);
                    var alcoholicCocktails = cocktails.drinks
                        .Where(c => !favoriteCocktailIds.Contains(c.idDrink))
                        .ToList();

                    var random = new Random();
                    var selected = alcoholicCocktails
                        .OrderBy(_ => random.Next())
                        .Take(3)
                        .ToList();

                    foreach (var cocktail in selected)
                    {
                        ret.Add(cocktail.idDrink);
                    }
                }
            }
            return ret;
        }
    }
}