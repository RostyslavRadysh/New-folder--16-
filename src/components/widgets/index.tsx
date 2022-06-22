import React, { ReactNode, FunctionComponent } from 'react'

interface WidgetProps {
    title: string
    description: number
    icon: ReactNode
}

const Widget: FunctionComponent<WidgetProps> = ({ title, description, icon }: WidgetProps) => (
    <div className="w-full p-4 bg-white border border-gray-100 rounded-lg dark:bg-gray-800 dark:border-gray-600">
        <div className="flex flex-row items-center justify-between">
            <div className="flex flex-col">
                <span className="text-xs font-light tracking-wide text-gray-500 uppercase">
                    {title}
                </span>
                <span className="text-lg font-bold tracking-wider text-gray-900 uppercase dark:text-white">
                    {description}
                </span>
            </div>
            <div className="flex-shrink-0">{icon}</div>
        </div>
    </div>
)

export default Widget
