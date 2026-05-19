import client from './client'

export async function fetchCategories(type) {
  const params = type ? { type } : {}
  const { data } = await client.get('/categories', { params })
  return data
}
