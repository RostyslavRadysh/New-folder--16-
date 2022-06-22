import React, { ReactNode, FunctionComponent } from 'react'
import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import useTranslation from 'next-translate/useTranslation'
import {
    CogIcon,
    PaperAirplaneIcon,
    ClockIcon,
    PhoneIcon,
    MailIcon
} from '@heroicons/react/outline'
import MainLayout from '@/layouts/mains'
import Background from '@/components/backgrounds'
import { Question } from '@/components/questions'

const Index = () => {
    const { t } = useTranslation()

    const features = [
        { title: t('help:featureFaqTitle'), description: t('help:featureFaqDescription'), icon: <CogIcon className="w-12 h-12 text-blue-500" /> },
        { title: t('help:featureSupportTitle'), description: t('help:featureSupportDescription'), icon: <PaperAirplaneIcon className="w-12 h-12 text-blue-500" /> },
        { title: t('help:featureIdeaTitle'), description: t('help:featureIdeaDescription'), icon: <ClockIcon className="w-12 h-12 text-blue-500" /> }
    ]
    const questions = [
        { question: t('help:question1'), answer: (<div className="text-sm text-gray-900 dark:text-white">{t('help:answer1')}</div>) },
        { question: t('help:question2'), answer: (<div className="text-sm text-gray-900 dark:text-white">{t('help:answer2')}</div>) },
        { question: t('help:question3'), answer: (<div className="text-sm text-gray-900 dark:text-white">{t('help:answer3')}</div>) },
        { question: t('help:question4'), answer: (<div className="text-sm text-gray-900 dark:text-white">{t('help:answer4')}</div>) },
        { question: t('help:question5'), answer: (<div className="text-sm text-gray-900 dark:text-white">{t('help:answer5')}</div>) },
        { question: t('help:question6'), answer: (<div className="text-sm text-gray-900 dark:text-white">{t('help:answer6')}</div>) },
        { question: t('help:question7'), answer: (<div className="text-sm text-gray-900 dark:text-white">{t('help:answer7')}</div>) },
        { question: t('help:question8'), answer: (<div className="text-sm text-gray-900 dark:text-white">{t('help:answer8')}</div>) },
        { question: t('help:question9'), answer: (<div className="text-sm text-gray-900 dark:text-white">{t('help:answer9')}</div>) },
        { question: t('help:question10'), answer: (<div className="text-sm text-gray-900 dark:text-white">{t('help:answer10')}</div>) },
        { question: t('help:question11'), answer: (<div className="text-sm text-gray-900 dark:text-white">{t('help:answer11')}</div>) },
        { question: t('help:question12'), answer: (<div className="text-sm text-gray-900 dark:text-white">{t('help:answer12')}</div>) }
    ]
    const widgets = [
        { title: t('help:widgetEmailTitle'), description: "info@osbb.life", icon: <MailIcon className="w-12 h-12 text-blue-500" /> },
        { title: t('help:widgetPhoneNumberTitle'), description: "+380969004466", icon: <PhoneIcon className="w-12 h-12 text-blue-500" /> }
    ]

    return (
        <MainLayout>
            <Background>
                <div className="px-4 py-8 space-y-8">
                    <Title title={t('help:pageTitle')} />
                    <div className="flex flex-wrap items-center justify-center py-8 space-y-8 lg:space-y-0">
                        {features.map((feature, key) => {
                            return (
                                <div
                                    className="w-full lg:w-1/3"
                                    key={key}>
                                    <Feature {...feature} />
                                </div>
                            )
                        })}
                    </div>
                    <Title
                        title={t('help:articleTitle')}
                        description={t('help:articleDescription')} />
                    <div className="w-full">
                        {questions.map((question, i) => (
                            <Question
                                {...question}
                                key={i} />
                        ))}
                    </div>
                    <div className="flex flex-col px-6 py-3 bg-blue-500">
                        <div className="text-lg text-white">{t('help:callToActionTitle')}</div>
                        <div className="text-sm text-white">{t('help:callToActionDescription')}</div>
                    </div>
                    <div className="flex flex-wrap items-center justify-center space-y-8 lg:space-y-0">
                        {widgets.map((widget, i) => {
                            return (
                                <div
                                    className="w-full lg:w-1/2"
                                    key={i}>
                                    <Widget {...widget} />
                                </div>
                            )
                        })}
                    </div>
                </div>
            </Background>
        </MainLayout>
    )
}

export interface TitleProps {
    title: string
    description?: string
}

export const Title: FunctionComponent<TitleProps> = ({ title, description }: TitleProps) => (
    <div className="flex flex-col items-center justify-center space-y-2">
        <div className="text-lg text-center text-gray-900 dark:text-white">{title}</div>
        <p className="text-sm text-center text-gray-500 text-md">{description}</p>
    </div>
)

export interface FeatureProps {
    title: string
    description: string
    icon: ReactNode
}

export const Feature: FunctionComponent<FeatureProps> = ({ title, description, icon }: FeatureProps) => (
    <div className="flex flex-col items-center justify-center space-y-2">
        <div className="flex-shrink-0">{icon}</div>
        <div className="text-lg text-center text-gray-900 dark:text-white">{title}</div>
        <p className="max-w-sm text-sm text-center text-gray-500 text-md">{description}</p>
    </div>
)

export interface WidgetProps {
    title: string
    description: string
    icon: ReactNode
}

export const Widget: FunctionComponent<WidgetProps> = ({ title, description, icon }: WidgetProps) => {
    return (
        <div className="flex flex-row items-center justify-start space-x-8">
            <div className="flex-shrink-0">{icon}</div>
            <div className="flex flex-col">
                <div className="text-lg font-bold tracking-wider text-gray-900 dark:text-white">{title}</div>
                <p className="text-gray-900 text-md dark:text-white">{description}</p>
            </div>
        </div>
    )
}

export default Index

export const getServerSideProps = withPageAuthRequired()
