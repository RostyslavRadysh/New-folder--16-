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
import Numeric from '@/components/numerics'
import DayPicker from '@/components/daypickers'
import Textarea from '@/components/textareas'
import Select from '@/components/selects'
import Button from '@/components/buttons'
import Modal from '@/components/modals'
import Tool from '@/models/tool'
import {
    useGetToolsQuery,
    useAddToolMutation,
    useUpdateToolMutation,
    useDeleteToolMutation
} from '@/slicers/apis/toolApi'

const Index = () => {
    const { t, lang } = useTranslation()

    const [hidden, setHidden] = useState<boolean>(false)
    const [search, setSearch] = useState<string>('')
    const [sort, setSort] = useState<string>('ascByTitle')
    const { data: tools = [] } = useGetToolsQuery()
    const [selectedUpdateTool, setSelectedUpdateTool] = useState<{ value: string | undefined }>()
    const [selectedDeleteTool, setSelectedDeleteTool] = useState<{ value: string | undefined }>()

    useEffect(() => {
        const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' })
        switch (sort) {
            case 'ascByTitle': {
                tools.sort((x, y) => collator.compare(x.title, y.title))
                break
            }
            case 'descByTitle': {
                tools.sort((x, y) => collator.compare(x.title, y.title))
                break
            }
        }
    }, [sort])
    const data = useMemo<{ id: string, question: string, answer: JSX.Element }[]>(() => {
        const filteredData = search === '' ? tools : tools.filter(x => x.title.toLowerCase().indexOf(search.toLowerCase()) > -1)
        return filteredData.map(x => {
            return {
                id: x.id,
                question: x.title,
                answer: (() => {
                    const currencyTypes = [
                        { label: t('tools:toolCurrencyUsd'), value: '0' },
                        { label: t('tools:toolCurrencyEur'), value: '1' },
                        { label: t('tools:toolCurrencyUah'), value: '2' },
                        { label: t('tools:toolCurrencyPln'), value: '3' }
                    ]
                    const list = [
                        { title: t('tools:toolToolNumber'), content: <div className="text-sm text-gray-500">{x.toolNumber}</div> },
                        { title: t('tools:toolTitle'), content: <div className="text-sm text-gray-500">{x.title}</div> },
                        { title: t('tools:toolCurrency'), content: <div className="text-sm text-gray-500">{currencyTypes.find(y => y.value === String(x.currency))?.label}</div> },
                        { title: t('tools:toolCost'), content: <div className="text-sm text-gray-500">{x.cost.toFixed(2)}</div> },
                        { title: t('tools:toolDateOfPurchase'), content: <div className="text-sm text-gray-500">{toFormatDate(new Date(x.dateOfPurchase))}</div> },
                        { title: t('tools:toolDateOfExpiry'), content: <div className="text-sm text-gray-500">{toFormatDate(new Date(x.dateOfExpiry))}</div> },
                        { title: t('tools:toolRemark'), content: <div className="text-sm text-gray-500">{x.remark ?? t('tools:toolRemarkNone')}</div> }
                    ]
                    return (
                        <div className="flex flex-col space-y-4">
                            <List items={list} />
                            <div className="flex flex-row items-center justify-start space-x-2">
                                <Button
                                    title={t('tools:toolUpdateButton')}
                                    type="button"
                                    rounded
                                    onClick={() => setSelectedUpdateTool({ ...{ value: x.id } })} />
                                <Button
                                    title={t('tools:toolDeleteButton')}
                                    type="button"
                                    color="red"
                                    rounded
                                    onClick={() => setSelectedDeleteTool({ ...{ value: x.id } })} />
                            </div>
                        </div>
                    )
                })()
            }
        })
    }, [tools, search, lang])

    return (
        <MainLayout>
            <Background>
                <div className="flex flex-col px-4 py-8 space-x-0 space-y-7 lg:flex-row lg:space-x-7 lg:space-y-0">
                    <div className={`flex flex-col ${hidden ? 'lg:w-6' : 'lg:w-1/3'}`}>
                        <div className="flex flex-row items-center justify-between">
                            <div className={`${hidden ? 'hidden' : 'block'}`}>
                                <div className="text-xs font-light tracking-wide uppercase text-gray-500">{t('tools:toolCreate')}</div>
                            </div>
                            <button
                                className="outline-none appearance-none cursor-pointer focus:outline-none flex-shrink-0"
                                onClick={() => setHidden(!hidden)}>
                                <MenuAlt1Icon className="w-6 h-6 text-gray-900 dark:text-white" />
                            </button>
                        </div>
                        <div className={`${hidden ? 'hidden' : 'block'}`}>
                            <CreateTool />
                        </div>
                    </div>
                    <div className={`w-full ${hidden ? '' : 'lg:w-2/3'}`}>
                        <Products
                            products={data}
                            messages={{
                                noDataFound: t('tools:dataNotFound')
                            }}
                            searchOptions={{ placeholder: t('tools:searchPlaceholder'), onChange: (value: string) => setSearch(value) }}
                            sortByOptions={[
                                { title: t('tools:sortAscByTitle'), value: 'ascByTitle' },
                                { title: t('tools:sortDescByTitle'), value: 'descByTitle' }
                            ]}
                            onSortByChange={(value: string) => setSort(value)} />
                    </div>
                </div>
                <UpdateTool selected={selectedUpdateTool} />
                <DeleteTool selected={selectedDeleteTool} />
            </Background>
        </MainLayout>
    )
}

const CreateTool: FunctionComponent = () => {
    const { t } = useTranslation()
    const { notify } = useToast()

    const [addTool] = useAddToolMutation()

    const [toolNumber, setToolNumber] = useState<string | undefined>(undefined)
    const [title, setTitle] = useState<string | undefined>(undefined)
    const [currency, setCurrency] = useState<string | undefined>(undefined)
    const [cost, setCost] = useState<number | undefined>(undefined)
    const [dateOfPurchase, setDateOfPurchase] = useState<Date | undefined>(undefined)
    const [dateOfExpiry, setDateOfExpiry] = useState<Date | undefined>(undefined)
    const [remark, setRemark] = useState<string | undefined>(undefined)

    const onSubmit = () => {
        if (toolNumber || title || currency || cost || dateOfPurchase || dateOfExpiry) return
        const tool = {
            id: 'none',
            toolNumber: toolNumber,
            currency: Number(currency),
            title: title,
            cost: cost,
            dateOfPurchase: toLocalISOTime(dateOfPurchase ?? new Date()),
            dateOfExpiry: toLocalISOTime(dateOfExpiry ?? new Date()),
            remark: remark
        } as Tool
        addTool(tool)
        notify(t('tools:toastCreate'))
    }

    return (
        <FormContextProvider onSubmit={onSubmit}>
            <Input
                label={t('tools:toolToolNumber')}
                placeholder={t('tools:toolToolNumberPlaceholder')}
                errorMessage={t('tools:toolToolNumberErrorMessage')}
                required
                minLength={1}
                maxLength={32}
                onChange={(value: string | undefined) => setToolNumber(value)} />
            <Input
                label={t('tools:toolTitle')}
                placeholder={t('tools:toolTitlePlaceholder')}
                errorMessage={t('tools:toolTitleErrorMessage')}
                required
                minLength={1}
                maxLength={64}
                onChange={(value: string | undefined) => setTitle(value)} />
            <Select
                label={t('tools:toolCurrency')}
                required
                errorMessage={t('tools:toolCurrencyErrorMessage')}
                defaultValue={'none'}
                options={[
                    { label: t('tools:toolCurrencyNone'), value: 'none', disabled: true },
                    { label: t('tools:toolCurrencyUsd'), value: '0' },
                    { label: t('tools:toolCurrencyEur'), value: '1' },
                    { label: t('tools:toolCurrencyUah'), value: '2' },
                    { label: t('tools:toolCurrencyPln'), value: '3' }
                ]}
                onChange={(value: string | undefined) => setCurrency(value)} />
            <Numeric
                label={t('tools:toolCost')}
                placeholder={t('tools:toolCostPlaceholder')}
                errorMessage={t('tools:toolCostErrorMessage')}
                allowNegative
                allowDouble
                required
                onChange={(value: number | undefined) => setCost(value)} />
            <DayPicker
                label={t('tools:toolDateOfPurchase')}
                placeholder={t('tools:toolDateOfPurchasePlaceholder')}
                errorMessage={t('tools:toolDateOfPurchaseErrorMessage')}
                required
                onChange={(value: Date | undefined) => setDateOfPurchase(value)}
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
            <DayPicker
                label={t('tools:toolDateOfExpiry')}
                placeholder={t('tools:toolDateOfExpiryPlaceholder')}
                errorMessage={t('tools:toolDateOfExpiryErrorMessage')}
                required
                onChange={(value: Date | undefined) => setDateOfExpiry(value)}
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
                label={t('tools:toolRemark')}
                placeholder={t('tools:toolRemarkPlaceholder')}
                errorMessage={t('tools:toolRemarkErrorMessage')}
                minLength={0}
                maxLength={1024}
                onChange={(value: string | undefined) => setRemark(value)} />
            <Button
                title={t('tools:toolCreateButton')}
                type="submit"
                rounded />
        </FormContextProvider>
    )
}

interface UpdateToolProps {
    selected: { value: string | undefined } | undefined
}

const UpdateTool: FunctionComponent<UpdateToolProps> = ({ selected }: UpdateToolProps) => {
    const { t } = useTranslation()
    const { notify } = useToast()

    const { data: tools = [] } = useGetToolsQuery()
    const [updateTool] = useUpdateToolMutation()

    const [toolNumber, setToolNumber] = useState<string | undefined>(undefined)
    const [title, setTitle] = useState<string | undefined>(undefined)
    const [currency, setCurrency] = useState<string | undefined>(undefined)
    const [cost, setCost] = useState<number | undefined>(undefined)
    const [dateOfPurchase, setDateOfPurchase] = useState<Date | undefined>(undefined)
    const [dateOfExpiry, setDateOfExpiry] = useState<Date | undefined>(undefined)
    const [remark, setRemark] = useState<string | undefined>(undefined)
    const [isOpen, setIsOpen] = useState<boolean>(false)

    useEffect(() => {
        const tool = tools.find(x => x.id === selected?.value)
        if (tool) {
            setToolNumber(tool.toolNumber)
            setTitle(tool.title)
            setCurrency(String(tool.currency))
            setCost(tool.cost)
            setDateOfPurchase(new Date(tool.dateOfPurchase))
            setDateOfExpiry(new Date(tool.dateOfExpiry))
            setRemark(tool.remark)
            setIsOpen(!isOpen)
        }
    }, [selected])

    const onSubmit = () => {
        if (!selected?.value || !toolNumber || !title || !currency || !cost || !dateOfPurchase || !dateOfExpiry) return
        const tool = tools.find(x => x.id === selected?.value)
        if (!tool) return
        updateTool({
            ...tool,
            toolNumber,
            title,
            currency: Number(currency),
            cost,
            dateOfPurchase: toLocalISOTime(dateOfPurchase),
            dateOfExpiry: toLocalISOTime(dateOfExpiry)
        } as Tool)
        notify(t('tools:toastUpdate'))
        setIsOpen(!isOpen)
    }

    return (
        <Modal
            title={t('tools:toolUpdateModal')}
            isOpen={isOpen}
            onClick={(value: boolean) => setIsOpen(value)}>
            <FormContextProvider onSubmit={onSubmit}>
                <Input
                    label={t('tools:toolToolNumber')}
                    defaultValue={toolNumber}
                    placeholder={t('tools:toolToolNumberPlaceholder')}
                    errorMessage={t('tools:toolToolNumberErrorMessage')}
                    required
                    minLength={1}
                    maxLength={32}
                    onChange={(value: string | undefined) => setToolNumber(value)} />
                <Input
                    label={t('tools:toolTitle')}
                    defaultValue={title}
                    placeholder={t('tools:toolTitlePlaceholder')}
                    errorMessage={t('tools:toolTitleErrorMessage')}
                    required
                    minLength={1}
                    maxLength={64}
                    onChange={(value: string | undefined) => setToolNumber(value)} />
                <Select
                    label={t('tools:toolCurrency')}
                    defaultValue={currency}
                    required
                    errorMessage={t('tools:toolCurrencyErrorMessage')}
                    options={[
                        { label: t('tools:toolCurrencyUsd'), value: '0' },
                        { label: t('tools:toolCurrencyEur'), value: '1' },
                        { label: t('tools:toolCurrencyUah'), value: '2' },
                        { label: t('tools:toolCurrencyPln'), value: '3' }
                    ]}
                    onChange={(value: string | undefined) => setCurrency(value)} />
                <Numeric
                    label={t('tools:toolCost')}
                    defaultValue={cost?.toFixed(2)}
                    placeholder={t('tools:toolCostPlaceholder')}
                    errorMessage={t('tools:toolCostErrorMessage')}
                    allowNegative
                    allowDouble
                    required
                    onChange={(value: number | undefined) => setCost(value)} />
                <DayPicker
                    label={t('tools:toolDateOfPurchase')}
                    defaultValue={dateOfPurchase}
                    placeholder={t('tools:toolDateOfPurchasePlaceholder')}
                    errorMessage={t('tools:toolDateOfPurchaseErrorMessage')}
                    required
                    onChange={(value: Date | undefined) => setDateOfExpiry(value)}
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
                <DayPicker
                    label={t('tools:toolDateOfExpiry')}
                    defaultValue={dateOfExpiry}
                    placeholder={t('tools:toolDateOfExpiryPlaceholder')}
                    errorMessage={t('tools:toolDateOfExpiryErrorMessage')}
                    required
                    onChange={(value: Date | undefined) => setDateOfExpiry(value)}
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
                    label={t('tools:toolRemark')}
                    defaultValue={remark}
                    placeholder={t('tools:toolRemarkPlaceholder')}
                    errorMessage={t('tools:toolRemarkErrorMessage')}
                    minLength={0}
                    maxLength={1024}
                    onChange={(value: string | undefined) => setRemark(value)} />
                <Button
                    title={t('tools:toolUpdateModalButton')}
                    type="submit"
                    rounded />
            </FormContextProvider>
        </Modal>
    )
}

interface DeleteToolProps {
    selected: { value: string | undefined } | undefined
}

const DeleteTool: FunctionComponent<DeleteToolProps> = ({ selected }: DeleteToolProps) => {
    const { t } = useTranslation()
    const { notify } = useToast()

    const { data: tools = [] } = useGetToolsQuery()
    const [deleteTool] = useDeleteToolMutation()

    const [choice, setChoice] = useState<string | undefined>(undefined)
    const [isOpen, setIsOpen] = useState<boolean>(false)

    useEffect(() => {
        const tool = tools.find(x => x.id === selected?.value)
        if (tool) {
            setIsOpen(!isOpen)
        }
    }, [selected])

    const onSubmit = () => {
        if (!selected?.value || !choice) return
        deleteTool(selected?.value)
        notify(t('tools:toastDelete'))
        setIsOpen(!isOpen)
    }

    return (
        <Modal
            title={t('tools:toolDeleteModal')}
            isOpen={isOpen}
            onClick={(value: boolean) => setIsOpen(value)}>
            <FormContextProvider onSubmit={onSubmit}>
                <Select
                    label={t('tools:toolDelete')}
                    defaultValue={'none'}
                    errorMessage={t('tools:toolDeleteErrorMessage')}
                    required
                    options={[
                        { label: t('tools:toolDeleteNone'), value: 'none', disabled: true },
                        { label: t('tools:toolDeleteAgree'), value: '0' }
                    ]}
                    onChange={(value: string | undefined) => setChoice(value)} />
                <Button
                    title={t('tools:toolDeleteModalButton')}
                    type="submit"
                    rounded />
            </FormContextProvider>
        </Modal>
    )
}

export default Index

export const getServerSideProps = withPageAuthRequired()
