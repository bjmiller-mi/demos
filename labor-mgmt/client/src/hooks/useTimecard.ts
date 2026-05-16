import { useQuery } from '@tanstack/react-query'
import { getTimecard, TimecardEntry } from '../services/workerService'

export interface TimesheetRow {
  date: string
  duration: string
}

function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  return [h, m, s].map(v => String(v).padStart(2, '0')).join(':')
}

function transformEntries(entries: TimecardEntry[]): TimesheetRow[] {
  const rows: TimesheetRow[] = []
  for (let i = 0; i + 1 < entries.length; i += 2) {
    const inTime = new Date(entries[i].punchedAt)
    const outTime = new Date(entries[i + 1].punchedAt)
    rows.push({
      date: inTime.toLocaleDateString(),
      duration: formatDuration(outTime.getTime() - inTime.getTime()),
    })
  }
  return rows
}

export function useTimecard(workerId: number | null) {
  return useQuery({
    queryKey: ['timecard', workerId],
    queryFn: () => getTimecard(workerId!),
    enabled: workerId !== null,
    select: transformEntries,
  })
}
