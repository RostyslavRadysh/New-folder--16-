import React, { ReactNode, FunctionComponent, useState } from 'react'

export interface TabProps {
    items: {
        title: string
        content: ReactNode
    }[]
}

export const Tab: FunctionComponent<TabProps> = ({ items }: TabProps) => {
    const [isOpen, setIsOpen] = useState<number>(0)
    return (
        <div className="flex flex-col">
            <div className="flex flex-col lg:flex-row lg:space-x-2">
                {items.map((item, i) => (
                    <div
                        className={`${isOpen === i ? 'border-b-2 border-blue-500' : 'border-b-2 hover:border-blue-500'} w-full`}
                        key={i}>
                        <button
                            className="p-4 w-full text-xs font-bold tracking-wider text-gray-900 uppercase dark:text-white"
                            type="button"
                            onClick={() => setIsOpen(i)}>
                            {item.title}
                        </button>
                    </div>
                ))}
            </div>
            <div className="p-4">
                {items[isOpen]?.content}
            </div>
        </div>
    )
}

export default Tab
