import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import Poll from '@/models/poll'

const pollApi = createApi({
    reducerPath: 'pollApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
    tagTypes: ['Polls'],
    endpoints: (build) => ({
        getPolls: build.query<Poll[], void>({
            query: () => 'polls',
            providesTags: (result) =>
                result ? [
                    ...result.map(({ id }) => ({ type: 'Polls', id } as const)),
                    { type: 'Polls', id: 'LIST' }
                ] : [{ type: 'Polls', id: 'LIST' }]
        }),
        addPoll: build.mutation<Poll, Partial<Poll>>({
            query(data) {
                const { id, ...body } = data
                return {
                    url: 'polls',
                    method: 'POST',
                    body
                }
            },
            invalidatesTags: [{ type: 'Polls', id: 'LIST' }]
        }),
        getPoll: build.query<Poll, string>({
            query: (id) => `polls/${id}`,
            providesTags: (result) => {
                var id = result?.id
                return [{ type: 'Polls', id }]
            }
        })
    })
})

export const {
    useGetPollsQuery,
    useAddPollMutation,
    useGetPollQuery
} = pollApi

export default pollApi
