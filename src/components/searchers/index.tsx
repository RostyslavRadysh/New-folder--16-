import React, { FunctionComponent } from 'react'
import { SearchIcon } from '@heroicons/react/outline'

export interface SearchProps {
    placeholder?: string
    onChange: (value: string) => void
}

export const Search: FunctionComponent<SearchProps> = ({ placeholder, onChange }: SearchProps) => (
    <div className="relative">
        <input
            className="w-full h-10 pl-10 pr-5 text-sm text-gray-900 bg-gray-100 rounded-full outline-none appearance-none focus:outline-none dark:text-white dark:bg-gray-700"
            type="search"
            placeholder={placeholder}
            onChange={event => onChange(event.currentTarget.value)}
        />
        <button
            className="absolute top-0 left-0 w-10 h-10 pl-4 flex-shrink-0 rounded-full outline-none cursor-pointer focus:outline-none"
            type="button">
            <SearchIcon className="w-4 h-4 text-gray-900 dark:text-white" />
        </button>
    </div>

)

export default Search