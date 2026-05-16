import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import { useWorkers } from '../hooks/useWorkers'
import { useTimecard } from '../hooks/useTimecard'

export default function Timesheets() {
  const { data: workers } = useWorkers()
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const { data: rows, isLoading } = useTimecard(selectedId)

  useEffect(() => {
    if (workers?.length && selectedId === null) {
      setSelectedId(workers[0].id)
    }
  }, [workers, selectedId])

  return (
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
        <Typography variant="subtitle2" sx={{ px: 2, pt: 1.5, pb: 0.5, color: 'text.secondary' }}>
          Time Entries
        </Typography>
        <Divider />
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', pt: 4 }}>
            <CircularProgress size={24} />
          </Box>
        ) : (
          <List dense disablePadding>
            {rows?.length ? rows.map((row, i) => (
              <ListItemButton key={i} disableRipple sx={{ cursor: 'default' }}>
                <ListItemText primary={row.date} secondary={row.duration} />
              </ListItemButton>
            )) : (
              <Typography variant="body2" sx={{ px: 2, pt: 2, color: 'text.secondary' }}>
                No entries
              </Typography>
            )}
          </List>
        )}
      </Box>
    </Box>
  )
}
