using System;
using System.Net.Http;
using System.Text.Json;
using System.Collections.Generic;
using Microsoft.Data.Sqlite;
using System.Threading.Tasks;
using System;
using System.IO;


class Program
{
    static async Task Main()
    {
        Console.WriteLine("Hi, what can I make for you?\n(write cocktail name)");
        string name = Console.ReadLine();
        using var connection = new SqliteConnection($"Data Source=cocktail.db");
        connection.Open();
        string findQuery ="SELECT * FROM Cocktail WHERE name = @name";
        
        using var command = new SqliteCommand(findQuery, connection);
        command.Parameters.AddWithValue("@name", name);
    
        using var reader = command.ExecuteReader();
        if (reader.HasRows)
        {
            while (reader.Read())
            {
                // Stampa tutte le colonne
                Console.WriteLine($"ID: {reader["id"]}");
                Console.WriteLine($"Name: {reader["name"]}");
                Console.WriteLine($"Category: {reader["category"]}");
                Console.WriteLine($"Alcoholic: {reader["alcoholic"]}");
                Console.WriteLine($"Glass: {reader["glass"]}");
                Console.WriteLine($"Instructions: {reader["instructions"]}");
                Console.WriteLine($"Image URL: {reader["image_url"]}");
                Console.WriteLine();
            }
        }
        else
        {
            Console.WriteLine("Cocktail non trovato.");
        }
    }  
}