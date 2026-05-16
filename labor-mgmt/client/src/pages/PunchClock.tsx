import { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useCreateWorker, usePunchWorker, useWorkers } from '../hooks/useWorkers'

export default function PunchClock() {
  const { data: workers, isLoading } = useWorkers()
  const createWorker = useCreateWorker()
  const punchWorker = usePunchWorker()
  const [adding, setAdding] = useState(false)
  const [newName, setNewName] = useState('')

  async function handleSave() {
    if (!newName.trim()) return
    await createWorker.mutateAsync(newName.trim())
    setNewName('')
    setAdding(false)
  }

  function handleCancel() {
    setNewName('')
    setAdding(false)
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" sx={{ flexGrow: 1 }}>Workers</Typography>
        <Button variant="contained" onClick={() => setAdding(true)} disabled={adding}>
          New Worker
        </Button>
      </Box>

      {adding && (
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <TextField
            size="small"
            label="Name"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSave()}
            autoFocus
          />
          <Button variant="contained" onClick={handleSave} disabled={createWorker.isPending}>
            Save
          </Button>
          <Button onClick={handleCancel}>Cancel</Button>
        </Box>
      )}

      {isLoading ? (
        <CircularProgress />
      ) : (
        <List disablePadding>
          {workers?.map(w => (
            <ListItem key={w.id} divider secondaryAction={
              <Button
                size="small"
                variant="contained"
                color="error"
                onClick={() => punchWorker.mutate(w.id)}
              >Punch</Button>
            }>
              <ListItemText primary={w.name} />
              <Typography
                sx={{
                  mr: 10,
                  fontWeight: 'bold',
                  color: w.status === 'in' ? 'success.main' : 'error.main',
                }}
              >
                {w.status.toUpperCase()}
              </Typography>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  )
}
