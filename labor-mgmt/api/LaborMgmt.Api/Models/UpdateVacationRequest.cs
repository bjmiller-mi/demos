namespace LaborMgmt.Api.Models;

public class UpdateVacationRequest
{
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }
}
