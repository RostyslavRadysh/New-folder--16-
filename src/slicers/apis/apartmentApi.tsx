import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import Apartment from '@/models/apartment'

const apartmentApi = createApi({
    reducerPath: 'apartmentApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
    tagTypes: ['Apartments'],
    endpoints: (build) => ({
        getApartments: build.query<Apartment[], void>({
            query: () => 'apartments',
            providesTags: (result) =>
                result ? [
                    ...result.map(({ id }) => ({ type: 'Apartments', id } as const)),
                    { type: 'Apartments', id: 'LIST' }
                ] : [{ type: 'Apartments', id: 'LIST' }]
        }),
        getApartment: build.query<Apartment, string>({
            query: (id) => `apartments/${id}`,
            providesTags: (result) => {
                var id = result?.id
                return [{ type: 'Apartments', id }]
            }
        }),
        updateApartment: build.mutation<Apartment, Partial<Apartment>>({
            query(data) {
                const { id, ...body } = data
                return {
                    url: `apartments/${id}`,
                    method: 'PUT',
                    body
                }
            },
            invalidatesTags: (result) => {
                var id = result?.id
                return [{ type: 'Apartments', id }]
            }
        })
    })
})

export const {
    useGetApartmentsQuery,
    useGetApartmentQuery,
    useUpdateApartmentMutation
} = apartmentApi

export default apartmentApi
