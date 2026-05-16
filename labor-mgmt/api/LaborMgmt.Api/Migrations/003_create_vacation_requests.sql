IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'vacation_requests')
CREATE TABLE vacation_requests (
    id         INT IDENTITY(1,1) PRIMARY KEY,
    worker_id  INT          NOT NULL REFERENCES workers(id),
    start_date DATE         NOT NULL,
    end_date   DATE         NOT NULL,
    status     NVARCHAR(10) NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Denied')),
    created_at DATETIME2    NOT NULL DEFAULT GETUTCDATE()
);
