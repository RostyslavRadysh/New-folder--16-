import React from 'react'
import { UserProvider } from '@auth0/nextjs-auth0'
import { Provider } from 'react-redux'
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import ToastContextProvider from '@/providers/toastContextProvider'
import store from '@/utils/store'
import '@/styles/tailwind.css'

function WebApplication({ Component, pageProps }: AppProps) {
    const { user } = pageProps;

    return (
        <UserProvider user={user} loginUrl="/api/auth/login" profileUrl="/api/auth/me">
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistStore(store)}>
                    <ToastContextProvider>
                        <Head>
                            <title>OSBB.LIFE</title>
                            <meta property="og:title" content="OSBB.LIFE" key="title" />
                            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
                        </Head>
                        <Component {...pageProps} />
                    </ToastContextProvider>
                </PersistGate>
            </Provider>
        </UserProvider>
    )
}

export default WebApplication
