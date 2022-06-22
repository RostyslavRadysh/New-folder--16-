import React, { FunctionComponent } from 'react'
import type { PropsWithChildren } from 'react'

interface BackgroundProps {
    title?: string
}

const Background: FunctionComponent<PropsWithChildren<BackgroundProps>> = ({ children, title }: PropsWithChildren<BackgroundProps>) => (
    <div className="p-4 bg-white border border-gray-100 rounded-lg dark:bg-gray-800 dark:border-gray-600">
        {title && (
            <div className="mb-2 text-sm text-gray-500">{title}</div>
        )}
        {children}
    </div>
)

export default Background
