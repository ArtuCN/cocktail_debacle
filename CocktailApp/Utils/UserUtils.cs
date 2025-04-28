using System;
using System.Collections.Generic;
using System.Data;
using Microsoft.Data.Sqlite;
using System.Net.Http;
using System.Threading.Tasks;
using System.Text.RegularExpressions;
using System.Collections.Generic;
using Newtonsoft.Json;



namespace CocktailApp.Utils
{

    public static class UserUtils
    {
        public class CocktailApiDto
        {
            public List<CocktailShort> drinks { get; set; }
        }

        public class CocktailShort
        {
            public string strDrink { get; set; }
            public string strDrinkThumb { get; set; }
            public string idDrink { get; set; }
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
                Console.WriteLine($"reader {reader.GetInt32(0).ToString()}");
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
                Console.WriteLine($"response {response}");
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
            foreach (var ingr in ing)
            {
                Console.WriteLine($"{ingr.Key} = {ingr.Value}");
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
                    var matches = Regex.Matches(response, "\"idDrink\":\"(.*?)\"");
                    if (matches.Count > 0)
                    {
                        foreach (Match match in matches)
                        {
                            var cocktailId = match.Groups[1].Value;
                            Console.WriteLine($"ID del cocktail: {cocktailId}");
                            ret.Add(cocktailId);
                            if (ret.Count >= 3)
                                return ret;
                        }
                    }
                    Console.WriteLine($"ingredient {i}");
                }
            }
            return ret;
            
        }
    }
}