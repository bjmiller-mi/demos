using LaborMgmt.Api.Models;

namespace LaborMgmt.Api.Services;

public interface IWorkerService
{
    Task<Worker> CreateWorker(CreateWorkerRequest request);
    Task<IEnumerable<Worker>> GetWorkers();
    Task<Worker> PunchCard(int workerId);
    Task<IEnumerable<TimecardEntry>> GetTimecard(int workerId);
    Task<VacationRequest> CreatePto(int workerId, CreateVacationRequest request);
    Task UpdatePto(int workerId, int vacationId, UpdateVacationRequest request);
    Task<IEnumerable<VacationRequest>> GetPto(int workerId);
    Task DeletePto(int vacationId);
}
