using System.Data;
using Dapper;
using LaborMgmt.Api.Data;
using LaborMgmt.Api.Models;
using LaborMgmt.Api.Services;
using Moq;
using Moq.Dapper;
using Xunit;

namespace LaborMgmt.Tests;

public class WorkerServiceTests
{
    private readonly Mock<IDbConnection> _connection = new();
    private readonly WorkerService _service;

    public WorkerServiceTests()
    {
        var factory = new Mock<IDbConnectionFactory>();
        factory.Setup(f => f.CreateConnection()).Returns(_connection.Object);
        _service = new WorkerService(factory.Object);
    }

    [Fact]
    public async Task PunchCard_WhenWorkerClocksIn_ReturnsWorkerWithClockInSetAndClockOutNull()
    {
        _connection.SetupDapperAsync(c => c.QuerySingleAsync<Worker>(It.IsAny<string>(), null, null, null, null))
            .ReturnsAsync(new Worker { Id = 1, Name = "Alice", ClockIn = DateTime.UtcNow, ClockOut = null });

        var result = await _service.PunchCard(1);

        Assert.NotNull(result.ClockIn);
        Assert.Null(result.ClockOut);
    }

    [Fact]
    public async Task PunchCard_WhenWorkerClocksOut_ReturnsWorkerWithBothTimestampsSet()
    {
        _connection.SetupDapperAsync(c => c.QuerySingleAsync<Worker>(It.IsAny<string>(), null, null, null, null))
            .ReturnsAsync(new Worker { Id = 1, Name = "Alice", ClockIn = DateTime.UtcNow.AddHours(-8), ClockOut = DateTime.UtcNow });

        var result = await _service.PunchCard(1);

        Assert.NotNull(result.ClockIn);
        Assert.NotNull(result.ClockOut);
    }
}
