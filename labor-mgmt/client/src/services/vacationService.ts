export interface VacationRequest {
  id: number
  workerId: number
  startDate: string
  endDate: string
  status: 'Pending' | 'Approved' | 'Denied'
  createdAt: string
}

export const vacationKey = (workerId: number) => ['vacation', workerId] as const

export async function getVacationRequests(workerId: number): Promise<VacationRequest[]> {
  const res = await fetch(`/api/workers/${workerId}/vacation`)
  if (!res.ok) throw new Error('Failed to fetch vacation requests')
  return res.json()
}

export async function createVacationRequest(
  workerId: number,
  startDate: string,
  endDate: string,
): Promise<VacationRequest> {
  const res = await fetch(`/api/workers/${workerId}/vacation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ startDate, endDate }),
  })
  if (!res.ok) throw new Error('Failed to create vacation request')
  return res.json()
}

export async function updateVacationRequest(
  workerId: number,
  vacationId: number,
  startDate: string,
  endDate: string,
): Promise<void> {
  const res = await fetch(`/api/workers/${workerId}/vacation/${vacationId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ startDate, endDate }),
  })
  if (!res.ok) throw new Error('Failed to update vacation request')
}

export async function deleteVacationRequest(workerId: number, vacationId: number): Promise<void> {
  const res = await fetch(`/api/workers/${workerId}/vacation/${vacationId}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to delete vacation request')
}

export async function getAllVacationRequests(): Promise<VacationRequest[]> {
  const res = await fetch('/api/vacation')
  if (!res.ok) throw new Error('Failed to fetch all vacation requests')
  return res.json()
}

export async function approveVacationRequest(id: number): Promise<void> {
  const res = await fetch(`/api/vacation/${id}/approve`, { method: 'POST' })
  if (!res.ok) throw new Error('Failed to approve vacation request')
}

export async function denyVacationRequest(id: number): Promise<void> {
  const res = await fetch(`/api/vacation/${id}/deny`, { method: 'POST' })
  if (!res.ok) throw new Error('Failed to deny vacation request')
}
