import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import Vote from '@/models/vote'

const voteApi = createApi({
    reducerPath: 'voteApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
    tagTypes: ['Votes'],
    endpoints: (build) => ({
        getVotes: build.query<Vote[], void>({
            query: () => 'votes',
            providesTags: (result) =>
                result ? [
                    ...result.map(({ id }) => ({ type: 'Votes', id } as const)),
                    { type: 'Votes', id: 'LIST' }
                ] : [{ type: 'Votes', id: 'LIST' }]
        }),
        getVote: build.query<Vote, string>({
            query: (id) => `votes/${id}`,
            providesTags: (result) => {
                var id = result?.id
                return [{ type: 'Votes', id }]
            }
        }),
        updateVote: build.mutation<Vote, Partial<Vote>>({
            query(data) {
                const { id, ...body } = data
                return {
                    url: `votes/${id}`,
                    method: 'PUT',
                    body
                }
            },
            invalidatesTags: (result) => {
                var id = result?.id
                return [{ type: 'Votes', id }]
            }
        })
    })
})

export const {
    useGetVotesQuery,
    useGetVoteQuery,
    useUpdateVoteMutation
} = voteApi

export default voteApi
