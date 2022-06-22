import React, { FunctionComponent, useState } from 'react'
import type { PropsWithChildren } from 'react'

interface TooltipProps {
    content: string | undefined
}

const Tooltip: FunctionComponent<PropsWithChildren<TooltipProps>> = ({ children, content }: PropsWithChildren<TooltipProps>) => {
    const [hidden, setHidden] = useState<boolean>(true)
    return (
        <div
            className="relative flex flex-col items-center"
            onMouseEnter={() => setHidden(false)}
            onMouseLeave={() => setHidden(true)}>
            {children}
            {!hidden && content && (
                <div className="absolute z-10 w-32 bg-white border-gray-100 border dark:border-gray-600 rounded-lg shadow-md -top-10 dark:bg-gray-800">
                    <div className="py-2 text-sm text-center">
                        <span className="text-gray-900 dark:text-white">{content}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Tooltip
