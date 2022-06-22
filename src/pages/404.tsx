import React from 'react'
import Link from 'next/link'
import useTranslation from 'next-translate/useTranslation'

const Index = () => {
    const { t } = useTranslation()

    return (
        <div className="flex items-center justify-center w-full h-screen bg-gray-50 p-4">
            <div className="flex flex-col max-w-xl text-center">
                <div className="w-auto h-64 mb-32">
                    <img src="./images/illustration.svg" />
                </div>
                <h1 className="mb-4 text-6xl text-blue-500">404</h1>
                <div className="mb-8 text-center text-gray-900 dark:text-white">
                    {t('error:title')}
                </div>
                <Link href="/">
                    <a className="flex items-center justify-center h-12 font-bold tracking-wider text-white uppercase bg-blue-500 rounded-lg hover:bg-blue-600">
                        {t('error:linkTitle')}
                    </a>
                </Link>
            </div>
        </div>
    )
}

export default Index

