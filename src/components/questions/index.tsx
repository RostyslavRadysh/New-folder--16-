import React, { ReactNode, FunctionComponent, useState } from 'react'
import { ChevronRightIcon } from '@heroicons/react/outline'

export interface QuestionProps {
    question: string
    answer: ReactNode
}

export const Question: FunctionComponent<QuestionProps> = ({ question, answer }: QuestionProps) => {
    const [hidden, setHidden] = useState(true)

    return (
        <div className="flex flex-col px-2 py-3 border-t-2 border-gray-100 first:border-t-0 dark:border-gray-600">
            <button
                className="flex flex-row items-center justify-between text-gray-900"
                onClick={() => setHidden(!hidden)}>
                <div className="text-sm font-bold text-left text-gray-900 max-w-sm dark:text-white lg:max-w-none">{question}</div>
                <ChevronRightIcon className={`w-4 h-4 text-gray-900 dark:text-white transform ${hidden ? 'rotate-0' : 'rotate-90'}`} />
            </button>
            <div className={`w-full ${hidden ? 'hidden' : 'block'}`}>
                {answer}
            </div>
        </div>
    )
}

export default Question