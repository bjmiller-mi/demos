namespace LaborMgmt.Api.Models;

public class CreateVacationRequest
{
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }
}
