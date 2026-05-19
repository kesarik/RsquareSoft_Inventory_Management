import { useQuery } from '@tanstack/react-query'
import { fetchCategories } from '../api/categoryApi'

export function useCategories(type) {
  return useQuery({
    queryKey: ['categories', type ?? 'all'],
    queryFn: () => fetchCategories(type),
    staleTime: 1000 * 60 * 10,
  })
}
