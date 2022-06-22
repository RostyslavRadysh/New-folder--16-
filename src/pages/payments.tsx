import React, { FunctionComponent, useState, useEffect, useMemo } from 'react'
import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import useTranslation from 'next-translate/useTranslation'
import { MenuAlt1Icon, CogIcon, TrashIcon } from '@heroicons/react/outline'
import { toFormatDate, toLocalISOTime } from '@/utils/helpers'
import MainLayout from '@/layouts/mains'
import { useToast } from '@/providers/toastContextProvider'
import FormContextProvider from '@/providers/formContextProvider'
import Background from '@/components/backgrounds'
import Products from '@/components/products'
import List from '@/components/lists'
import Datatable from '@/components/datatables'
import Input from '@/components/inputs'
import Numeric from '@/components/numerics'
import DayPicker from '@/components/daypickers'
import Textarea from '@/components/textareas'
import Select from '@/components/selects'
import Button from '@/components/buttons'
import Modal from '@/components/modals'
import Payment from '@/models/payment'
import Arrangement from '@/models/arrangement'
import { useGetPaymentsQuery, useUpdatePaymentMutation } from '@/slicers/apis/paymentApi'
import {
    useGetArrangementsQuery,
    useAddArrangementMutation,
    useUpdateArrangementMutation,
    useDeleteArrangementMutation
} from '@/slicers/apis/arrangementApi'

const Index = () => {
    const { t, lang } = useTranslation()

    const [hidden, setHidden] = useState<boolean>(false)
    const [search, setSearch] = useState<string>('')
    const [sort, setSort] = useState<string>('ascByTitle')
    const { data: payments = [] } = useGetPaymentsQuery()
    const { data: arrangements = [] } = useGetArrangementsQuery()
    const [selectedUpdatePayment, setSelectedUpdatePayment] = useState<{ value: string | undefined }>()
    const [selectedUpdateArrangement, setSelectedUpdateArrangement] = useState<{ value: string | undefined }>()
    const [selectedDeleteArrangement, setSelectedDeleteArrangement] = useState<{ value: string | undefined }>()

    useEffect(() => {
        const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' })
        switch (sort) {
            case 'ascByTitle': {
                payments.sort((x, y) => collator.compare(x.title, y.title))
                break
            }
            case 'descByTitle': {
                payments.sort((x, y) => collator.compare(y.title, x.title))
                break
            }
        }
    }, [sort])
    const data = useMemo<{ id: string, question: string, answer: JSX.Element }[]>(() => {
        const filteredData = search === '' ? payments : payments.filter(x => x.title.toLowerCase().indexOf(search.toLowerCase()) > -1)
        return filteredData.map(x => {
            return {
                id: x.id,
                question: x.title,
                answer: (() => {
                    const billingAccountTypes = [
                        { label: t('payments:paymentTypeSavings'), value: '0' },
                        { label: t('payments:paymentTypeDeposit'), value: '1' }
                    ]
                    const currencyTypes = [
                        { label: t('payments:paymentCurrencyUsd'), value: '0' },
                        { label: t('payments:paymentCurrencyEur'), value: '1' },
                        { label: t('payments:paymentCurrencyUah'), value: '2' },
                        { label: t('payments:paymentCurrencyPln'), value: '3' }
                    ]
                    const list = [
                        { title: t('payments:paymentType'), content: <div className="text-sm text-gray-500">{billingAccountTypes.find(y => y.value === String(x.type))?.label}</div> },
                        { title: t('payments:paymentIban'), content: <div className="text-sm text-gray-500">{x.iban}</div> },
                        { title: t('payments:paymentSortCode'), content: <div className="text-sm text-gray-500">{x.sortCode}</div> },
                        { title: t('payments:paymentCurrency'), content: <div className="text-sm text-gray-500">{currencyTypes.find(y => y.value === String(x.currency))?.label}</div> },
                        { title: t('payments:paymentBalance'), content: <div className="text-sm text-gray-500">{x.balance.toFixed(2)}</div> },
                        { title: t('payments:paymentRemark'), content: <div className="text-sm text-gray-500">{x.remark ?? t('payments:paymentRemarkNone')}</div> }
                    ]
                    const arrangementsColumns = [
                        t('payments:datatableArrangementsTitle'),
                        t('payments:datatableArrangementsTime'),
                        undefined
                    ]
                    const arrangementsRows = arrangements.filter(y => y.paymentId === x.id).map(y => {
                        return [
                            y.title,
                            toFormatDate(new Date(y.time)),
                            (
                                <span className="flex flex-row items-center justify-end space-x-2">
                                    <button className="outline-none cursor-pointer focus:outline-none flex-shrink-0">
                                        <CogIcon
                                            className="w-6 h-6 text-gray-500"
                                            onClick={() => setSelectedUpdateArrangement({ ...{ value: y.id } })} />
                                    </button>
                                    <button className="outline-none cursor-pointer focus:outline-none flex-shrink-0">
                                        <TrashIcon
                                            className="w-6 h-6 text-gray-500"
                                            onClick={() => setSelectedDeleteArrangement({ ...{ value: y.id } })} />
                                    </button>
                                </span>
                            )
                        ]
                    }) ?? []

                    return (
                        <div className="flex flex-col space-y-4">
                            <List items={list} />
                            <Button
                                title={t('payments:paymentUpdateButton')}
                                type="button"
                                rounded
                                onClick={() => setSelectedUpdatePayment({ ...{ value: x.id } })} />
                            <div className="text-center text-xs font-bold tracking-wider text-gray-900 uppercase dark:text-white">{t('payments:datatableArrangements')}</div>
                            <Datatable
                                columns={arrangementsColumns}
                                rows={arrangementsRows}
                                messages={{
                                    noDataFound: t('payments:dataNotFound'),
                                    previous: t('payments:previous'),
                                    next: t('payments:next'),
                                    page: t('payments:page'),
                                    select: t('payments:select')
                                }} />
                        </div>
                    )
                })()
            }
        })
    }, [payments, arrangements, search, lang])

    return (
        <MainLayout>
            <Background>
                <div className="flex flex-col px-4 py-8 space-x-0 space-y-7 lg:flex-row lg:space-x-7 lg:space-y-0">
                    <div className={`flex flex-col ${hidden ? 'lg:w-6' : 'lg:w-1/3'}`}>
                        <div className="flex flex-row items-center justify-between">
                            <div className={`${hidden ? 'hidden' : 'block'}`}>
                                <div className="text-xs font-light tracking-wide uppercase text-gray-500">{t('payments:arrangementCreate')}</div>
                            </div>
                            <button
                                className="outline-none appearance-none cursor-pointer focus:outline-none flex-shrink-0"
                                onClick={() => setHidden(!hidden)}>
                                <MenuAlt1Icon className="w-6 h-6 text-gray-900 dark:text-white" />
                            </button>
                        </div>
                        <div className={`${hidden ? 'hidden' : 'block'}`}>
                            <CreateArrangement />
                        </div>
                    </div>
                    <div className={`w-full ${hidden ? '' : 'lg:w-2/3'}`}>
                        <Products
                            products={data}
                            messages={{
                                noDataFound: t('payments:dataNotFound')
                            }}
                            searchOptions={{ placeholder: t('payments:searchPlaceholder'), onChange: (value: string) => setSearch(value) }}
                            sortByOptions={[
                                { title: t('payments:sortAscByTitle'), value: 'ascByTitle' },
                                { title: t('payments:sortDescByTitle'), value: 'descByTitle' }
                            ]}
                            onSortByChange={(value: string) => setSort(value)} />
                    </div>
                </div>
                <UpdatePayment selected={selectedUpdatePayment} />
                <UpdateArrangement selected={selectedUpdateArrangement} />
                <DeleteArrangement selected={selectedDeleteArrangement} />
            </Background>
        </MainLayout>
    )
}

interface UpdatePaymentProps {
    selected: { value: string | undefined } | undefined
}

const UpdatePayment: FunctionComponent<UpdatePaymentProps> = ({ selected }: UpdatePaymentProps) => {
    const { t } = useTranslation()
    const { notify } = useToast()

    const { data: payments = [] } = useGetPaymentsQuery()
    const [updatePayment] = useUpdatePaymentMutation()

    const [title, setTitle] = useState<string | undefined>(undefined)
    const [type, setType] = useState<string | undefined>(undefined)
    const [iban, setIban] = useState<string | undefined>(undefined)
    const [sortCode, setSortCode] = useState<string | undefined>(undefined)
    const [balance, setBalance] = useState<number | undefined>(undefined)
    const [currency, setCurrency] = useState<string | undefined>(undefined)
    const [remark, setRemark] = useState<string | undefined>(undefined)
    const [isOpen, setIsOpen] = useState<boolean>(false)

    useEffect(() => {
        const payment = payments.find(x => x.id === selected?.value)
        if (payment) {
            setTitle(payment.title)
            setType(String(payment.type))
            setIban(payment.iban)
            setSortCode(payment.sortCode)
            setCurrency(String(payment.currency))
            setBalance(payment.balance)
            setRemark(payment.remark)
            setIsOpen(!isOpen)
        }
    }, [selected])

    const onSubmit = () => {
        if (!selected?.value || !title || !balance) return
        const payment = payments.find(x => x.id === selected?.value)
        if (!payment) return
        updatePayment({
            ...payment,
            title,
            balance,
            remark
        } as Payment)
        notify(t('payments:toastUpdate'))
        setIsOpen(!isOpen)
    }

    return (
        <Modal
            title={t('payments:paymentUpdateModal')}
            isOpen={isOpen}
            onClick={(value: boolean) => setIsOpen(value)}>
            <FormContextProvider onSubmit={onSubmit}>
                <Input
                    label={t('payments:paymentTitle')}
                    defaultValue={title}
                    placeholder={t('payments:paymentTitlePlaceholder')}
                    errorMessage={t('payments:paymentTitleErrorMessage')}
                    required
                    minLength={1}
                    maxLength={64}
                    onChange={(value: string | undefined) => setTitle(value)} />
                <Select
                    label={t('payments:paymentType')}
                    defaultValue={type}
                    disabled={true}
                    options={[
                        { label: t('payments:paymentTypeSavings'), value: '0' },
                        { label: t('payments:paymentTypeDeposit'), value: '1' }
                    ]} />
                <Input
                    defaultValue={iban}
                    disabled={true}
                    label={t('payments:paymentIban')} />
                <Input
                    defaultValue={sortCode}
                    disabled={true}
                    label={t('payments:paymentSortCode')} />
                <Select
                    label={t('payments:paymentCurrency')}
                    defaultValue={currency}
                    disabled={true}
                    options={[
                        { label: t('payments:paymentCurrencyUsd'), value: '0' },
                        { label: t('payments:paymentCurrencyEur'), value: '1' },
                        { label: t('payments:paymentCurrencyUah'), value: '2' },
                        { label: t('payments:paymentCurrencyPln'), value: '3' }
                    ]} />
                <Numeric
                    label={t('payments:paymentBalance')}
                    defaultValue={balance?.toFixed(2)}
                    placeholder={t('payments:paymentBalancePlaceholder')}
                    errorMessage={t('payments:paymentBalanceErrorMessage')}
                    allowNegative
                    allowDouble
                    required
                    onChange={(value: number | undefined) => setBalance(value)} />
                <Textarea
                    label={t('payments:paymentRemark')}
                    defaultValue={remark}
                    placeholder={t('payments:paymentRemarkPlaceholder')}
                    errorMessage={t('payments:paymentRemarkErrorMessage')}
                    minLength={0}
                    maxLength={1024}
                    onChange={(value: string | undefined) => setRemark(value)} />
                <Button
                    title={t('payments:arrangementUpdateModalButton')}
                    type="submit"
                    rounded />
            </FormContextProvider>
        </Modal>
    )
}

const CreateArrangement: FunctionComponent = () => {
    const { t } = useTranslation()
    const { notify } = useToast()

    const { data: payments = [] } = useGetPaymentsQuery()
    const [addArrangement] = useAddArrangementMutation()

    const [paymentId, setPaymentId] = useState<string | undefined>(undefined)
    const [arrangementNumber, setArrangementNumber] = useState<string | undefined>(undefined)
    const [title, setTitle] = useState<string | undefined>(undefined)
    const [description, setDescription] = useState<string | undefined>(undefined)
    const [iban, setIban] = useState<string | undefined>(undefined)
    const [sortCode, setSortCode] = useState<string | undefined>(undefined)
    const [total, setTotal] = useState<number | undefined>(undefined)
    const [time, setTime] = useState<Date | undefined>(undefined)

    const onSubmit = () => {
        if (!paymentId || !arrangementNumber || !title || !iban || !sortCode || !total || !time) return
        const arrangement = {
            paymentId,
            arrangementNumber,
            title,
            description,
            iban,
            sortCode,
            total,
            time: toLocalISOTime(time),
        } as Arrangement
        addArrangement(arrangement)
        notify(t('payments:toastCreate'))
    }

    return (
        <FormContextProvider onSubmit={onSubmit}>
            <Select
                label={t('payments:arrangementPayment')}
                errorMessage={t('payments:arrangementPaymentErrorMessage')}
                defaultValue={'none'}
                required
                options={[
                    { label: t('payments:arrangementPaymentNone'), value: 'none', disabled: true },
                    ...payments.map(x => { return { label: x.title, value: x.id } })
                ]}
                onChange={(value: string | undefined) => setPaymentId(value)} />
            <Input
                label={t('payments:arrangementArrangementNumber')}
                placeholder={t('payments:arrangementArrangementNumberPlaceholder')}
                errorMessage={t('payments:arrangementArrangementNumberErrorMessage')}
                required
                minLength={1}
                maxLength={32}
                onChange={(value: string | undefined) => setArrangementNumber(value)} />
            <Input
                label={t('payments:arrangementTitle')}
                placeholder={t('payments:arrangementTitlePlaceholder')}
                errorMessage={t('payments:arrangementTitleErrorMessage')}
                required
                minLength={1}
                maxLength={64}
                onChange={(value: string | undefined) => setTitle(value)} />
            <Textarea
                label={t('payments:arrangementDescription')}
                placeholder={t('payments:arrangementDescriptionPlaceholder')}
                errorMessage={t('payments:arrangementDescriptionErrorMessage')}
                minLength={0}
                maxLength={1024}
                onChange={(value: string | undefined) => setDescription(value)} />
            <Input
                label={t('payments:arrangementIban')}
                placeholder={t('payments:arrangementIbanPlaceholder')}
                errorMessage={t('payments:arrangementIbanErrorMessage')}
                required
                minLength={27}
                maxLength={27}
                onChange={(value: string | undefined) => setIban(value)} />
            <Input
                label={t('payments:arrangementSortCode')}
                placeholder={t('payments:arrangementSortCodePlaceholder')}
                errorMessage={t('payments:arrangementSortCodeErrorMessage')}
                required
                minLength={6}
                maxLength={6}
                onChange={(value: string | undefined) => setSortCode(value)} />
            <Numeric
                label={t('payments:arrangementAmount')}
                placeholder={t('payments:arrangementAmountPlaceholder')}
                errorMessage={t('payments:arrangementAmountErrorMessage')}
                allowNegative
                allowDouble
                required
                onChange={(value: number | undefined) => setTotal(value)} />
            <DayPicker
                label={t('payments:arrangementTime')}
                placeholder={t('payments:arrangementTimePlaceholder')}
                errorMessage={t('payments:arrangementTimeErrorMessage')}
                required
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
                ]}
                onChange={(value: Date | undefined) => setTime(value)} />
            <Button
                title={t('payments:arrangementCreateButton')}
                type="submit"
                rounded />
        </FormContextProvider>
    )
}

interface UpdateArrangementProps {
    selected: { value: string | undefined } | undefined
}

const UpdateArrangement: FunctionComponent<UpdateArrangementProps> = ({ selected }: UpdateArrangementProps) => {
    const { t } = useTranslation()
    const { notify } = useToast()

    const { data: payments = [] } = useGetPaymentsQuery()
    const { data: arrangements = [] } = useGetArrangementsQuery()
    const [updateArrangement] = useUpdateArrangementMutation()

    const [paymentId, setPaymentId] = useState<string | undefined>(undefined)
    const [arrangementNumber, setArrangementNumber] = useState<string | undefined>(undefined)
    const [title, setTitle] = useState<string | undefined>(undefined)
    const [description, setDescription] = useState<string | undefined>(undefined)
    const [iban, setIban] = useState<string | undefined>(undefined)
    const [sortCode, setSortCode] = useState<string | undefined>(undefined)
    const [total, setTotal] = useState<number | undefined>(undefined)
    const [time, setTime] = useState<Date | undefined>(undefined)
    const [isOpen, setIsOpen] = useState<boolean>(false)

    useEffect(() => {
        const arrangement = arrangements.find(x => x.id === selected?.value)
        if (arrangement) {
            setPaymentId(arrangement.paymentId)
            setArrangementNumber(arrangement.arrangementNumber)
            setTitle(arrangement.title)
            setDescription(arrangement.description)
            setIban(arrangement.iban)
            setSortCode(arrangement.sortCode)
            setTotal(arrangement.total)
            setTime(new Date(arrangement.time))
            setIsOpen(!isOpen)
        }
    }, [selected])

    const onSubmit = () => {
        if (!selected?.value || !arrangementNumber || !title || !iban || !sortCode || !total || !time) return
        const arrangement = arrangements.find(x => x.id === selected?.value)
        if (!arrangement) return
        updateArrangement({
            ...arrangement,
            arrangementNumber,
            title,
            iban,
            sortCode,
            total,
            time: toLocalISOTime(time)
        } as Arrangement)
        notify(t('payments:toastUpdate'))
        setIsOpen(!isOpen)
    }

    return (
        <Modal
            title={t('payments:arrangementUpdateModal')}
            isOpen={isOpen}
            onClick={(value: boolean) => setIsOpen(value)}>
            <FormContextProvider onSubmit={onSubmit}>
                <Select
                    label={t('payments:arrangementPayment')}
                    defaultValue={paymentId}
                    disabled={true}
                    options={[...payments.map(x => { return { label: x.title, value: x.id } })]} />
                <Input
                    label={t('payments:arrangementArrangementNumber')}
                    defaultValue={arrangementNumber}
                    placeholder={t('payments:arrangementArrangementNumberPlaceholder')}
                    errorMessage={t('payments:arrangementArrangementNumberErrorMessage')}
                    required
                    minLength={1}
                    maxLength={32}
                    onChange={(value: string | undefined) => setArrangementNumber(value)} />
                <Input
                    label={t('payments:arrangementTitle')}
                    defaultValue={title}
                    placeholder={t('payments:arrangementTitlePlaceholder')}
                    errorMessage={t('payments:arrangementTitleErrorMessage')}
                    required
                    minLength={1}
                    maxLength={64}
                    onChange={(value: string | undefined) => setTitle(value)} />
                <Textarea
                    label={t('payments:arrangementDescription')}
                    defaultValue={description}
                    placeholder={t('payments:arrangementDescriptionPlaceholder')}
                    errorMessage={t('payments:arrangementDescriptionErrorMessage')}
                    minLength={0}
                    maxLength={1024}
                    onChange={(value: string | undefined) => setDescription(value)} />
                <Input
                    label={t('payments:arrangementIban')}
                    defaultValue={iban}
                    placeholder={t('payments:arrangementIbanPlaceholder')}
                    errorMessage={t('payments:arrangementIbanErrorMessage')}
                    required
                    minLength={27}
                    maxLength={27}
                    onChange={(value: string | undefined) => setIban(value)} />
                <Input
                    label={t('payments:arrangementSortCode')}
                    defaultValue={sortCode}
                    placeholder={t('payments:arrangementSortCodePlaceholder')}
                    errorMessage={t('payments:arrangementSortCodeErrorMessage')}
                    required
                    minLength={6}
                    maxLength={6}
                    onChange={(value: string | undefined) => setSortCode(value)} />
                <Numeric
                    label={t('payments:arrangementAmount')}
                    defaultValue={total?.toFixed(2)}
                    placeholder={t('payments:arrangementAmountPlaceholder')}
                    errorMessage={t('payments:arrangementAmountErrorMessage')}
                    allowNegative
                    allowDouble
                    required
                    onChange={(value: number | undefined) => setTotal(value)} />
                <DayPicker
                    label={t('payments:arrangementTime')}
                    defaultValue={time}
                    placeholder={t('payments:arrangementTimePlaceholder')}
                    errorMessage={t('payments:arrangementTimeErrorMessage')}
                    required
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
                    ]}
                    onChange={(value: Date | undefined) => setTime(value)} />
                <Button
                    title={t('payments:arrangementUpdateModalButton')}
                    type="submit"
                    rounded />
            </FormContextProvider>
        </Modal>
    )
}


interface DeleteArrangementProps {
    selected: { value: string | undefined } | undefined
}

const DeleteArrangement: FunctionComponent<DeleteArrangementProps> = ({ selected }: DeleteArrangementProps) => {
    const { t } = useTranslation()
    const { notify } = useToast()

    const { data: arrangements = [] } = useGetArrangementsQuery()
    const [deleteArrangement] = useDeleteArrangementMutation()

    const [choice, setChoice] = useState<string | undefined>(undefined)
    const [isOpen, setIsOpen] = useState<boolean>(false)

    useEffect(() => {
        const arrangement = arrangements.find(x => x.id === selected?.value)
        if (arrangement) {
            setIsOpen(!isOpen)
        }
    }, [selected])

    const onSubmit = () => {
        if (!selected?.value || !choice) return
        deleteArrangement(selected?.value)
        notify(t('payments:toastDelete'))
        setIsOpen(!isOpen)
    }

    return (
        <Modal
            title={t('payments:arrangementDeleteModal')}
            isOpen={isOpen}
            onClick={(value: boolean) => setIsOpen(value)}>
            <FormContextProvider onSubmit={onSubmit}>
                <Select
                    label={t('payments:arrangementDelete')}
                    defaultValue={'none'}
                    errorMessage={t('payments:arrangementDeleteErrorMessage')}
                    required
                    options={[
                        { label: t('payments:arrangementDeleteNone'), value: 'none', disabled: true },
                        { label: t('payments:arrangementDeleteAgree'), value: '0' }
                    ]}
                    onChange={(value: string | undefined) => setChoice(value)} />
                <Button
                    title={t('payments:arrangementDeleteModalButton')}
                    type="submit"
                    rounded />
            </FormContextProvider>
        </Modal>
    )
}

export default Index

export const getServerSideProps = withPageAuthRequired()
