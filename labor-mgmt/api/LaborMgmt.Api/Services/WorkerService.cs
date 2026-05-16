using Dapper;
using LaborMgmt.Api.Data;
using LaborMgmt.Api.Models;

namespace LaborMgmt.Api.Services;

public class WorkerService : IWorkerService
{
    private readonly IDbConnectionFactory _db;

    public WorkerService(IDbConnectionFactory db) => _db = db;

    public async Task<Worker> CreateWorker(CreateWorkerRequest request)
    {
        using var conn = _db.CreateConnection();
        return await conn.QuerySingleAsync<Worker>(
            @"INSERT INTO workers (name)
              OUTPUT INSERTED.id, INSERTED.name, INSERTED.created_at AS CreatedAt,
                     INSERTED.clock_in AS ClockIn, INSERTED.clock_out AS ClockOut
              VALUES (@Name)",
            new { request.Name });
    }

    public async Task<IEnumerable<Worker>> GetWorkers()
    {
        using var conn = _db.CreateConnection();
        return await conn.QueryAsync<Worker>(
            "SELECT id, name, created_at AS CreatedAt, clock_in AS ClockIn, clock_out AS ClockOut FROM workers");
    }

    public async Task<Worker> PunchCard(int workerId)
    {
        using var conn = _db.CreateConnection();
        return await conn.QuerySingleAsync<Worker>(
            @"DECLARE @punch TABLE (worker_id INT, punch_type NVARCHAR(3), ts DATETIME2);

              UPDATE workers
              SET
                  clock_in  = CASE WHEN clock_in IS NULL OR clock_out IS NOT NULL THEN GETUTCDATE() ELSE clock_in  END,
                  clock_out = CASE WHEN clock_in IS NULL OR clock_out IS NOT NULL THEN NULL          ELSE GETUTCDATE() END
              OUTPUT INSERTED.id,
                     CASE WHEN DELETED.clock_in IS NULL OR DELETED.clock_out IS NOT NULL THEN 'in' ELSE 'out' END,
                     GETUTCDATE()
              INTO @punch (worker_id, punch_type, ts)
              WHERE id = @WorkerId;

              INSERT INTO punch_records (worker_id, type, punched_at)
              SELECT worker_id, punch_type, ts FROM @punch;

              SELECT w.id, w.name, w.clock_in AS ClockIn, w.clock_out AS ClockOut
              FROM workers w WHERE w.id = @WorkerId;",
            new { WorkerId = workerId });
    }

    public async Task<IEnumerable<TimecardEntry>> GetTimecard(int workerId)
    {
        using var conn = _db.CreateConnection();
        return await conn.QueryAsync<TimecardEntry>(
            @"SELECT id, type, punched_at AS PunchedAt
              FROM punch_records
              WHERE worker_id = @WorkerId
              ORDER BY punched_at",
            new { WorkerId = workerId });
    }

    public async Task<VacationRequest> CreatePto(int workerId, CreateVacationRequest request)
    {
        using var conn = _db.CreateConnection();
        return await conn.QuerySingleAsync<VacationRequest>(
            @"INSERT INTO vacation_requests (worker_id, start_date, end_date)
              OUTPUT INSERTED.id, INSERTED.worker_id AS WorkerId,
                     INSERTED.start_date AS StartDate, INSERTED.end_date AS EndDate,
                     INSERTED.status, INSERTED.created_at AS CreatedAt
              VALUES (@WorkerId, @StartDate, @EndDate)",
            new { WorkerId = workerId, request.StartDate, request.EndDate });
    }

    public async Task UpdatePto(int workerId, int vacationId, UpdateVacationRequest request)
    {
        using var conn = _db.CreateConnection();
        await conn.ExecuteAsync(
            @"UPDATE vacation_requests
              SET start_date = @StartDate, end_date = @EndDate
              WHERE id = @VacationId AND worker_id = @WorkerId",
            new { request.StartDate, request.EndDate, VacationId = vacationId, WorkerId = workerId });
    }

    public async Task<IEnumerable<VacationRequest>> GetPto(int workerId)
    {
        using var conn = _db.CreateConnection();
        return await conn.QueryAsync<VacationRequest>(
            @"SELECT id, worker_id AS WorkerId, start_date AS StartDate, end_date AS EndDate, status, created_at AS CreatedAt
              FROM vacation_requests
              WHERE worker_id = @WorkerId",
            new { WorkerId = workerId });
    }

    public async Task DeletePto(int vacationId)
    {
        using var conn = _db.CreateConnection();
        await conn.ExecuteAsync(
            "DELETE FROM vacation_requests WHERE id = @Id",
            new { Id = vacationId });
    }
}
