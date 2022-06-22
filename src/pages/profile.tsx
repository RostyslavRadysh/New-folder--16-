import React, { FunctionComponent, useState } from 'react'
import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import useTranslation from 'next-translate/useTranslation'
import { useToast } from '@/providers/toastContextProvider'
import FormContextProvider from '@/providers/formContextProvider'
import MainLayout from '@/layouts/mains'
import Background from '@/components/backgrounds'
import Tab from '@/components/tabs'
import Input from '@/components/inputs'
import DayPicker from '@/components/daypickers'
import Textarea from '@/components/textareas'
import Button from '@/components/buttons'
import Community from '@/models/community'
import communitiesJson from '@/jsons/communities.json'

const Index = () => {
    const { t } = useTranslation()
    const { notify } = useToast()

    const [communities, setCommunities] = useState<Community[]>(() => Object.values(JSON.parse(JSON.stringify(communitiesJson))) as Community[])
    
    const updateCommuity = (contactUs: string | undefined) => {
        const item = communities[0]
        if (item) {
            item.contactUs = contactUs
            setCommunities([...communities])
            notify(t('polls:toastUpdate'))
        }
    }

    const items = [
        {
            title: t('profile:tabProfileSettings'), content: (
                <div className="w-full p-4 lg:w-1/2">
                    <CommunitySettings
                        communities={communities}
                        invoke={updateCommuity} />
                </div>
            )
        },
        {
            title: t('profile:tabEmailSettings'), content: (
                <div className="w-full p-4 lg:w-1/2">
                    <EmailSettings />
                </div>
            )
        },
        {
            title: t('profile:tabSecuritySettings'), content: (
                <div className="w-full p-4 lg:w-1/2">
                    <SecuritySettings />
                </div>
            )
        }
    ]

    return (
        <MainLayout>
            <Background>
                <div className="px-4 pt-4 pb-8">
                    <Tab items={items} />
                </div>
            </Background>
        </MainLayout>
    )
}

interface VoteCommunityProps {
    communities: Community[]
    invoke: (contractUs: string | undefined) => void
}

export const CommunitySettings: FunctionComponent<VoteCommunityProps> = ({ communities, invoke }: VoteCommunityProps) => {
    const { t } = useTranslation()

    const [legalName] = useState<string>(() => communities[0]?.legalName ?? '')
    const [legalCode] = useState<string>(() => communities[0]?.legalCode ?? '')
    const [legalAddress] = useState<string>(() => communities[0]?.legalAddress ?? '')
    const [found] = useState<Date | undefined>(() => communities[0] ? new Date(communities[0].found) : undefined)
    const [contactUs, setContactUs] = useState<string | undefined>(() => communities[0]?.contactUs)
    const onSubmit = () => {
        invoke(contactUs)
    }

    return (
        <FormContextProvider onSubmit={onSubmit}>
            <Input
                label={t('profile:communityLegalName')}
                defaultValue={legalName}
                disabled />
            <Input
                label={t('profile:communityLegalCode')}
                defaultValue={legalCode}
                disabled />
            <Input
                label={t('profile:communityLegalAddress')}
                defaultValue={legalAddress}
                disabled />
            <DayPicker
                label={t('profile:communityFound')}
                defaultValue={found}
                disabled
                weekdaysLong={[
                    t('calendar:monday'),
                    t('calendar:tuesday'),
                    t('calendar:wednesday'),
                    t('calendar:thursday'),
                    t('calendar:friday'),
                    t('calendar:saturday'),
                    t('calendar:sunday')
                ]}
                monthsLong={[
                    t('calendar:january'),
                    t('calendar:february'),
                    t('calendar:march'),
                    t('calendar:april'),
                    t('calendar:may'),
                    t('calendar:june'),
                    t('calendar:july'),
                    t('calendar:august'),
                    t('calendar:september'),
                    t('calendar:october'),
                    t('calendar:november'),
                    t('calendar:december')
                ]} />
            <Textarea
                label={t('profile:communityContactUs')}
                defaultValue={contactUs}
                placeholder={t('profile:communityContactUsPlaceholder')}
                minLength={0}
                maxLength={512}
                onChange={(value: string | undefined) => setContactUs(value)} />
            <Button
                title={t('profile:buttonUpdate')}
                type="submit"
                rounded />
        </FormContextProvider>
    )
}

export const EmailSettings: FunctionComponent = () => {
    const { t } = useTranslation()
    const { notify } = useToast()

    const [email, setEmail] = useState<string | undefined>(() => 'example@gmail.com')
    const onSubmit = () => {
        if (email) {
            notify(t('profile:toastUpdate'))
        }
    }

    return (
        <FormContextProvider onSubmit={onSubmit}>
            <Input
                type="email"
                label={t('profile:email')}
                defaultValue={email}
                placeholder={t('profile:emailPlaceholder')}
                errorMessage={t('profile:emailErrorMessage')}
                required
                minLength={5}
                maxLength={128}
                onChange={(value: string | undefined) => setEmail(value)} />
            <Button
                title={t('profile:buttonUpdate')}
                type="submit"
                rounded />
        </FormContextProvider>
    )
}

export const SecuritySettings: FunctionComponent = () => {
    const { t } = useTranslation()
    const { notify } = useToast()

    const [password, setPassword] = useState<string | undefined>(() => undefined)
    const onSubmit = () => {
        if (password) {
            notify(t('profile:toastUpdate'))
        }
    }

    return (
        <FormContextProvider onSubmit={onSubmit}>
            <Input
                type="password"
                label={t('profile:password')}
                defaultValue={password}
                placeholder={t('profile:passwordPlaceholder')}
                errorMessage={t('profile:passwordErrorMessage')}
                autoComplete="on"
                required
                minLength={8}
                maxLength={128}
                onChange={(value: string | undefined) => setPassword(value)} />
            <Button
                title={t('profile:buttonUpdate')}
                type="submit"
                rounded />
        </FormContextProvider>
    )
}

export default Index

export const getServerSideProps = withPageAuthRequired()
