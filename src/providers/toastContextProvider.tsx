import React, {
    FunctionComponent,
    useState,
    useEffect,
    createContext,
    useContext
} from 'react'
import type { PropsWithChildren } from 'react'
import { XIcon } from '@heroicons/react/outline'
import Portal from '@/components/portals'

type ToastContextType = {
    notify: (message: string) => void
}

const ToastContext = createContext<ToastContextType>({ notify: (message: string) => console.log(message) })

interface ToastContextProviderProps { }

const ToastContextProvider: FunctionComponent<PropsWithChildren<ToastContextProviderProps>> = ({ children }: PropsWithChildren<ToastContextProviderProps>) => {
    const [items, setData] = useState<string[]>([])
    useEffect(() => {
        if (items.length !== 0) {
            const timer = setTimeout(() => {
                items.pop()
                setData([...items])
            }, 3000)
            return () => clearTimeout(timer)
        }
        return
    }, [items])
    const notify = (message: string) => setData([...items, message])

    return (
        <ToastContext.Provider value={{ notify }}>
            <Portal selector="#main">
                <div className="fixed z-40 top-4 right-4">
                    <div className="flex flex-col w-56 space-y-2">
                        {items?.map((item, i) => (
                            <div
                                className="flex flex-row items-center justify-between p-4 shadow-md bg-blue-500"
                                key={i}>
                                <span className="text-sm text-white">{item}</span>
                                <button
                                    className="flex-shrink-0 outline-none appearance-none cursor-pointer focus:outline-none"
                                    onClick={() => setData(items.filter((x, j) => x && j !== i))}>
                                    <XIcon className="w-6 h-6 text-white" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </Portal>
            {children}
        </ToastContext.Provider>
    )
}

export const useToast = () => useContext(ToastContext)

export default ToastContextProvider
