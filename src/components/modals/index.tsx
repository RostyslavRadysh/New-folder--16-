import React, { FunctionComponent } from 'react'
import type { PropsWithChildren } from 'react'
import { XIcon } from '@heroicons/react/outline'
import Portal from '@/components/portals'

export interface ModalProps {
    title: string
    isOpen: boolean
    onClick: (value: boolean) => void
}

export const Modal: FunctionComponent<PropsWithChildren<ModalProps>> = ({ children, title, isOpen, onClick }: PropsWithChildren<ModalProps>) => isOpen ? (
    <Portal selector="#main">
        <div className="fixed z-40 flex bg-gray-500 opacity-50 w-full h-full top-0 left-0">
        </div>
        <div className="fixed flex flex-col z-50 p-4 bg-white border border-gray-100 rounded-lg dark:bg-gray-800 dark:border-gray-600 h-5/6 w-1/2 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="flex flex-row items-center justify-between pt-3 mb-6">
                <div className="text-lg text-left text-gray-900 dark:text-white">
                    {title}
                </div>
                <button
                    className="mx-4 outline-none cursor-pointer focus:outline-none flex-shrink-0"
                    onClick={() => onClick(!isOpen)}>
                    <XIcon className="w-12 h-12 text-gray-900 dark:text-white" />
                </button>
            </div>
            <div className="overflow-y-auto w-full h-full p-2">
                {children}
            </div>
        </div>
    </Portal>
) : null

export default Modal
