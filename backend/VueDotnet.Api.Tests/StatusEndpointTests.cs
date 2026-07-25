using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using VueDotnet.Api.Models;

namespace VueDotnet.Api.Tests;

public sealed class StatusEndpointTests(
    WebApplicationFactory<Program> factory) : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client = factory.WithWebHostBuilder(builder =>
        builder.UseEnvironment("IntegrationTest")).CreateClient();

    [Fact]
    public async Task StatusEndpointReturnsJsonStatus()
    {
        var response = await _client.GetAsync(
            "/api/status",
            TestContext.Current.CancellationToken);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Equal("application/json", response.Content.Headers.ContentType?.MediaType);

        var status = await response.Content.ReadFromJsonAsync<StatusResponse>(
            TestContext.Current.CancellationToken);
        Assert.NotNull(status);
        Assert.Equal("ok", status.Status);
        Assert.False(string.IsNullOrWhiteSpace(status.Service));
        Assert.Equal("IntegrationTest", status.Environment);
        Assert.True(status.Timestamp > DateTimeOffset.MinValue);
    }

    [Fact]
    public async Task HealthEndpointReturnsHealthy()
    {
        var response = await _client.GetAsync(
            "/health",
            TestContext.Current.CancellationToken);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Equal(
            "Healthy",
            await response.Content.ReadAsStringAsync(TestContext.Current.CancellationToken));
    }

    [Fact]
    public async Task OpenApiIsNotAvailableOutsideDevelopment()
    {
        var response = await _client.GetAsync(
            "/openapi/v1.json",
            TestContext.Current.CancellationToken);

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task DevelopmentEnablesOpenApiAndConfiguredCorsOrigin()
    {
        await using var developmentFactory = new WebApplicationFactory<Program>()
            .WithWebHostBuilder(builder => builder.UseEnvironment(Environments.Development));
        using var client = developmentFactory.CreateClient();
        using var request = new HttpRequestMessage(HttpMethod.Get, "/api/status");
        request.Headers.Add("Origin", "http://localhost:5173");

        var openApiResponse = await client.GetAsync(
            "/openapi/v1.json",
            TestContext.Current.CancellationToken);
        var corsResponse = await client.SendAsync(
            request,
            TestContext.Current.CancellationToken);

        Assert.Equal(HttpStatusCode.OK, openApiResponse.StatusCode);
        Assert.Equal(
            "http://localhost:5173",
            corsResponse.Headers.GetValues("Access-Control-Allow-Origin").Single());
    }
}
