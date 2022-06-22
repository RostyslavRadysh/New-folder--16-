import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import Invoice from '@/models/invoice'

const invoiceApi = createApi({
    reducerPath: 'invoiceApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
    tagTypes: ['Invoices'],
    endpoints: (build) => ({
        getInvoices: build.query<Invoice[], void>({
            query: () => 'invoices',
            providesTags: (result) =>
                result ? [
                    ...result.map(({ id }) => ({ type: 'Invoices', id } as const)),
                    { type: 'Invoices', id: 'LIST' }
                ] : [{ type: 'Invoices', id: 'LIST' }]
        }),
        getInvoice: build.query<Invoice, string>({
            query: (id) => `invoices/${id}`,
            providesTags: (result) => {
                var id = result?.id
                return [{ type: 'Invoices', id }]
            }
        }),
        updateInvoice: build.mutation<Invoice, Partial<Invoice>>({
            query(data) {
                const { id, ...body } = data
                return {
                    url: `invoices/${id}`,
                    method: 'PUT',
                    body
                }
            },
            invalidatesTags: (result) => {
                var id = result?.id
                return [{ type: 'Invoices', id }]
            }
        })
    })
})

export const {
    useGetInvoicesQuery,
    useGetInvoiceQuery,
    useUpdateInvoiceMutation
} = invoiceApi

export default invoiceApi
