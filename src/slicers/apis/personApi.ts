import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import Person from '@/models/person'

const personApi = createApi({
    reducerPath: 'personApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
    tagTypes: ['Persons'],
    endpoints: (build) => ({
        getPersons: build.query<Person[], void>({
            query: () => 'persons',
            providesTags: (result) =>
                result ? [
                    ...result.map(({ id }) => ({ type: 'Persons', id } as const)),
                    { type: 'Persons', id: 'LIST' }
                ] : [{ type: 'Persons', id: 'LIST' }]
        }),
        addPerson: build.mutation<Person, Partial<Person>>({
            query(data) {
                const { id, ...body } = data
                return {
                    url: 'persons',
                    method: 'POST',
                    body
                }
            },
            invalidatesTags: [{ type: 'Persons', id: 'LIST' }]
        }),
        getPerson: build.query<Person, string>({
            query: (id) => `persons/${id}`,
            providesTags: (result) => {
                var id = result?.id
                return [{ type: 'Persons', id }]
            }
        }),
        updatePerson: build.mutation<Person, Partial<Person>>({
            query(data) {
                const { id, ...body } = data
                return {
                    url: `persons/${id}`,
                    method: 'PUT',
                    body
                }
            },
            invalidatesTags: (result) => {
                var id = result?.id
                return [{ type: 'Persons', id }]
            }
        }),
        deletePerson: build.mutation<{ success: boolean; id: string }, string>({
            query(id) {
                return {
                    url: `persons/${id}`,
                    method: 'DELETE'
                }
            },
            invalidatesTags: (result) => {
                var id = result?.id
                return [{ type: 'Persons', id }]
            }
        })
    })
})

export const {
    useGetPersonsQuery,
    useAddPersonMutation,
    useGetPersonQuery,
    useUpdatePersonMutation,
    useDeletePersonMutation
} = personApi

export default personApi
