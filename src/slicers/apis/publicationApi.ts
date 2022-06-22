import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import Publication from '@/models/publication'

const publicationApi = createApi({
    reducerPath: 'publicationApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
    tagTypes: ['Publications'],
    endpoints: (build) => ({
        getPublications: build.query<Publication[], void>({
            query: () => 'publications',
            providesTags: (result) =>
                result ? [
                    ...result.map(({ id }) => ({ type: 'Publications', id } as const)),
                    { type: 'Publications', id: 'LIST' }
                ] : [{ type: 'Publications', id: 'LIST' }]
        }),
        addPublication: build.mutation<Publication, Partial<Publication>>({
            query(data) {
                const { id, ...body } = data
                return {
                    url: 'publications',
                    method: 'POST',
                    body
                }
            },
            invalidatesTags: [{ type: 'Publications', id: 'LIST' }]
        }),
        getPublication: build.query<Publication, string>({
            query: (id) => `publications/${id}`,
            providesTags: (result) => {
                var id = result?.id
                return [{ type: 'Publications', id }]
            }
        })
    })
})

export const {
    useGetPublicationsQuery,
    useAddPublicationMutation,
    useGetPublicationQuery
} = publicationApi

export default publicationApi
