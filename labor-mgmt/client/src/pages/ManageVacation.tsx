import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import {
  GridRow,
  RequestRow,
  useApproveVacationRequest,
  useDenyVacationRequest,
  useManageVacation,
} from '../hooks/useManageVacation'

const statusColor = (status: RequestRow['status']) => {
  if (status === 'Approved') return 'success'
  if (status === 'Denied') return 'error'
  return 'warning'
}

function ActionCell({ row, onApprove, onDeny }: {
  row: GridRow
  onApprove: (id: number) => void
  onDeny: (id: number) => void
}) {
  if (row.kind !== 'request') return null
  if (row.status !== 'Pending') {
    return (
      <Chip
        label={row.status}
        color={statusColor(row.status)}
        size="small"
        variant="outlined"
      />
    )
  }
  return (
    <Box sx={{ display: 'flex', gap: 1 }}>
      <Button
        size="small"
        variant="contained"
        color="success"
        onClick={() => onApprove(row.vacationId)}
      >
        Approve
      </Button>
      <Button
        size="small"
        variant="contained"
        color="error"
        onClick={() => onDeny(row.vacationId)}
      >
        Deny
      </Button>
    </Box>
  )
}

export default function ManageVacation() {
  const { rows, isLoading, isError } = useManageVacation()
  const approve = useApproveVacationRequest()
  const deny = useDenyVacationRequest()

  const columns: GridColDef<GridRow>[] = [
    {
      field: 'workerName',
      headerName: 'Worker',
      flex: 1,
      renderCell: (params: GridRenderCellParams<GridRow>) => {
        const row = params.row
        if (row.kind === 'worker') {
          return (
            <Box sx={{ fontWeight: 700 }}>
              {row.workerName}
              <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                ({row.count} {row.count === 1 ? 'request' : 'requests'})
              </Typography>
            </Box>
          )
        }
        return <Box sx={{ pl: 3, color: 'text.secondary' }}>—</Box>
      },
    },
    {
      field: 'startDate',
      headerName: 'Start Date',
      width: 140,
      renderCell: (params: GridRenderCellParams<GridRow>) =>
        params.row.kind === 'request' ? params.row.startDate : null,
    },
    {
      field: 'endDate',
      headerName: 'End Date',
      width: 140,
      renderCell: (params: GridRenderCellParams<GridRow>) =>
        params.row.kind === 'request' ? params.row.endDate : null,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      renderCell: (params: GridRenderCellParams<GridRow>) => {
        const row = params.row
        if (row.kind !== 'request') return null
        return <Chip label={row.status} color={statusColor(row.status)} size="small" />
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      sortable: false,
      renderCell: (params: GridRenderCellParams<GridRow>) => (
        <ActionCell
          row={params.row}
          onApprove={id => approve.mutate(id)}
          onDeny={id => deny.mutate(id)}
        />
      ),
    },
  ]

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (isError) {
    return (
      <Typography color="error" sx={{ mt: 4 }}>
        Failed to load vacation data.
      </Typography>
    )
  }

  return (
    <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h4">Manage Vacation</Typography>
      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={row => row.id}
        disableRowSelectionOnClick
        hideFooter={rows.length === 0}
        getRowClassName={params => params.row.kind === 'worker' ? 'worker-row' : ''}
        sx={{
          flex: 1,
          '& .worker-row': {
            backgroundColor: 'action.hover',
          },
          '& .worker-row:hover': {
            backgroundColor: 'action.selected',
          },
        }}
      />
      {rows.length === 0 && (
        <Typography color="text.secondary">No vacation requests found.</Typography>
      )}
    </Box>
  )
}
