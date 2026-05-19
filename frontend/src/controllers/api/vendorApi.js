import client from './client'

export async function fetchVendors() {
  const { data } = await client.get('/vendors')
  return data
}
