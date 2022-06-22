import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import Employee from '@/models/employee'

const employeeApi = createApi({
    reducerPath: 'employeeApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
    tagTypes: ['Employees'],
    endpoints: (build) => ({
        getEmployees: build.query<Employee[], void>({
            query: () => 'employees',
            providesTags: (result) =>
                result ? [
                    ...result.map(({ id }) => ({ type: 'Employees', id } as const)),
                    { type: 'Employees', id: 'LIST' }
                ] : [{ type: 'Employees', id: 'LIST' }]
        }),
        addEmployee: build.mutation<Employee, Partial<Employee>>({
            query(data) {
                const { id, ...body } = data
                return {
                    url: 'employees',
                    method: 'POST',
                    body
                }
            },
            invalidatesTags: [{ type: 'Employees', id: 'LIST' }]
        }),
        getEmployee: build.query<Employee, string>({
            query: (id) => `employees/${id}`,
            providesTags: (result) => {
                var id = result?.id
                return [{ type: 'Employees', id }]
            }
        }),
        updateEmployee: build.mutation<Employee, Partial<Employee>>({
            query(data) {
                const { id, ...body } = data
                return {
                    url: `employees/${id}`,
                    method: 'PUT',
                    body
                }
            },
            invalidatesTags: (result) => {
                var id = result?.id
                return [{ type: 'Employees', id }]
            }
        }),
        deleteEmployee: build.mutation<{ success: boolean; id: string }, string>({
            query(id) {
                return {
                    url: `employees/${id}`,
                    method: 'DELETE'
                }
            },
            invalidatesTags: (result) => {
                var id = result?.id
                return [{ type: 'Employees', id }]
            }
        })
    })
})

export const {
    useGetEmployeesQuery,
    useAddEmployeeMutation,
    useGetEmployeeQuery,
    useUpdateEmployeeMutation,
    useDeleteEmployeeMutation
} = employeeApi

export default employeeApi
