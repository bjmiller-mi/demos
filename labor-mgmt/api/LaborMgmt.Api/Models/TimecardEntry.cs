namespace LaborMgmt.Api.Models;

public class TimecardEntry
{
    public int Id { get; set; }
    public string Type { get; set; } = string.Empty;
    public DateTime PunchedAt { get; set; }
}
