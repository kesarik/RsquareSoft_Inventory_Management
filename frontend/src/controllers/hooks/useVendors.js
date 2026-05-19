import { useQuery } from '@tanstack/react-query'
import { fetchVendors } from '../api/vendorApi'

export function useVendors() {
  return useQuery({
    queryKey: ['vendors'],
    queryFn: fetchVendors,
    staleTime: 1000 * 60 * 10,
  })
}
