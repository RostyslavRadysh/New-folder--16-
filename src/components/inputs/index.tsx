import React, { FunctionComponent, useEffect, useState } from 'react'
import { useForm } from '@/providers/formContextProvider'

const inputs = ['text', 'email', 'password'] as const
export type InputType = typeof inputs[number]

const autoCompletes = ['on', 'off'] as const
export type AutoCompleteType = typeof autoCompletes[number]

export interface InputProps {
    type?: InputType
    label?: string
    defaultValue?: string
    placeholder?: string
    hint?: string
    errorMessage?: string
    autoComplete?: AutoCompleteType
    disabled?: boolean
    required?: boolean
    minLength?: number
    maxLength?: number
    onChange?: (value: string | undefined) => void
}

export const Input: FunctionComponent<InputProps> = ({ type, label, defaultValue, placeholder, hint, errorMessage, autoComplete, disabled, required, minLength, maxLength, onChange }: InputProps) => {
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
                case minLength && value.length < minLength:
                case maxLength && value.length > maxLength: {
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
            <input
                className={`${error ? 'border-red-500' : 'border-gray-500'} p-2 text-sm disabled:text-gray-500 dark:disabled:text-gray-500 text-gray-900 placeholder-gray-500 placeholder-opacity-50 border outline-none focus:outline-none bg-white dark:bg-gray-800 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed`}
                type={type}
                value={value}
                placeholder={placeholder}
                minLength={minLength}
                maxLength={maxLength}
                autoComplete={autoComplete}
                disabled={disabled}
                onBlur={() => setIsDirty(true)}
                onChange={event => setValue(event.currentTarget.value)} />
            {hint && (
                <div className="mt-1 text-sm text-gray-500">{hint}</div>
            )}
            {error && (
                <div className={`${hint ? 'mt-0' : 'mt-1'} text-xs text-red-500`}>{errorMessage}</div>
            )}
        </div>
    )
}

Input.defaultProps = {
    type: "text",
    autoComplete: 'off'
}

export default Input
