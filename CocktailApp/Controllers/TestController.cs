using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;

namespace CocktailApp.Controllers
{
    [ApiController]
    public class TestController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            return Ok(new { message = "Connection succeded!" });
        }
    }
}
