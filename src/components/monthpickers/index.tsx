import React, { FunctionComponent, useState, useEffect, useMemo } from 'react'
import { useForm } from '@/providers/formContextProvider'
import Dropdown from '@/components/dropdowns'
import { toFormatMonth } from '@/utils/helpers'

export interface MonthPickerProps {
    label?: string
    defaultValue?: Date
    placeholder?: string
    hint?: string
    errorMessage?: string
    disabled?: boolean
    required?: boolean
    monthsLong: string[]
    onChange?: (value: Date | undefined) => void
}

export const MonthPicker: FunctionComponent<MonthPickerProps> = ({ label, defaultValue, placeholder, hint, errorMessage, disabled, required, monthsLong, onChange }: MonthPickerProps) => {
    const { isFormDirty } = useForm()
    const [error, setError] = useState<boolean>(false)
    const [isDirty, setIsDirty] = useState<boolean>(isFormDirty ?? false)
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
    const months = useMemo(() => {
        return [
            monthsLong.slice(0, 3),
            monthsLong.slice(3, 6),
            monthsLong.slice(6, 9),
            monthsLong.slice(9, 12)
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
                        {value ? toFormatMonth(value) : placeholder}
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
                            {`${currentDate.value.getFullYear()}`}
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
                        <tbody>
                            {months.map((x, i) => {
                                return (
                                    <tr key={i}>
                                        {x.map((y, j) => (
                                            <td
                                                className="cursor-pointer text-center text-sm text-gray-900 dark:text-white"
                                                key={j}
                                                onBlur={() => setIsDirty(true)}
                                                onClick={() => setValue(new Date(currentDate.value.getFullYear(), i === 0 ? j : (i * x.length) + j, 1))}>
                                                {y}
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

export default MonthPicker
