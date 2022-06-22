import React, { FunctionComponent, useState, useEffect, useMemo } from 'react'
import type { PropsWithChildren } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import useTranslation from 'next-translate/useTranslation'
import {
    BookOpenIcon,
    CreditCardIcon,
    OfficeBuildingIcon,
    KeyIcon,
    IdentificationIcon,
    ScissorsIcon,
    DocumentTextIcon,
    MailIcon,
    ChartBarIcon,
    MenuIcon,
    CogIcon,
    QuestionMarkCircleIcon,
    UserIcon,
    LogoutIcon
} from '@heroicons/react/outline'
import type PropsRedux from '@/utils/propsRedux'
import { connector } from '@/utils/propsRedux'
import Dropdown from '@/components/dropdowns'
import Switch from '@/components/switchers'
import Community from '@/models/community'
import communitiesJson from '@/jsons/communities.json'
export interface MainLayoutProps extends PropsRedux { }

export const MainLayout: FunctionComponent<PropsWithChildren<MainLayoutProps>> = ({ children, collapsed, palette, toggleCollapse, setPalette }: PropsWithChildren<MainLayoutProps>) => {
    const { t, lang } = useTranslation()

    const [communities] = useState<Community[]>(() => Object.values(JSON.parse(JSON.stringify(communitiesJson))) as Community[])

    useEffect(() => {
        document.cookie = `NEXT_LOCALE=${lang}`
    }, [lang])
    useEffect(() => {
        const root = window.document.documentElement
        root.classList.remove(palette === 'dark' ? 'light' : 'dark')
        root.classList.add(palette)
    }, [palette])

    const sidebarLinks = useMemo(() => [
        { url: '/', title: t('pages:index'), icon: <BookOpenIcon className="w-6 h-6" /> },
        { url: '/payments', title: t('pages:payments'), icon: <CreditCardIcon className="w-6 h-6" /> },
        { url: '/buildings', title: t('pages:buildings'), icon: <OfficeBuildingIcon className="w-6 h-6" /> },
        { url: '/apartments', title: t('pages:apartments'), icon: <KeyIcon className="w-6 h-6" /> },
        { url: '/employees', title: t('pages:employees'), icon: <IdentificationIcon className="w-6 h-6" /> },
        { url: '/tools', title: t('pages:tools'), icon: <ScissorsIcon className="w-6 h-6" /> },
        { url: '/contracts', title: t('pages:contracts'), icon: <DocumentTextIcon className="w-6 h-6" /> },
        { url: '/publications', title: t('pages:publications'), icon: <MailIcon className="w-6 h-6" /> },
        { url: '/polls', title: t('pages:polls'), icon: <ChartBarIcon className="w-6 h-6" /> }
    ], [lang])
    const localesLinks = useMemo(() => [
        { title: t('pages:ua'), flag: 'ua' },
        { title: t('pages:ru'), flag: 'ru' }
    ], [lang])
    const settingsLinks = useMemo(() => [
        { link: '/help', title: t('pages:help'), icon: <QuestionMarkCircleIcon className="w-6 h-6" /> },
        { link: '/profile', title: t('pages:profile'), icon: <UserIcon className="w-6 h-6" /> },
        { link: '/', title: t('pages:logout'), icon: <LogoutIcon className="w-6 h-6" /> }
    ], [lang])

    const router = useRouter()

    return (
        <div className="flex flex-row">
            <div className="relative">
                <div className={`${collapsed ? 'hidden lg:block' : 'block'} absolute z-20 h-full bg-white border-r border-gray-100 dark:bg-gray-800 lg:relative dark:border-gray-600`}>
                    <div className={`${collapsed ? 'w-16' : 'w-56'}`}>
                        <div className="relative flex flex-row items-center justify-center h-16">
                            <img className="w-6 h-6" src="./images/logo.svg" />
                            <button
                                className="absolute outline-none appearance-none cursor-pointer flex-shrink-0 lg:hidden right-4 focus:outline-none"
                                type="button"
                                onClick={() => toggleCollapse()}>
                                <MenuIcon className="w-6 h-6 text-gray-900 dark:text-white" />
                            </button>
                        </div>
                        <ul className="list-none">
                            {sidebarLinks.map((link, key) => (
                                <li key={key}>
                                    <Link href={link.url}>
                                        <a className={`${router.pathname === link.url ? 'text-blue-500' : 'text-gray-900 dark:text-white hover:text-blue-500 dark:hover:text-blue-500'} relative flex flex-row items-center justify-start h-10 outline-none appearance-none cursor-pointer focus:outline-none`}>
                                            {router.pathname === link.url && (
                                                <div className="absolute left-0 w-1 h-full bg-blue-500" />
                                            )}
                                            <div className="flex-shrink-0 flex flex-row justify-center w-16">{link.icon}</div>
                                            {!collapsed && (
                                                <span className="text-sm">{link.title}</span>
                                            )}
                                        </a>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
            <div className="w-full">
                <div className="border-b border-gray-100 dark:border-gray-600">
                    <div className="flex flex-row justify-between h-12 px-4 bg-white dark:bg-gray-800">
                        <button
                            className="outline-none appearance-none cursor-pointer focus:outline-none"
                            type="button"
                            onClick={() => toggleCollapse()}>
                            <div className="flex-shrink-0">
                                <MenuIcon className="w-6 h-6 text-gray-900 dark:text-white" />
                            </div>
                        </button>
                        <div className="flex flex-row space-x-4">
                            <Dropdown button={<img className="w-5 h-5" src={`./images/flags/${lang}.svg`} />}>
                                <div className="flex flex-wrap bg-white shadow-md dark:bg-gray-800">
                                    {localesLinks.map((link, key) => (
                                        <Link
                                            href={router.pathname}
                                            locale={link.flag}
                                            key={key}>
                                            <a className="flex flex-row items-center justify-start w-1/2 h-10 px-2 space-x-2 outline-none appearance-none cursor-pointer focus:outline-none hover:bg-gray-50 dark:hover:bg-gray-600">
                                                <img className="w-5 h-5" src={`./images/flags/${link.flag}.svg`} />
                                                <span className="text-sm text-gray-900 dark:text-white">{link.title}</span>
                                            </a>
                                        </Link>
                                    ))}
                                </div>
                            </Dropdown>
                            <Dropdown button={(
                                <div className="flex-shrink-0">
                                    <CogIcon className="w-6 h-6 text-gray-900 dark:text-white" />
                                </div>
                            )}>
                                <div className="flex flex-col bg-white shadow-md dark:bg-gray-800">
                                    <ul className="list-none">
                                        {settingsLinks.map((link, key) => (
                                            <li key={key}>
                                                <Link href={link.link}>
                                                    <a className="flex flex-row items-center justify-start h-10 px-2 space-x-2 text-gray-900 outline-none appearance-none cursor-pointer dark:text-white focus:outline-none hover:bg-gray-50 dark:hover:bg-gray-600">
                                                        <div className="flex-shrink-0">
                                                            {link.icon}
                                                        </div>
                                                        <span className="text-sm">{link.title}</span>
                                                    </a>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </Dropdown>
                            <Switch checked={(palette === 'dark')} onChange={() => setPalette(palette === 'dark' ? 'light' : 'dark')} />
                        </div>
                    </div>
                </div>
                <div className="min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
                    <div className="pt-3 mb-6">
                        <span className="text-xs font-light tracking-wide text-gray-500 uppercase">{communities[0]?.legalName}</span>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default connector(MainLayout)
