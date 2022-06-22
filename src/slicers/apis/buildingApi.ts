import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import Building from '@/models/building'

const buildingApi = createApi({
    reducerPath: 'buildingApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
    tagTypes: ['Buildings'],
    endpoints: (build) => ({
        getBuildings: build.query<Building[], void>({
            query: () => 'buildings',
            providesTags: (result) =>
                result ? [
                    ...result.map(({ id }) => ({ type: 'Buildings', id } as const)),
                    { type: 'Buildings', id: 'LIST' }
                ] : [{ type: 'Buildings', id: 'LIST' }]
        }),
        getBuilding: build.query<Building, string>({
            query: (id) => `buildings/${id}`,
            providesTags: (result) => {
                var id = result?.id
                return [{ type: 'Buildings', id }]
            }
        }),
        updateBuilding: build.mutation<Building, Partial<Building>>({
            query(data) {
                const { id, ...body } = data
                return {
                    url: `buildings/${id}`,
                    method: 'PUT',
                    body
                }
            },
            invalidatesTags: (result) => {
                var id = result?.id
                return [{ type: 'Buildings', id }]
            }
        })
    })
})

export const {
    useGetBuildingsQuery,
    useGetBuildingQuery,
    useUpdateBuildingMutation
} = buildingApi

export default buildingApi
