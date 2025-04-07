using Microsoft.AspNetCore.Mvc;

namespace AdquisicionesAPI.Controllers
{
    [ApiController]
    [Route("health")]
    public class HealthController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            return Ok("healthy");
        }
    }
}
