import React, { FunctionComponent, useState, useEffect, useMemo } from 'react'
import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import useTranslation from 'next-translate/useTranslation'
import { MenuAlt1Icon } from '@heroicons/react/outline'
import { toFormatDate, toLocalISOTime } from '@/utils/helpers'
import MainLayout from '@/layouts/mains'
import { useToast } from '@/providers/toastContextProvider'
import FormContextProvider from '@/providers/formContextProvider'
import Background from '@/components/backgrounds'
import Products from '@/components/products'
import List from '@/components/lists'
import Input from '@/components/inputs'
import Textarea from '@/components/textareas'
import Select from '@/components/selects'
import Button from '@/components/buttons'
import Publication from '@/models/publication'
import { useGetBuildingsQuery } from '@/slicers/apis/buildingApi'
import { useGetPublicationsQuery, useAddPublicationMutation } from '@/slicers/apis/publicationApi'

const Index = () => {
    const { t, lang } = useTranslation()

    const [hidden, setHidden] = useState<boolean>(false)
    const [search, setSearch] = useState<string>('')
    const [sort, setSort] = useState<string>('ascByTime')
    const { data: buildings = [] } = useGetBuildingsQuery()
    const { data: publications = [] } = useGetPublicationsQuery()

    useEffect(() => {
        switch (sort) {
            case 'ascByTime': {
                publications.sort((x, y) => new Date(y.time).getTime() - new Date(x.time).getTime())
                break
            }
            case 'descByTime': {
                publications.sort((x, y) => new Date(x.time).getTime() - new Date(y.time).getTime())
                break
            }
        }
    }, [sort])
    const data = useMemo<{ id: string, question: string, answer: JSX.Element }[]>(() => {
        const filteredData = search === '' ? publications : publications.filter(x => x.title.toLocaleLowerCase().indexOf(search.toLowerCase()) > -1)
        return filteredData.map(x => {
            return {
                id: x.id,
                question: x.title,
                answer: (() => {
                    const list = [
                        { title: t('publications:publicationBuilding'), content: <div className="text-sm text-gray-500">{buildings.find(y => y.id === x.buildingId)?.legalAddress}</div> },
                        { title: t('publications:publicationDescription'), content: <div className="text-sm text-gray-500">{x.description}</div> },
                        { title: t('publications:publicationTime'), content: <div className="text-sm text-gray-500">{toFormatDate(new Date(x.time))}</div> }
                    ]
                    return (
                        <List items={list} />
                    )
                })()
            }
        })
    }, [publications, search, lang])

    return (
        <MainLayout>
            <Background>
                <div className="flex flex-col px-4 py-8 space-x-0 space-y-7 lg:flex-row lg:space-x-7 lg:space-y-0">
                    <div className={`flex flex-col ${hidden ? 'lg:w-6' : 'lg:w-1/3'}`}>
                        <div className="flex flex-row items-center justify-between">
                            <div className={`${hidden ? 'hidden' : 'block'}`}>
                                <div className="text-xs font-light tracking-wide uppercase text-gray-500">{t('publications:publicationCreate')}</div>
                            </div>
                            <button
                                className="outline-none appearance-none cursor-pointer focus:outline-none flex-shrink-0"
                                onClick={() => setHidden(!hidden)}>
                                <MenuAlt1Icon className="w-6 h-6 text-gray-900 dark:text-white" />
                            </button>
                        </div>
                        <div className={`${hidden ? 'hidden' : 'block'}`}>
                            <CreatePublication />
                        </div>
                    </div>
                    <div className={`w-full ${hidden ? '' : 'lg:w-2/3'}`}>
                        <Products
                            products={data}
                            messages={{
                                noDataFound: t('publications:dataNotFound')
                            }}
                            searchOptions={{ placeholder: t('publications:searchPlaceholder'), onChange: (value: string) => setSearch(value) }}
                            sortByOptions={[
                                { title: t('publications:sortAscByTime'), value: 'ascByTime' },
                                { title: t('publications:sortDescByTime'), value: 'descByTime' }
                            ]}
                            onSortByChange={(value: string) => setSort(value)} />
                    </div>
                </div>
            </Background>
        </MainLayout>
    )
}

const CreatePublication: FunctionComponent = () => {
    const { t } = useTranslation()
    const { notify } = useToast()

    const { data: buildings = [] } = useGetBuildingsQuery()
    const [addPublication] = useAddPublicationMutation()

    const [buildingId, setBuildingId] = useState<string | undefined>(undefined)
    const [title, setTitle] = useState<string | undefined>(undefined)
    const [description, setDescription] = useState<string | undefined>(undefined)

    const onSubmit = () => {
        if (!buildingId || !title || !description) return
        const publication = {
            id: 'none',
            buildingId: buildingId,
            title: title,
            description: description,
            time: toLocalISOTime(new Date())
        } as Publication
        addPublication(publication)
        notify(t('publications:toastCreate'))
    }

    return (
        <FormContextProvider onSubmit={onSubmit}>
            <Select
                label={t('publications:publicationBuilding')}
                defaultValue={'none'}
                errorMessage={t('publications:publicationBuildingErrorMessage')}
                required
                options={[
                    { label: t('publications:publicationBuildingNone'), value: 'none', disabled: true },
                    ...buildings.map(x => { return { label: x.legalAddress, value: x.id } })
                ]}
                onChange={(value: string | undefined) => setBuildingId(value)} />
            <Input
                label={t('publications:publicationTitle')}
                defaultValue={title}
                placeholder={t('publications:publicationTitlePlaceholder')}
                errorMessage={t('publications:publicationTitleErrorMessage')}
                required
                minLength={1}
                maxLength={64}
                onChange={(value: string | undefined) => setTitle(value)} />
            <Textarea
                label={t('publications:publicationDescription')}
                defaultValue={description}
                placeholder={t('publications:publicationDescriptionPlaceholder')}
                errorMessage={t('publications:publicationDescriptionErrorMessage')}
                required
                minLength={1}
                maxLength={512}
                onChange={(value: string | undefined) => setDescription(value)} />
            <Button
                title={t('publications:publicationCreateButton')}
                type="submit"
                rounded />
        </FormContextProvider>
    )
}

export default Index

export const getServerSideProps = withPageAuthRequired()
