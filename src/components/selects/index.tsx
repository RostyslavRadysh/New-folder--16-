import React, { FunctionComponent, useState, useEffect } from 'react'
import { useForm } from '@/providers/formContextProvider'
import Dropdown from '@/components/dropdowns'

export interface SelectProps {
    label: string
    defaultValue?: string
    hint?: string
    errorMessage?: string
    disabled?: boolean
    required?: boolean
    options: {
        label: string
        value: string
        disabled?: boolean
    }[]
    onChange?: (value: string | undefined) => void
}

export const Select: FunctionComponent<SelectProps> = ({ label, defaultValue, hint, errorMessage, disabled, required, options, onChange }: SelectProps) => {
    const { isFormDirty } = useForm()
    const [error, setError] = useState<boolean>(false)
    const [isDirty, setIsDirty] = useState<boolean>(isFormDirty)
    const [value, setValue] = useState<string>(defaultValue ?? '')
    useEffect(() => {
        if (isFormDirty && !isDirty) setIsDirty(true)
    }, [isFormDirty])
    useEffect(() => {
        if (!disabled && isDirty) {
            switch (true) {
                case required && value.length === 0:
                case options.find(x => x.value === value)?.disabled: {
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

    return (
        <div className="flex flex-col">
            {label && (
                <label className="mb-2 text-sm text-gray-900 dark:text-white">{label}</label>
            )}
            <Dropdown
                disabled={disabled}
                button={(
                    <div className={`${error ? 'border border-red-500' : 'border border-gray-500'} ${disabled ? 'cursor-not-allowed text-gray-500 bg-gray-100 dark:bg-gray-700' : value !== "none" ? 'text-gray-900 dark:text-white bg-white dark:bg-gray-800' : 'text-gray-500 text-opacity-50 bg-white dark:bg-gray-800'} p-2 text-sm whitespace-nowrap overflow-hidden`}>
                        {options.find(x => x.value === value)?.label}
                    </div>
                )}
                position="left"
                width="w-auto"
                onClick={() => setIsDirty(true)}>
                <div className="bg-white shadow-md border border-gray-100 dark:bg-gray-800 dark:border-gray-600">
                    <ul className="list-none">
                        {options.map((x, i) => (
                            <li key={i}>
                                <div
                                    className={`${x.disabled ? 'cursor-not-allowed text-gray-500 bg-gray-100 dark:bg-gray-700' : 'hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer text-gray-900 dark:text-white'} flex flex-row items-center h-10 px-2 outline-none appearance-none focus:outline-none text-sm`}
                                    onClick={() => { if (!x.disabled) setValue(x.value) }}>
                                    {x.label}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </Dropdown>
            {hint && (
                <div className="mt-1 text-xs text-gray-500">{hint}</div>
            )}
            {error && (
                <div className={`${hint ? 'mt-0' : 'mt-1'} text-xs text-red-500`}>{errorMessage}</div>
            )}
        </div>
    )
}

export default Select
