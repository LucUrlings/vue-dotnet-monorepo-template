using Microsoft.AspNetCore.Diagnostics.HealthChecks;

if (args.Contains("--healthcheck", StringComparer.Ordinal))
{
    using var client = new HttpClient();
    var healthCheckUrl = Environment.GetEnvironmentVariable("HEALTHCHECK_URL")
        ?? "http://localhost:8080/health";

    try
    {
        using var response = await client.GetAsync(healthCheckUrl);
        return response.IsSuccessStatusCode ? 0 : 1;
    }
    catch (HttpRequestException)
    {
        return 1;
    }
}

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddHealthChecks();

const string DevelopmentCorsPolicy = "DevelopmentFrontend";
builder.Services.AddCors(options =>
{
    options.AddPolicy(DevelopmentCorsPolicy, policy =>
    {
        var allowedOrigins = builder.Configuration
            .GetSection("Cors:AllowedOrigins")
            .Get<string[]>() ?? [];

        if (allowedOrigins.Length > 0)
        {
            policy.WithOrigins(allowedOrigins)
                .AllowAnyHeader()
                .AllowAnyMethod();
        }
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseCors(DevelopmentCorsPolicy);
}

app.MapHealthChecks("/health", new HealthCheckOptions
{
    AllowCachingResponses = false,
});
app.MapControllers();

app.Run();

return 0;

public partial class Program;
