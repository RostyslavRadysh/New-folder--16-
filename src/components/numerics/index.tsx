import React, { FunctionComponent, useState, useEffect } from 'react'
import { useForm } from '@/providers/formContextProvider'

const autoCompletes = ['on', 'off'] as const
export type AutoCompleteType = typeof autoCompletes[number]

export interface NumericProps {
    label?: string
    defaultValue?: number | string
    placeholder?: string
    hint?: string
    errorMessage?: string
    allowNegative?: boolean
    allowDouble?: boolean
    autoComplete?: AutoCompleteType
    disabled?: boolean
    required?: boolean
    onChange?: (value: number | undefined) => void
}

export const Numeric: FunctionComponent<NumericProps> = ({ label, defaultValue, placeholder, hint, errorMessage, allowNegative, allowDouble, autoComplete, disabled, required, onChange }: NumericProps) => {
    const { isFormDirty } = useForm()
    const [error, setError] = useState<boolean>(false)
    const [isDirty, setIsDirty] = useState<boolean>(isFormDirty)
    const [value, setValue] = useState<string>(!defaultValue ? '' : String(defaultValue))
    const regExp = RegExp(`^${allowNegative ? '(-)?': ''}([0-9]*)${allowDouble ? '(\\.)?([0-9]{0,2})?': ''}$`)
    useEffect(() => {
        if (isFormDirty && !isDirty) setIsDirty(true)
    }, [isFormDirty])
    useEffect(() => {
        if (!disabled && isDirty) {
            const regExpError = RegExp(`^${allowNegative ? '(-)?': ''}([0-9]*)${allowDouble ? '(\\.)?([0-9]{0})?': ''}$`)
            switch (true) {
                case required && value.length === 0:
                case regExpError.test(value): {
                    setError(true)
                    if (onChange) onChange(undefined)
                    break
                }
                default: {
                    setError(false)
                    if (onChange) onChange(Number(value))
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
                value={value}
                placeholder={placeholder}
                autoComplete={autoComplete}
                disabled={disabled}
                onBlur={() => setIsDirty(true)}
                onChange={event => { if (regExp.test(event.currentTarget.value)) setValue(event.currentTarget.value) }} />
            {hint && (
                <div className="mt-1 text-sm text-gray-500">{hint}</div>
            )}
            {error && (
                <div className={`${hint ? 'mt-0' : 'mt-1'} text-xs text-red-500`}>{errorMessage}</div>
            )}
        </div>
    )
}

Numeric.defaultProps = {
    allowNegative: true,
    allowDouble: true,
    autoComplete: 'off'
}

export default Numeric
