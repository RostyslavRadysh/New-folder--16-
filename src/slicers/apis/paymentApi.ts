import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import Payment from '@/models/payment'

const paymentApi = createApi({
    reducerPath: 'paymentApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
    tagTypes: ['Payments'],
    endpoints: (build) => ({
        getPayments: build.query<Payment[], void>({
            query: () => 'payments',
            providesTags: (result) =>
                result ? [
                    ...result.map(({ id }) => ({ type: 'Payments', id } as const)),
                    { type: 'Payments', id: 'LIST' }
                ] : [{ type: 'Payments', id: 'LIST' }]
        }),
        getPayment: build.query<Payment, string>({
            query: (id) => `payments/${id}`,
            providesTags: (result) => {
                var id = result?.id
                return [{ type: 'Payments', id }]
            }
        }),
        updatePayment: build.mutation<Payment, Partial<Payment>>({
            query(data) {
                const { id, ...body } = data
                return {
                    url: `payments/${id}`,
                    method: 'PUT',
                    body
                }
            },
            invalidatesTags: (result) => {
                var id = result?.id
                return [{ type: 'Payments', id }]
            }
        })
    })
})

export const {
    useGetPaymentsQuery,
    useGetPaymentQuery,
    useUpdatePaymentMutation
} = paymentApi

export default paymentApi
