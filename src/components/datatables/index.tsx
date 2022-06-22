import React, { ReactNode, FunctionComponent, ChangeEvent } from 'react'
import Button from '@/components/buttons'
import { useState } from 'react'
import { useMemo } from 'react'

export interface DatatableProps {
    columns: ReactNode[]
    rows: ReactNode[][]
    messages: {
        noDataFound: string
        previous: string
        next: string
        page: string
        select: string
    }
}

const Datatable: FunctionComponent<DatatableProps> = ({ columns, rows, messages }: DatatableProps) => {
    const [pageSize, setPageSize] = useState<number>(10)
    const [pageIndex, setPageIndex] = useState<number>(0)
    const numberOfPages = useMemo<number>(() => {
        let length = rows.length
        let times = 1
        while (length > pageSize) {
            length -= pageSize
            times++
        }
        return times
    }, [rows, pageSize])
    const data = useMemo<ReactNode[][]>(() => {
        const start = pageSize * pageIndex
        const end = pageIndex > 0 ? pageSize * (pageIndex + 1) : pageSize
        return rows.slice(start, end)
    }, [rows, pageSize, pageIndex])
    const canNextPage = useMemo<boolean>(() => {
        const end = pageIndex > 0 ? pageSize * (pageIndex + 1) : pageSize
        return (rows.length - end > 0)
    }, [rows, pageSize, pageIndex])
    const canPreviousPage = useMemo<boolean>(() => {
        const start = pageSize * pageIndex
        return (rows.length - start !== rows.length)
    }, [rows, pageSize, pageIndex])

    return (
        <div className="flex flex-col">
            <div className="overflow-x-auto">
                <table className="w-full table-auto">
                    <thead>
                        <tr className="border-b-2 border-gray-100 dark:border-gray-600">
                            {columns.map((column, i) => {
                                return (
                                    <th
                                        className="pb-2 text-left text-xs font-bold tracking-wider text-gray-900 uppercase dark:text-white"
                                        key={i}>
                                        {column}
                                    </th>
                                )
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {!data.length && (
                            <tr className="border-b-2 border-gray-100 dark:border-gray-600">
                                <td
                                    className="py-2 text-center text-sm text-gray-900 dark:text-white"
                                    colSpan={columns.length}>
                                    {messages.noDataFound}
                                </td>
                            </tr>
                        )}
                        {data.map((row, i) => {
                            return (
                                <tr
                                    className="border-b-2 border-gray-100 dark:border-gray-600"
                                    key={i}>
                                    {row.map((column, j) => {
                                        return (
                                            <td
                                                className="py-2 text-sm text-gray-900 dark:text-white"
                                                key={j}>
                                                {column}
                                            </td>
                                        )
                                    })}
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
            <div className="flex flex-col space-y-2 lg:flex-row lg:space-y-0 justify-between items-center mt-3">
                <div className="space-x-2 flex flex-row items-center">
                    {canPreviousPage && (
                        <Button
                            title={messages.previous}
                            onClick={() => setPageIndex(pageIndex - 1)} />
                    )}
                    {canNextPage && (
                        <Button
                            title={messages.next}
                            onClick={() => setPageIndex(pageIndex + 1)} />
                    )}
                </div>
                <span className="text-sm text-gray-900 dark:text-white">
                    {`${messages.page} ${pageIndex + 1} / ${numberOfPages}`}
                </span>
                <select
                    className="p-2 text-sm text-gray-900 border border-gray-500 outline-none appearance-none focus:outline-none bg-white dark:bg-gray-800 dark:text-white"
                    value={pageSize}
                    onChange={(event: ChangeEvent<HTMLSelectElement>) => { setPageSize(Number(event.target.value)) }}>
                    {[10, 25, 50, 100].map((size, i) => (
                        <option
                            value={size}
                            key={i}>
                            {`${messages.select} ${size}`}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    )
}

export default Datatable
