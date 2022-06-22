import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import Snapshot from '@/models/snapshot'

const snapshotApi = createApi({
    reducerPath: 'snapshotApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
    tagTypes: ['Snapshots'],
    endpoints: (build) => ({
        getSnapshots: build.query<Snapshot[], void>({
            query: () => 'snapshots',
            providesTags: (result) =>
                result ? [
                    ...result.map(({ id }) => ({ type: 'Snapshots', id } as const)),
                    { type: 'Snapshots', id: 'LIST' }
                ] : [{ type: 'Snapshots', id: 'LIST' }]
        }),
        addSnapshot: build.mutation<Snapshot, Partial<Snapshot>>({
            query(data) {
                const { id, ...body } = data
                return {
                    url: 'snapshots',
                    method: 'POST',
                    body
                }
            },
            invalidatesTags: [{ type: 'Snapshots', id: 'LIST' }]
        }),
        getSnapshot: build.query<Snapshot, string>({
            query: (id) => `snapshots/${id}`,
            providesTags: (result) => {
                var id = result?.id
                return [{ type: 'Snapshots', id }]
            }
        }),
        updateSnapshot: build.mutation<Snapshot, Partial<Snapshot>>({
            query(data) {
                const { id, ...body } = data
                return {
                    url: `snapshots/${id}`,
                    method: 'PUT',
                    body
                }
            },
            invalidatesTags: (result) => {
                var id = result?.id
                return [{ type: 'Snapshots', id }]
            }
        }),
        deleteSnapshot: build.mutation<{ success: boolean; id: string }, string>({
            query(id) {
                return {
                    url: `snapshots/${id}`,
                    method: 'DELETE'
                }
            },
            invalidatesTags: (result) => {
                var id = result?.id
                return [{ type: 'Snapshots', id }]
            }
        })
    })
})

export const {
    useGetSnapshotsQuery,
    useAddSnapshotMutation,
    useGetSnapshotQuery,
    useUpdateSnapshotMutation,
    useDeleteSnapshotMutation
} = snapshotApi

export default snapshotApi
