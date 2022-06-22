import React, { ReactNode, FunctionComponent } from 'react'

export interface ListProps {
    items: {
        title: string
        content: ReactNode
    }[]
}

export const List: FunctionComponent<ListProps> = ({ items }: ListProps) => (
    <div className="w-full">
        {items.map((item, i) => (
            <div
                className="flex flex-col my-2"
                key={i}>
                <div className="text-sm font-bold tracking-wider text-gray-900 dark:text-white">{item.title}</div>
                {item.content}
            </div>
        ))}
    </div>
)

export default List
