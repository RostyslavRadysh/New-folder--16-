import React, { ReactNode, FunctionComponent } from 'react'
import { Search } from '@/components/searchers'
import { Question } from '@/components/questions'

export interface ProductsProps {
    products: {
        question: string
        answer: ReactNode
    }[]
    messages: {
        noDataFound: string
    }
    searchOptions: {
        placeholder: string
        onChange: (value: string) => void
    }
    sortByOptions: {
        title: string
        value: string
    }[]
    onSortByChange: (value: string) => void
}

const Products: FunctionComponent<ProductsProps> = ({ products, messages, searchOptions, sortByOptions, onSortByChange }: ProductsProps) => (
    <div className="flex flex-col">
        <div className="flex flex-row items-center justify-between space-x-2 mb-4">
            <div className="w-full max-w-xs">
                <Search
                    placeholder={searchOptions.placeholder}
                    onChange={searchOptions.onChange} />
            </div>
            <select
                className="p-2 text-sm text-gray-900 border border-gray-500 outline-none appearance-none focus:outline-none bg-white dark:bg-gray-800 dark:text-white"
                onClick={event => onSortByChange(event.currentTarget.value)}>
                {sortByOptions.map((item, i) => {
                    return (
                        <option
                            value={item.value}
                            key={i}>
                            {item.title}
                        </option>
                    )
                })}
            </select>
        </div>
        {!products.length ? (
            <div className="py-2 text-center text-sm text-gray-900 dark:text-white">
                {messages.noDataFound}
            </div>
        ) : (
            <div className="w-full">
                {products.map((product, index) => (
                    <Question
                        {...product}
                        key={index} />
                ))}
            </div>
        )}
    </div>
)

export default Products
