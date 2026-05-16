import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getWorkers, workersKey } from '../services/workerService'
import {
  getAllVacationRequests,
  approveVacationRequest,
  denyVacationRequest,
  VacationRequest,
} from '../services/vacationService'

export type WorkerRow = {
  kind: 'worker'
  id: string
  workerName: string
  count: number
}

export type RequestRow = {
  kind: 'request'
  id: string
  vacationId: number
  workerId: number
  workerName: string
  startDate: string
  endDate: string
  status: VacationRequest['status']
}

export type GridRow = WorkerRow | RequestRow

const allVacationKey = ['vacation', 'all'] as const

export function useManageVacation() {
  const workers = useQuery({ queryKey: workersKey, queryFn: getWorkers, staleTime: Infinity })
  const requests = useQuery({ queryKey: allVacationKey, queryFn: getAllVacationRequests, staleTime: 0 })

  const rows: GridRow[] = []

  if (workers.data && requests.data) {
    const workerMap = new Map(workers.data.map(w => [w.id, w.name]))
    const byWorker = new Map<number, VacationRequest[]>()

    for (const req of requests.data) {
      const list = byWorker.get(req.workerId) ?? []
      list.push(req)
      byWorker.set(req.workerId, list)
    }

    for (const [workerId, reqs] of byWorker) {
      const workerName = workerMap.get(workerId) ?? `Worker ${workerId}`
      rows.push({ kind: 'worker', id: `w-${workerId}`, workerName, count: reqs.length })
      for (const req of reqs) {
        rows.push({
          kind: 'request',
          id: `r-${req.id}`,
          vacationId: req.id,
          workerId: req.workerId,
          workerName,
          startDate: req.startDate,
          endDate: req.endDate,
          status: req.status,
        })
      }
    }
  }

  return {
    rows,
    isLoading: workers.isLoading || requests.isLoading,
    isError: workers.isError || requests.isError,
  }
}

export function useApproveVacationRequest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => approveVacationRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: allVacationKey })
    },
  })
}

export function useDenyVacationRequest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => denyVacationRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: allVacationKey })
    },
  })
}
