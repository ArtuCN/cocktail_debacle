using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using System.Net.Http;

namespace CocktailApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CocktailController : ControllerBase
    {
        private readonly HttpClient _httpClient;
        
        public CocktailController(IHttpClientFactory httpClientFactory)
        {
            _httpClient = httpClientFactory.CreateClient();
        }


        [HttpGet("searchCocktailByName{name}")]
        public async Task<IActionResult> GetCocktailByName(string name)
        {
            Console.WriteLine($"Searching for cocktail: {name}");
            var apiUrl = $"https://www.thecocktaildb.com/api/json/v1/1/search.php?s={name}";
            var response = await _httpClient.GetAsync(apiUrl);

            if (!response.IsSuccessStatusCode)
                return StatusCode((int)response.StatusCode, "Errore nella richiesta all’API di TheCocktailDB");

            var content = await response.Content.ReadAsStringAsync();
            return Content(content, "application/json");
        }
        [HttpGet("searchCocktailByIngridient{name}")]
        public async Task<IActionResult> GetCocktailByIngridient(string name)
        {

            var apiUrl = $"https://www.thecocktaildb.com/api/json/v1/1/filter.php?i={name}";
            var response = await _httpClient.GetAsync(apiUrl);
            if (!response.IsSuccessStatusCode)
            {
                return StatusCode((int)response.StatusCode, "Errore nella richiesta all’API di TheCocktailDB");
            }
            var content = await response.Content.ReadAsStringAsync();
            return Content(content, "application/json");
        }
    }
}
