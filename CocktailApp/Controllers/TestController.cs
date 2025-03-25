using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;

namespace CocktailApp.Controllers
{
    [ApiController]
    [Route("api/test")]
    public class TestController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            return Ok(new { message = "Connection succeded!" });
        }
    }
}
