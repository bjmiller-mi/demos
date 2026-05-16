export const workersKey = ['workers'] as const

export interface Worker {
  id: number
  name: string
  status: 'in' | 'out'
}

export async function getWorkers(): Promise<Worker[]> {
  const res = await fetch('/api/workers')
  if (!res.ok) throw new Error('Failed to fetch workers')
  return res.json()
}

export async function punchWorker(id: number): Promise<Worker> {
  const res = await fetch(`/api/workers/${id}/punch`, { method: 'POST' })
  if (!res.ok) throw new Error('Failed to punch worker')
  return res.json()
}

export async function createWorker(name: string): Promise<Worker> {
  const res = await fetch('/api/workers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  })
  if (!res.ok) throw new Error('Failed to create worker')
  return res.json()
}

export interface TimecardEntry {
  id: number
  type: 'in' | 'out'
  punchedAt: string
}

export async function getTimecard(workerId: number): Promise<TimecardEntry[]> {
  const res = await fetch(`/api/workers/${workerId}/timecard`)
  if (!res.ok) throw new Error('Failed to fetch timecard')
  return res.json()
}
