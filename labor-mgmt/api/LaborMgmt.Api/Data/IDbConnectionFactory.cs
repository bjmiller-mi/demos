using System.Data;

namespace LaborMgmt.Api.Data;

public interface IDbConnectionFactory
{
    IDbConnection CreateConnection();
}
