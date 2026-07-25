using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.FileProviders;
using VueDotnet.Api.Controllers;
using VueDotnet.Api.Models;

namespace VueDotnet.Api.Tests;

public sealed class StatusControllerTests
{
    [Fact]
    public void GetReturnsCurrentTypedStatus()
    {
        var environment = new TestHostEnvironment { EnvironmentName = "UnitTest" };
        var controller = new StatusController(environment);
        var before = DateTimeOffset.UtcNow;

        var result = controller.Get();
        var after = DateTimeOffset.UtcNow;

        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var response = Assert.IsType<StatusResponse>(okResult.Value);
        Assert.Equal("ok", response.Status);
        Assert.Equal("VueDotnet.Api", response.Service);
        Assert.Equal("UnitTest", response.Environment);
        Assert.InRange(response.Timestamp, before, after);
    }

    private sealed class TestHostEnvironment : IHostEnvironment
    {
        public string EnvironmentName { get; set; } = Environments.Production;
        public string ApplicationName { get; set; } = "VueDotnet.Api.Tests";
        public string ContentRootPath { get; set; } = Directory.GetCurrentDirectory();
        public IFileProvider ContentRootFileProvider { get; set; } = new NullFileProvider();
    }
}
