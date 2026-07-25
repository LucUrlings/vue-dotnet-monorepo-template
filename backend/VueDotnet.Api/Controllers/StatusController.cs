using Microsoft.AspNetCore.Mvc;
using VueDotnet.Api.Models;

namespace VueDotnet.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class StatusController(IHostEnvironment environment) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType<StatusResponse>(StatusCodes.Status200OK)]
    public ActionResult<StatusResponse> Get()
    {
        return Ok(new StatusResponse(
            Status: "ok",
            Service: "VueDotnet.Api",
            Environment: environment.EnvironmentName,
            Timestamp: DateTimeOffset.UtcNow));
    }
}
