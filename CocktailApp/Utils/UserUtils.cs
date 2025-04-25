using System;
using System.Collections.Generic;
using System.Data;
using Microsoft.Data.Sqlite;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
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
        private static string _connectionString = "Data Source=your_database_path.db";
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
            string query = "SELECT CocktailID FROM UserPreferences WHERE Mail = @mail";
            using var command = new SqliteCommand(query, conn);
            command.Parameters.AddWithValue("@mail", email);
            using var reader = command.ExecuteReader();
            while (reader.Read())
                favoriteIds.Add(reader.GetInt32(0).ToString()); // Converti l'int in string
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


    }
}
