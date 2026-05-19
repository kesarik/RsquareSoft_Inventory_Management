import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createAsset,
  deleteAsset,
  fetchAssetById,
  fetchAssets,
  updateAsset,
} from '../api/assetApi'

export function useAssets() {
  return useQuery({
    queryKey: ['assets'],
    queryFn: fetchAssets,
    staleTime: 1000 * 60 * 2,
  })
}

export function useAsset(id) {
  return useQuery({
    queryKey: ['asset', id],
    queryFn: () => fetchAssetById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 2,
  })
}

export function useCreateAsset() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createAsset,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['assets'] }),
  })
}

export function useUpdateAsset() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }) => updateAsset(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['assets'] }),
  })
}

export function useDeleteAsset() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteAsset,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['assets'] }),
  })
}
