IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'workers')
CREATE TABLE workers (
    id         INT IDENTITY(1,1) PRIMARY KEY,
    name       NVARCHAR(255) NOT NULL,
    created_at DATETIME2     NOT NULL DEFAULT GETUTCDATE(),
    clock_in   DATETIME2     NULL,
    clock_out  DATETIME2     NULL
);
