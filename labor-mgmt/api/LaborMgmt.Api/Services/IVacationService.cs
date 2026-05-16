using LaborMgmt.Api.Models;

namespace LaborMgmt.Api.Services;

public interface IVacationService
{
    Task<IEnumerable<VacationRequest>> GetAll();
    Task Approve(int id);
    Task Deny(int id);
}
