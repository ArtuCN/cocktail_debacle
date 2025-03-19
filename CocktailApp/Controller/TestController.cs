using Microsoft.AspNetCore.Mvc;

namespace Ext.Controllers
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
