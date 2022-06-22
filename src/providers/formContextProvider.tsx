import React, { FunctionComponent, useState, createContext, useContext } from 'react'
import type { PropsWithChildren } from 'react'

type FormContextType = {
    isFormDirty: boolean
}

const FormContext = createContext<FormContextType>({ isFormDirty: false })

const autoCompletes = ['on', 'off'] as const
export type AutoCompleteType = typeof autoCompletes[number]

export interface FormProps {
    autoComplete?: AutoCompleteType
    onSubmit: () => void
}

const FormContextProvider: FunctionComponent<PropsWithChildren<FormProps>> = ({ children, autoComplete, onSubmit }: PropsWithChildren<FormProps>) => {
    const [isFormDirty, setIsFormDirty] = useState<boolean>(false)

    return (
        <FormContext.Provider value={{ isFormDirty }}>
            <div className="w-full">
                <form
                    autoComplete={autoComplete}
                    onSubmit={event => {
                        event.preventDefault()
                        setIsFormDirty(true)
                        onSubmit()
                    }}>
                    <div className="space-y-4">
                        {children}
                    </div>
                </form>
            </div>
        </FormContext.Provider>
    )
}

FormContextProvider.defaultProps = {
    autoComplete: 'off'
}

export const useForm = () => useContext(FormContext)

export default FormContextProvider
