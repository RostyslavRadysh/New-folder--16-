import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import Account from '@/models/account'

const accountApi = createApi({
    reducerPath: 'accountApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
    tagTypes: ['Accounts'],
    endpoints: (build) => ({
        getAccounts: build.query<Account[], void>({
            query: () => 'accounts',
            providesTags: (result) =>
                result ? [
                    ...result.map(({ id }) => ({ type: 'Accounts', id } as const)),
                    { type: 'Accounts', id: 'LIST' }
                ] : [{ type: 'Accounts', id: 'LIST' }]
        }),
        getAccount: build.query<Account, string>({
            query: (id) => `accounts/${id}`,
            providesTags: (result) => {
                var id = result?.id
                return [{ type: 'Accounts', id }]
            }
        }),
        updateAccount: build.mutation<Account, Partial<Account>>({
            query(data) {
                const { id, ...body } = data
                return {
                    url: `accounts/${id}`,
                    method: 'PUT',
                    body
                }
            },
            invalidatesTags: (result) => {
                var id = result?.id
                return [{ type: 'Accounts', id }]
            }
        })
    })
})

export const {
    useGetAccountsQuery,
    useGetAccountQuery,
    useUpdateAccountMutation
} = accountApi

export default accountApi
