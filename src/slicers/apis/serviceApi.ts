import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import Service from '@/models/service'

const serviceApi = createApi({
    reducerPath: 'serviceApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
    tagTypes: ['Services'],
    endpoints: (build) => ({
        getServices: build.query<Service[], void>({
            query: () => 'services',
            providesTags: (result) =>
                result ? [
                    ...result.map(({ id }) => ({ type: 'Services', id } as const)),
                    { type: 'Services', id: 'LIST' }
                ] : [{ type: 'Services', id: 'LIST' }]
        }),
        getService: build.query<Service, string>({
            query: (id) => `services/${id}`,
            providesTags: (result) => {
                var id = result?.id
                return [{ type: 'Services', id }]
            }
        }),
        updateService: build.mutation<Service, Partial<Service>>({
            query(data) {
                const { id, ...body } = data
                return {
                    url: `services/${id}`,
                    method: 'PUT',
                    body
                }
            },
            invalidatesTags: (result) => {
                var id = result?.id
                return [{ type: 'Services', id }]
            }
        })
    })
})

export const {
    useGetServicesQuery,
    useGetServiceQuery,
    useUpdateServiceMutation
} = serviceApi

export default serviceApi
