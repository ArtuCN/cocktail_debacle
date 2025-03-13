/*

USARE QUESTO FILE SOLO SE VA RIEMPITO NUOVAMENTE IL DB
PER USARLO DEVE ESSERE L'UNICO PROGRAM.CS
DECOMENNTARE MAKE FILL
PER IL MOMENTO RESTA COSI FINCHE NON CAPISCO COME FARE COESISTERE

using System;
using System.Net.Http;
using System.Text.Json;
using System.Collections.Generic;
using Microsoft.Data.Sqlite;
using System.Threading.Tasks;
using System;
using System.IO;

public class DatabaseHelper
{
    private static string dbPath;

    static DatabaseHelper()
    {
        dbPath = GetDatabasePath();
    }

    private static string GetDatabasePath()
    {
        try
        {
            var currentDirectory = Directory.GetCurrentDirectory();
            
            var parentDirectory = Directory.GetParent(currentDirectory);

            if (parentDirectory == null)
            {
                throw new InvalidOperationException("Unable to retrieve the parent directory.");
            }

            return Path.Combine(parentDirectory.FullName, "cocktail.db");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error getting database path: {ex.Message}");
            throw;
        }
    }

    public static SqliteConnection GetConnection()
    {
        try
        {
            return new SqliteConnection($"Data Source={dbPath}");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error establishing connection: {ex.Message}");
            throw;
        }
    }
}



class Cocktail
{
    public string idDrink { get; set; } = string.Empty;
    public string strDrink { get; set; } = string.Empty;
    public string strCategory { get; set; } = string.Empty;
    public string strAlcoholic { get; set; } = string.Empty;
    public string strGlass { get; set; } = string.Empty;
    public string strInstructions { get; set; } = string.Empty;
    public string strDrinkThumb { get; set; } = string.Empty;
    public List<string> Ingredient { get; set; } = new List<string>();
}

class FillingDBProgram
{
    static async Task Main()
    {
        for (char l = 'a'; l <= 'z'; l++)
        {
            if (l == 'u' || l == 'x') continue ; //hardcoding da cambiare
            string url = "https://www.thecocktaildb.com/api/json/v1/1/search.php?f=" + l;
            using HttpClient client = new HttpClient();
            string response = await client.GetStringAsync(url);
            
            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            var data = JsonSerializer.Deserialize<Dictionary<string, List<Cocktail>>>(response, options);

            if (data != null && data.ContainsKey("drinks"))
            {
                foreach (var cocktail in data["drinks"])
                {
                    if (cocktail == null) 
                    {
                        Console.WriteLine("Encountered a null cocktail, skipping.");
                        continue; // Salta al prossimo cocktail
                    }
                    
                    try
                    {
                        if (cocktail.Ingredient == null || cocktail.Ingredient.Count == 0)
                            cocktail.Ingredient = ExtractIngredients(cocktail);
                        SaveDB(cocktail);
                        Console.WriteLine($"Add: {cocktail.strDrink}");
                    }
                    catch(Exception ex)
                    {
                        Console.WriteLine($"Error while saving this cocktail: {cocktail?.strDrink}: {ex.Message}");
                    }
                }
            }
        }
    }

    static List<string> ExtractIngredients(Cocktail cocktail)
    {
        List<string> ingredients = new List<string>();

        for (int i = 1; i <= 15; i++)
        {
            var ingredient = typeof(Cocktail).GetProperty($"strIngredient{i}")?.GetValue(cocktail) as string;
            if (!string.IsNullOrEmpty(ingredient))
            {
                ingredients.Add(ingredient);
            }
        }

        return ingredients;
    }

    static void SaveDB(Cocktail cocktail)
    {
        using var connection = DatabaseHelper.GetConnection();
        connection.Open();

        string sqlCocktail = @"INSERT OR IGNORE INTO Cocktail (id, name, category, alcoholic, glass, instructions, image_url) 
                               VALUES (@id, @name, @category, @alcoholic, @glass, @instructions, @image_url)";
        using var command = new SqliteCommand(sqlCocktail, connection);
        command.Parameters.AddWithValue("@id", cocktail.idDrink);
        command.Parameters.AddWithValue("@name", cocktail.strDrink);
        command.Parameters.AddWithValue("@category", cocktail.strCategory ?? "");
        command.Parameters.AddWithValue("@alcoholic", cocktail.strAlcoholic ?? "");
        command.Parameters.AddWithValue("@glass", cocktail.strGlass ?? "");
        command.Parameters.AddWithValue("@instructions", cocktail.strInstructions ?? "");
        command.Parameters.AddWithValue("@image_url", cocktail.strDrinkThumb ?? "");
        command.ExecuteNonQuery();

        foreach (var ingredient in cocktail.Ingredient)
        {
            try
            {
                string sqlIngredient = "INSERT OR IGNORE INTO Ingredient (name) VALUES (@name)";
                using var cmdIngredient = new SqliteCommand(sqlIngredient, connection);
                cmdIngredient.Parameters.AddWithValue("@name", ingredient);
                cmdIngredient.ExecuteNonQuery();

                string sqlLink = @"INSERT OR IGNORE INTO Cocktail_Ingredient (cocktail_id, ingredient_id) 
                                VALUES (@cocktail_id, (SELECT id FROM Ingredient WHERE name = @name))";
                using var cmdLink = new SqliteCommand(sqlLink, connection);
                cmdLink.Parameters.AddWithValue("@cocktail_id", cocktail.idDrink);
                cmdLink.Parameters.AddWithValue("@name", ingredient);
                cmdLink.ExecuteNonQuery();
                //l'ultima riga è quella che esegue i cmd nel DB
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Errore durante il salvataggio dell'ingrediente '{ingredient}' per il cocktail {cocktail.strDrink}: {ex.Message}");
            }
        
        }
    }
}*/