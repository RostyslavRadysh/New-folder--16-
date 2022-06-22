import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import Arrangement from '@/models/arrangement'

const arrangementApi = createApi({
    reducerPath: 'arrangementApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
    tagTypes: ['Arrangements'],
    endpoints: (build) => ({
        getArrangements: build.query<Arrangement[], void>({
            query: () => 'arrangements',
            providesTags: (result) =>
                result ? [
                    ...result.map(({ id }) => ({ type: 'Arrangements', id } as const)),
                    { type: 'Arrangements', id: 'LIST' }
                ] : [{ type: 'Arrangements', id: 'LIST' }]
        }),
        addArrangement: build.mutation<Arrangement, Partial<Arrangement>>({
            query(data) {
                const { id, ...body } = data
                return {
                    url: 'arrangements',
                    method: 'POST',
                    body
                }
            },
            invalidatesTags: [{ type: 'Arrangements', id: 'LIST' }]
        }),
        getArrangement: build.query<Arrangement, string>({
            query: (id) => `arrangements/${id}`,
            providesTags: (result) => {
                var id = result?.id
                return [{ type: 'Arrangements', id }]
            }
        }),
        updateArrangement: build.mutation<Arrangement, Partial<Arrangement>>({
            query(data) {
                const { id, ...body } = data
                return {
                    url: `arrangements/${id}`,
                    method: 'PUT',
                    body
                }
            },
            invalidatesTags: (result) => {
                var id = result?.id
                return [{ type: 'Arrangements', id }]
            }
        }),
        deleteArrangement: build.mutation<{ success: boolean; id: string }, string>({
            query(id) {
                return {
                    url: `arrangements/${id}`,
                    method: 'DELETE'
                }
            },
            invalidatesTags: (result) => {
                var id = result?.id
                return [{ type: 'Arrangements', id }]
            }
        })
    })
})

export const {
    useGetArrangementsQuery,
    useAddArrangementMutation,
    useGetArrangementQuery,
    useUpdateArrangementMutation,
    useDeleteArrangementMutation
} = arrangementApi

export default arrangementApi
