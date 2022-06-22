import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import Tool from '@/models/tool'

const toolApi = createApi({
    reducerPath: 'toolApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
    tagTypes: ['Tools'],
    endpoints: (build) => ({
        getTools: build.query<Tool[], void>({
            query: () => 'tools',
            providesTags: (result) =>
                result ? [
                    ...result.map(({ id }) => ({ type: 'Tools', id } as const)),
                    { type: 'Tools', id: 'LIST' }
                ] : [{ type: 'Tools', id: 'LIST' }]
        }),
        addTool: build.mutation<Tool, Partial<Tool>>({
            query(data) {
                const { id, ...body } = data
                return {
                    url: 'tools',
                    method: 'POST',
                    body
                }
            },
            invalidatesTags: [{ type: 'Tools', id: 'LIST' }]
        }),
        getTool: build.query<Tool, string>({
            query: (id) => `tools/${id}`,
            providesTags: (result) => {
                var id = result?.id
                return [{ type: 'Tools', id }]
            }
        }),
        updateTool: build.mutation<Tool, Partial<Tool>>({
            query(data) {
                const { id, ...body } = data
                return {
                    url: `tools/${id}`,
                    method: 'PUT',
                    body
                }
            },
            invalidatesTags: (result) => {
                var id = result?.id
                return [{ type: 'Tools', id }]
            }
        }),
        deleteTool: build.mutation<{ success: boolean; id: string }, string>({
            query(id) {
                return {
                    url: `tools/${id}`,
                    method: 'DELETE'
                }
            },
            invalidatesTags: (result) => {
                var id = result?.id
                return [{ type: 'Tools', id }]
            }
        })
    })
})

export const {
    useGetToolsQuery,
    useAddToolMutation,
    useGetToolQuery,
    useUpdateToolMutation,
    useDeleteToolMutation
} = toolApi

export default toolApi
