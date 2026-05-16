using LaborMgmt.Api.Models;
using LaborMgmt.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace LaborMgmt.Api.Controllers;

[ApiController]
[Route("api/workers")]
public class WorkersController : ControllerBase
{
    private readonly IWorkerService _workers;

    public WorkersController(IWorkerService workers) => _workers = workers;

    [HttpPost]
    public async Task<IActionResult> CreateWorker([FromBody] CreateWorkerRequest request)
    {
        var worker = await _workers.CreateWorker(request);
        return Ok(new
        {
            worker.Id,
            worker.Name,
            Status = worker.ClockIn != null && worker.ClockOut == null ? "in" : "out"
        });
    }

    [HttpGet]
    public async Task<IActionResult> GetWorkers()
    {
        var workers = await _workers.GetWorkers();
        return Ok(workers.Select(w => new
        {
            w.Id,
            w.Name,
            Status = w.ClockIn != null && w.ClockOut == null ? "in" : "out"
        }));
    }

    [HttpPost("{id}/punch")]
    public async Task<IActionResult> Punch(int id)
    {
        var worker = await _workers.PunchCard(id);
        return Ok(new
        {
            worker.Id,
            worker.Name,
            Status = worker.ClockIn != null && worker.ClockOut == null ? "in" : "out"
        });
    }

    [HttpGet("{id}/timecard")]
    public async Task<IActionResult> GetTimecard(int id)
    {
        var entries = await _workers.GetTimecard(id);
        return Ok(entries);
    }

    [HttpPost("{id}/vacation")]
    public async Task<IActionResult> RequestVacation(int id, [FromBody] CreateVacationRequest request)
    {
        var pto = await _workers.CreatePto(id, request);
        return Ok(pto);
    }

    [HttpGet("{id}/vacation")]
    public async Task<IActionResult> GetWorkerVacation(int id)
    {
        var pto = await _workers.GetPto(id);
        return Ok(pto);
    }

    [HttpPut("{id}/vacation/{vacationId}")]
    public async Task<IActionResult> UpdateVacation(int id, int vacationId, [FromBody] UpdateVacationRequest request)
    {
        await _workers.UpdatePto(id, vacationId, request);
        return NoContent();
    }

    [HttpDelete("{id}/vacation/{vacationId}")]
    public async Task<IActionResult> DeleteVacation(int id, int vacationId)
    {
        await _workers.DeletePto(vacationId);
        return NoContent();
    }
}
