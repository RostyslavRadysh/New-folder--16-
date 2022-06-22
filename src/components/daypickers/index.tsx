import React, { FunctionComponent, useState, useEffect, useMemo } from 'react'
import { useForm } from '@/providers/formContextProvider'
import Dropdown from '@/components/dropdowns'
import { toFormatDate } from '@/utils/helpers'

export interface DayPickerProps {
    label?: string
    defaultValue?: Date
    placeholder?: string
    hint?: string
    errorMessage?: string
    disabled?: boolean
    required?: boolean
    weekdaysLong: string[]
    monthsLong: string[]
    onChange?: (value: Date | undefined) => void
}

export const DayPicker: FunctionComponent<DayPickerProps> = ({ label, defaultValue, placeholder, hint, errorMessage, disabled, required, weekdaysLong, monthsLong, onChange }: DayPickerProps) => {
    const { isFormDirty } = useForm()
    const [error, setError] = useState<boolean>(false)
    const [isDirty, setIsDirty] = useState<boolean>(isFormDirty)
    const [value, setValue] = useState<Date | undefined>(defaultValue)
    const [currentDate, setCurrentDate] = useState<{ value: Date }>(() => {
        const date = new Date()
        return { value: new Date(date.getFullYear(), date.getMonth(), 1) }
    })
    useEffect(() => {
        if (isFormDirty && !isDirty) setIsDirty(true)
    }, [isFormDirty])
    useEffect(() => {
        if (!disabled && isDirty) {
            switch (true) {
                case required && !value: {
                    setError(true)
                    if (onChange) onChange(undefined)
                    break
                }
                default: {
                    setError(false)
                    if (onChange) onChange(value)
                    break
                }
            }
        }
    }, [value, isDirty])
    const days = useMemo(() => {
        const year = currentDate.value.getFullYear()
        const month = currentDate.value.getMonth()
        const daysInMonth = [31, ((((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0)) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month] ?? 0
        const startDay = currentDate.value.getDay() === 0 ? 6 : currentDate.value.getDay() - 1
        return [
            [1, 2, 3, 4, 5, 6, 7].map(x => x - startDay > 0 && x - startDay < daysInMonth + 1 ? x - startDay : 0),
            [8, 9, 10, 11, 12, 13, 14].map(x => x - startDay > 0 && x - startDay < daysInMonth + 1 ? x - startDay : 0),
            [15, 16, 17, 18, 19, 20, 21].map(x => x - startDay > 0 && x - startDay < daysInMonth + 1 ? x - startDay : 0),
            [22, 23, 24, 25, 26, 27, 28].map(x => x - startDay > 0 && x - startDay < daysInMonth + 1 ? x - startDay : 0),
            [29, 30, 31, 32, 33, 34, 35].map(x => x - startDay > 0 && x - startDay < daysInMonth + 1 ? x - startDay : 0),
            [36, 37, 38, 39, 40, 41, 42].map(x => x - startDay > 0 && x - startDay < daysInMonth + 1 ? x - startDay : 0)
        ]
    }, [currentDate])

    return (
        <div className="flex flex-col">
            {label && (
                <label className="mb-2 text-sm text-gray-900 dark:text-white">{label}</label>
            )}
            <Dropdown
                disabled={disabled}
                button={(
                    <div className={`${error ? 'border border-red-500' : 'border border-gray-500'} ${disabled ? 'cursor-not-allowed text-gray-500 bg-gray-100 dark:bg-gray-700' : value ? 'text-gray-900 dark:text-white bg-white dark:bg-gray-800' : 'text-gray-500 text-opacity-50 bg-white dark:bg-gray-800'} p-2 text-sm whitespace-nowrap overflow-hidden`}>
                        {value ? toFormatDate(value) : placeholder}
                    </div>
                )}
                position="left"
                onClick={() => setIsDirty(true)}>
                <div className="bg-white shadow-md border border-gray-100 dark:bg-gray-800 dark:border-gray-600 p-2">
                    <div className="flex flex-row items-center justify-between h-10">
                        <div
                            className="cursor-pointer text-gray-900 text-sm dark:text-white"
                            onClick={() => {
                                currentDate.value.setMonth(currentDate.value.getMonth() - 1)
                                setCurrentDate({ ...{ value: currentDate.value } })
                            }}>
                            {'<'}
                        </div>
                        <div className="text-gray-900 text-xs uppercase font-bold tracking-wider dark:text-white">
                            {`${monthsLong[currentDate.value.getMonth()]} ${currentDate.value.getFullYear()}`}
                        </div>
                        <div
                            className="cursor-pointer text-gray-900 text-sm dark:text-white"
                            onClick={() => {
                                currentDate.value.setMonth(currentDate.value.getMonth() + 1)
                                setCurrentDate({ ...{ value: currentDate.value } })
                            }}>
                            {'>'}
                        </div>
                    </div>
                    <table className="w-full table-auto">
                        <thead>
                            <tr>
                                {weekdaysLong.map((x, i) => (
                                    <td
                                        className="text-center text-xs uppercase font-bold tracking-wider text-gray-900 dark:text-white"
                                        key={i}>
                                        {x[0]}
                                    </td>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {days.map((x, i) => {
                                return (
                                    <tr key={i}>
                                        {x.map((y, j) => (
                                            <td
                                                className={`${y !== 0 ? 'cursor-pointer text-center text-sm text-gray-900 dark:text-white' : ''}`}
                                                key={j}
                                                onBlur={() => setIsDirty(true)}
                                                onClick={() => { if (y !== 0) setValue(new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), y)) }}>
                                                {y !== 0 ? y : ''}
                                            </td>
                                        ))}
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </Dropdown>
            {hint && (
                <div className="mt-1 text-sm text-gray-500">{hint}</div>
            )}
            {error && (
                <div className={`${hint ? 'mt-0' : 'mt-1'} text-xs text-red-500`}>{errorMessage}</div>
            )}
        </div>
    )
}

export default DayPicker
