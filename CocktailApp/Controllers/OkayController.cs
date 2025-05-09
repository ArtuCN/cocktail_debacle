using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace CocktailApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestController : ControllerBase
    {
        private readonly ILogger<TestController> _logger;
        
        public TestController(ILogger<TestController> logger)
        {
            _logger = logger;
        }

        [HttpPost]
        public void Post([FromBody] string data)
        {
            // Loggiamo il dato ricevuto nel log
            _logger.LogInformation($"Ricevuto: {data}");
        }
    }
}
