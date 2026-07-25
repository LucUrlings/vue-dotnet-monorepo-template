namespace VueDotnet.Api.Models;

public sealed record StatusResponse(
    string Status,
    string Service,
    string Environment,
    DateTimeOffset Timestamp);
