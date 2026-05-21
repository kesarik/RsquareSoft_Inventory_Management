import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createAllocation,
  fetchAllocations,
  fetchEmployeeAllocations,
  returnAllocation,
} from '../api/allocationApi'

export function useAllocations(activeOnly = false) {
  return useQuery({
    queryKey: ['allocations', activeOnly],
    queryFn: () => fetchAllocations(activeOnly),
    staleTime: 1000 * 60 * 2,
  })
}

export function useEmployeeAllocations(employeeId) {
  return useQuery({
    queryKey: ['allocations', 'employee', employeeId],
    queryFn: () => fetchEmployeeAllocations(employeeId),
    enabled: !!employeeId,
    staleTime: 1000 * 60 * 2,
  })
}

export function useCreateAllocation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createAllocation,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['allocations'] })
      qc.invalidateQueries({ queryKey: ['assets'] })
    },
  })
}

export function useReturnAllocation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: returnAllocation,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['allocations'] })
      qc.invalidateQueries({ queryKey: ['assets'] })
    },
  })
}
