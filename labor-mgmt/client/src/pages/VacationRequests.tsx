import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useWorkers } from '../hooks/useWorkers'
import {
  useVacationRequests,
  useCreateVacationRequest,
  useUpdateVacationRequest,
  useDeleteVacationRequest,
} from '../hooks/useVacationRequests'
import { VacationRequest } from '../services/vacationService'

const statusColor: Record<VacationRequest['status'], 'warning' | 'success' | 'error'> = {
  Pending: 'warning',
  Approved: 'success',
  Denied: 'error',
}

export default function VacationRequests() {
  const { data: workers } = useWorkers()
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const { data: requests, isLoading } = useVacationRequests(selectedId)
  const createMutation = useCreateVacationRequest()
  const updateMutation = useUpdateVacationRequest()
  const deleteMutation = useDeleteVacationRequest()

  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<VacationRequest | null>(null)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  useEffect(() => {
    if (workers?.length && selectedId === null) {
      setSelectedId(workers[0].id)
    }
  }, [workers, selectedId])

  function openAdd() {
    setEditing(null)
    setStartDate('')
    setEndDate('')
    setOpen(true)
  }

  function openEdit(req: VacationRequest) {
    setEditing(req)
    setStartDate(req.startDate)
    setEndDate(req.endDate)
    setOpen(true)
  }

  function handleClose() {
    setOpen(false)
    setEditing(null)
    setStartDate('')
    setEndDate('')
  }

  function handleSave() {
    if (!selectedId || !startDate || !endDate) return
    if (editing) {
      updateMutation.mutate(
        { workerId: selectedId, vacationId: editing.id, startDate, endDate },
        { onSuccess: handleClose },
      )
    } else {
      createMutation.mutate(
        { workerId: selectedId, startDate, endDate },
        { onSuccess: handleClose },
      )
    }
  }

  const saving = createMutation.isPending || updateMutation.isPending

  return (
    <>
      <Box sx={{ display: 'flex', height: '100%', gap: 2 }}>
        <Box sx={{ width: 220, flexShrink: 0, border: 1, borderColor: 'divider', borderRadius: 1, overflow: 'auto' }}>
          <Typography variant="subtitle2" sx={{ px: 2, pt: 1.5, pb: 0.5, color: 'text.secondary' }}>
            Workers
          </Typography>
          <Divider />
          <List dense disablePadding>
            {workers?.map(worker => (
              <ListItemButton
                key={worker.id}
                selected={worker.id === selectedId}
                onClick={() => setSelectedId(worker.id)}
              >
                <ListItemText primary={worker.name} />
              </ListItemButton>
            ))}
          </List>
        </Box>

        <Box sx={{ flex: 1, border: 1, borderColor: 'divider', borderRadius: 1, overflow: 'auto' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', px: 2, pt: 1.5, pb: 0.5 }}>
            <Typography variant="subtitle2" sx={{ color: 'text.secondary', flexGrow: 1 }}>
              Vacation Requests
            </Typography>
            <Button variant="contained" size="small" onClick={openAdd} disabled={selectedId === null}>
              Add Request
            </Button>
          </Box>
          <Divider />
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', pt: 4 }}>
              <CircularProgress size={24} />
            </Box>
          ) : requests?.length ? (
            <List dense disablePadding>
              {requests.map(req => (
                <ListItem
                  key={req.id}
                  secondaryAction={
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {req.status === 'Pending' && (
                        <Button size="small" onClick={() => openEdit(req)}>
                          Edit
                        </Button>
                      )}
                      <Button
                        size="small"
                        color="error"
                        onClick={() => selectedId && deleteMutation.mutate({ workerId: selectedId, vacationId: req.id })}
                      >
                        Delete
                      </Button>
                    </Box>
                  }
                >
                  <ListItemText
                    primary={`${req.startDate} → ${req.endDate}`}
                    secondary={
                      <Chip label={req.status} color={statusColor[req.status]} size="small" sx={{ mt: 0.5 }} />
                    }
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body2" sx={{ px: 2, pt: 2, color: 'text.secondary' }}>
              No requests
            </Typography>
          )}
        </Box>
      </Box>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
        <DialogTitle>{editing ? 'Edit Request' : 'Add Request'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '16px !important' }}>
          <TextField
            label="Start Date"
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
          <TextField
            label="End Date"
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={!startDate || !endDate || saving}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
