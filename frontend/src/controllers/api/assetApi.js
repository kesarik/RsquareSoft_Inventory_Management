import client from './client'

export async function fetchAssets() {
  const { data } = await client.get('/assets')
  return data
}

export async function fetchAssetById(id) {
  const { data } = await client.get(`/assets/${id}`)
  return data
}

export async function createAsset(payload) {
  const { data } = await client.post('/assets', payload)
  return data
}

export async function updateAsset(id, payload) {
  const { data } = await client.put(`/assets/${id}`, payload)
  return data
}

export async function deleteAsset(id) {
  await client.delete(`/assets/${id}`)
}
