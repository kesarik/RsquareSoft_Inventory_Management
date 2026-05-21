import client from './client'

export async function fetchEmployees() {
  const { data } = await client.get('/employees')
  return data
}

export async function fetchEmployeeById(id) {
  const { data } = await client.get(`/employees/${id}`)
  return data
}
