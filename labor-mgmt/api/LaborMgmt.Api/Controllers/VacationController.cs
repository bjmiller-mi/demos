using Dapper;
using LaborMgmt.Api.Data;
using LaborMgmt.Api.Models;
using Microsoft.AspNetCore.Mvc;

namespace LaborMgmt.Api.Controllers;

[ApiController]
[Route("api/vacation")]
public class VacationController : ControllerBase
{
    private readonly IDbConnectionFactory _db;

    public VacationController(IDbConnectionFactory db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        using var conn = _db.CreateConnection();
        var requests = await conn.QueryAsync<VacationRequest>(
            @"SELECT id, worker_id AS WorkerId, start_date AS StartDate, end_date AS EndDate,
                     status, created_at AS CreatedAt
              FROM vacation_requests
              ORDER BY worker_id, start_date");
        return Ok(requests);
    }

    [HttpPost("{id}/approve")]
    public async Task<IActionResult> Approve(int id)
    {
        using var conn = _db.CreateConnection();
        await conn.ExecuteAsync(
            "UPDATE vacation_requests SET status = 'Approved' WHERE id = @Id",
            new { Id = id });
        return NoContent();
    }

    [HttpPost("{id}/deny")]
    public async Task<IActionResult> Deny(int id)
    {
        using var conn = _db.CreateConnection();
        await conn.ExecuteAsync(
            "UPDATE vacation_requests SET status = 'Denied' WHERE id = @Id",
            new { Id = id });
        return NoContent();
    }
}
