using Dapper;
using LaborMgmt.Api.Data;
using Microsoft.AspNetCore.Mvc;

namespace LaborMgmt.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    private readonly IDbConnectionFactory _db;

    public HealthController(IDbConnectionFactory db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        bool dbOk;
        try
        {
            using var conn = _db.CreateConnection();
            await conn.ExecuteScalarAsync<int>("SELECT 1");
            dbOk = true;
        }
        catch
        {
            dbOk = false;
        }

        return Ok(new { status = "ok", db = dbOk });
    }
}
