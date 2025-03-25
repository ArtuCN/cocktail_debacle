using Microsoft.AspNetCore.Mvc;

// Questo controller gestirà tutte le richieste che partono da /api/cocktails
[ApiController]
[Route("api/[controller]")]
public class CocktailsController : ControllerBase
{
    // Un semplice esempio di metodo per ottenere i dati di un cocktail tramite il nome
    [HttpGet]
    public IActionResult GetCocktailByName([FromQuery] string name)
    {
        if (string.IsNullOrEmpty(name))
        {
            return BadRequest("Il nome del cocktail è necessario.");
        }

        // Qui dovresti aggiungere la logica per cercare il cocktail nel tuo DB
        // Per ora, forniamo una risposta simulata
        var cocktail = new 
        {
            Name = name,
            Ingredients = "Gin, Vermouth rosso, Campari",
            Instructions = "Mescolare tutti gli ingredienti con ghiaccio e filtrare in un bicchiere da cocktail."
        };

        // Restituiamo il cocktail come risposta JSON
        return Ok(cocktail);
    }
}
