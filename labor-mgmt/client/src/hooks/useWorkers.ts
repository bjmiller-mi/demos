import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createWorker, getWorkers, punchWorker, Worker, workersKey } from '../services/workerService'

export function useWorkers() {
  return useQuery({ queryKey: workersKey, queryFn: getWorkers, staleTime: Infinity })
}

export function useCreateWorker() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createWorker,
    onSuccess: (worker: Worker) => {
      queryClient.setQueryData<Worker[]>(workersKey, prev => [worker, ...(prev ?? [])])
    },
  })
}

export function usePunchWorker() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: punchWorker,
    onSuccess: (worker: Worker) => {
      queryClient.setQueryData<Worker[]>(workersKey, prev =>
        prev?.map(w => w.id === worker.id ? worker : w) ?? []
      )
    },
  })
}
