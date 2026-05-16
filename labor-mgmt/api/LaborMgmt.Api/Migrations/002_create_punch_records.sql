IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'punch_records')
CREATE TABLE punch_records (
    id         INT IDENTITY(1,1) PRIMARY KEY,
    worker_id  INT          NOT NULL REFERENCES workers(id),
    type       NVARCHAR(3)  NOT NULL CHECK (type IN ('in', 'out')),
    punched_at DATETIME2    NOT NULL DEFAULT GETUTCDATE()
);
