import { useQuery } from '@tanstack/react-query'
import { fetchEmployees, fetchEmployeeById } from '../api/employeeApi'

export function useEmployees() {
  return useQuery({
    queryKey: ['employees'],
    queryFn: fetchEmployees,
    staleTime: 1000 * 60 * 5,
  })
}

export function useEmployee(id) {
  return useQuery({
    queryKey: ['employee', id],
    queryFn: () => fetchEmployeeById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  })
}
