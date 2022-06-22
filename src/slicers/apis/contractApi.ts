import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import Contract from '@/models/contract'

const contractApi = createApi({
    reducerPath: 'contractApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
    tagTypes: ['Contracts'],
    endpoints: (build) => ({
        getContracts: build.query<Contract[], void>({
            query: () => 'contracts',
            providesTags: (result) =>
                result ? [
                    ...result.map(({ id }) => ({ type: 'Contracts', id } as const)),
                    { type: 'Contracts', id: 'LIST' }
                ] : [{ type: 'Contracts', id: 'LIST' }]
        }),
        addContract: build.mutation<Contract, Partial<Contract>>({
            query(data) {
                const { id, ...body } = data
                return {
                    url: 'contracts',
                    method: 'POST',
                    body
                }
            },
            invalidatesTags: [{ type: 'Contracts', id: 'LIST' }]
        }),
        getContract: build.query<Contract, string>({
            query: (id) => `contracts/${id}`,
            providesTags: (result) => {
                var id = result?.id
                return [{ type: 'Contracts', id }]
            }
        }),
        updateContract: build.mutation<Contract, Partial<Contract>>({
            query(data) {
                const { id, ...body } = data
                return {
                    url: `contracts/${id}`,
                    method: 'PUT',
                    body
                }
            },
            invalidatesTags: (result) => {
                var id = result?.id
                return [{ type: 'Contracts', id }]
            }
        }),
        deleteContract: build.mutation<{ success: boolean; id: string }, string>({
            query(id) {
                return {
                    url: `contracts/${id}`,
                    method: 'DELETE'
                }
            },
            invalidatesTags: (result) => {
                var id = result?.id
                return [{ type: 'Contracts', id }]
            }
        })
    })
})

export const {
    useGetContractsQuery,
    useAddContractMutation,
    useGetContractQuery,
    useUpdateContractMutation,
    useDeleteContractMutation
} = contractApi

export default contractApi
