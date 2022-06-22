import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import Community from '@/models/community'

const communityApi = createApi({
    reducerPath: 'communityApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
    tagTypes: ['Communities'],
    endpoints: (build) => ({
        getCommunities: build.query<Community[], void>({
            query: () => 'communities',
            providesTags: (result) =>
                result ? [
                    ...result.map(({ id }) => ({ type: 'Communities', id } as const)),
                    { type: 'Communities', id: 'LIST' }
                ] : [{ type: 'Communities', id: 'LIST' }]
        }),
        getCommunity: build.query<Community, string>({
            query: (id) => `communities/${id}`,
            providesTags: (result) => {
                var id = result?.id
                return [{ type: 'Communities', id }]
            }
        }),
        updateCommunity: build.mutation<Community, Partial<Community>>({
            query(data) {
                const { id, ...body } = data
                return {
                    url: `communities/${id}`,
                    method: 'PUT',
                    body
                }
            },
            invalidatesTags: (result) => {
                var id = result?.id
                return [{ type: 'Communities', id }]
            }
        })
    })
})

export const {
    useGetCommunitiesQuery,
    useGetCommunityQuery,
    useUpdateCommunityMutation
} = communityApi

export default communityApi
