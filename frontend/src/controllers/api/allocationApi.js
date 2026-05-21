import client from './client'

export async function fetchAllocations(activeOnly = false) {
  const { data } = await client.get('/allocations', {
    params: { active_only: activeOnly },
  })
  return data
}

export async function createAllocation(payload) {
  const { data } = await client.post('/allocations', payload)
  return data
}

export async function returnAllocation(id) {
  const { data } = await client.put(`/allocations/${id}/return`)
  return data
}

export async function fetchEmployeeAllocations(employeeId) {
  const { data } = await client.get(`/allocations/employee/${employeeId}`)
  return data
}
