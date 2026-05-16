import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createVacationRequest,
  deleteVacationRequest,
  getVacationRequests,
  updateVacationRequest,
  vacationKey,
} from '../services/vacationService'

export function useVacationRequests(workerId: number | null) {
  return useQuery({
    queryKey: vacationKey(workerId ?? 0),
    queryFn: () => getVacationRequests(workerId!),
    enabled: workerId !== null,
    staleTime: 0,
  })
}

export function useCreateVacationRequest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ workerId, startDate, endDate }: { workerId: number; startDate: string; endDate: string }) =>
      createVacationRequest(workerId, startDate, endDate),
    onSuccess: (_, { workerId }) => {
      queryClient.invalidateQueries({ queryKey: vacationKey(workerId) })
    },
  })
}

export function useUpdateVacationRequest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      workerId,
      vacationId,
      startDate,
      endDate,
    }: {
      workerId: number
      vacationId: number
      startDate: string
      endDate: string
    }) => updateVacationRequest(workerId, vacationId, startDate, endDate),
    onSuccess: (_, { workerId }) => {
      queryClient.invalidateQueries({ queryKey: vacationKey(workerId) })
    },
  })
}

export function useDeleteVacationRequest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ workerId, vacationId }: { workerId: number; vacationId: number }) =>
      deleteVacationRequest(workerId, vacationId),
    onSuccess: (_, { workerId }) => {
      queryClient.invalidateQueries({ queryKey: vacationKey(workerId) })
    },
  })
}
