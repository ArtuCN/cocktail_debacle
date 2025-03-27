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

            // Stampa sulla console
            Console.WriteLine($"Ricevuto: {data}");
        }
    }
}



/*
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.SignalR;


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
        public IActionResult Post([FromBody] string data)
        {
            _logger.LogInformation($"Ricevuto: {data}");
            Console.WriteLine($"Ricevuto: {data}");
        }
    }
}*/