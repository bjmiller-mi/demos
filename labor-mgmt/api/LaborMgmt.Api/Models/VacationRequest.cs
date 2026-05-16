namespace LaborMgmt.Api.Models;

public class VacationRequest
{
    public int Id { get; set; }
    public int WorkerId { get; set; }
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }
    public string Status { get; set; } = "Pending"; // Pending, Approved, Denied
    public DateTime CreatedAt { get; set; }
}
