import React, { FunctionComponent, useState, useEffect, useMemo } from 'react'
import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import useTranslation from 'next-translate/useTranslation'
import { MenuAlt1Icon } from '@heroicons/react/outline'
import MainLayout from '@/layouts/mains'
import { useToast } from '@/providers/toastContextProvider'
import FormContextProvider from '@/providers/formContextProvider'
import Background from '@/components/backgrounds'
import Products from '@/components/products'
import List from '@/components/lists'
import Input from '@/components/inputs'
import DayPicker from '@/components/daypickers'
import Textarea from '@/components/textareas'
import Select from '@/components/selects'
import Button from '@/components/buttons'
import Modal from '@/components/modals'
import Building from '@/models/building'
import Contract from '@/models/contract'
import { useGetBuildingsQuery } from '@/slicers/apis/buildingApi'
import {
    useGetContractsQuery,
    useAddContractMutation,
    useUpdateContractMutation,
    useDeleteContractMutation
} from '@/slicers/apis/contractApi'

const Index = () => {
    const { t, lang } = useTranslation()
    const { notify } = useToast()

    const [hidden, setHidden] = useState<boolean>(false)
    const [search, setSearch] = useState<string>('')
    const [sort, setSort] = useState<string>('ascByTitle')
    const [buildings] = useState<{ label: string, value: string }[]>(() => (Object.values(JSON.parse(JSON.stringify(buildingsJson))) as Building[]).map(x => { return { label: x.legalAddress, value: x.id } }))
    const [data, setData] = useState<Contract[]>(() => Object.values(JSON.parse(JSON.stringify(contractsJson))) as Contract[])
    const [selectedContractUpdate, setSelectedContractUpdate] = useState<{ value: string | undefined }>()
    const [selectedContractDelete, setSelectedContractDelete] = useState<{ value: string | undefined }>()

    const [buildingId, setBuildingId] = useState<string | undefined>(undefined)
    const [contractNumber, setContractNumber] = useState<string | undefined>(undefined)
    const [title, setTitle] = useState<string | undefined>(undefined)
    const [type, setType] = useState<string | undefined>(undefined)
    const [dateOfSigning, setDateOfSigning] = useState<Date | undefined>(undefined)
    const [description, setDescription] = useState<string | undefined>(undefined)

    useEffect(() => {
        const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' })
        switch (sort) {
            case 'ascByTitle': {
                setData([...data.sort((x, y) => collator.compare(x.title, y.title))])
                break
            }
            case 'descByTitle': {
                setData([...data.sort((x, y) => collator.compare(y.title, x.title))])
                break
            }
        }
    }, [sort])
    const products = useMemo<{ id: string, question: string, answer: JSX.Element }[]>(() => {
        const filteredData = search === '' ? data : data.filter(x => x.title.toLowerCase().indexOf(search.toLowerCase()) > -1)
        return filteredData.map(x => {
            return {
                id: x.id,
                question: x.title,
                answer: (() => {
                    const contractTypes = [
                        { label: t('contracts:contractTypeCivil'), value: '0' },
                        { label: t('contracts:contractTypeSale'), value: '1' },
                        { label: t('contracts:contractTypeSupply'), value: '2' },
                        { label: t('contracts:contractTypeExecutive'), value: '3' },
                        { label: t('contracts:contractTypeLiability'), value: '4' },
                        { label: t('contracts:contractTypeCooperation'), value: '5' },
                        { label: t('contracts:contractTypeManagement'), value: '6' },
                        { label: t('contracts:contractTypeMemorandum'), value: '7' },
                        { label: t('contracts:contractTypeLease'), value: '8' }
                    ]
                    const list = [
                        { title: t('contracts:contractBuilding'), content: <div className="text-sm text-gray-500">{buildings.find(y => y.value === x.buildingId)?.label}</div> },
                        { title: t('contracts:contractDescription'), content: <div className="text-sm text-gray-500">{x.description}</div> },
                        { title: t('contracts:contractContractNumber'), content: <div className="text-sm text-gray-500">{x.contractNumber}</div> },
                        { title: t('contracts:contractType'), content: <div className="text-sm text-gray-500">{contractTypes.find(y => y.value === String(x.type))?.label}</div> },
                        { title: t('contracts:contractDateOfSigning'), content: <div className="text-sm text-gray-500">{x.dateOfSigning}</div> },
                    ]

                    return (
                        <div className="flex flex-col space-y-4">
                            <List items={list} />
                            <div className="flex flex-row items-center justify-start space-x-2">
                                <Button
                                    title={t('contracts:contractUpdateButton')}
                                    type="button"
                                    rounded
                                    onClick={() => setSelectedContractUpdate({ ...{ value: x.id } })} />
                                <Button
                                    title={t('contracts:contractDeleteButton')}
                                    type="button"
                                    color="red"
                                    rounded
                                    onClick={() => setSelectedContractDelete({ ...{ value: x.id } })} />
                            </div>
                        </div>
                    )
                })()
            }
        })
    }, [data, search, lang])

    const createContract = (buildingId: string, description: string, contractNumber: string, title: string, type: string, dateOfSigning: Date) => {
        const contract = {
            id: data.length.toString(),
            buildingId: buildingId,
            description: description,
            contractNumber: contractNumber,
            title: title,
            type: Number(type),
            dateOfSigning: dateOfSigning.toString()
        } as Contract
        setData([...data, contract])
        notify(t('contracts:toastCreate'))
    }
    const updateContract = (id: string, description: string, contractNumber: string, title: string, type: string, dateOfSigning: Date) => {
        const item = data.find(item => item.id === id)
        if (item) {
            item.contractNumber = contractNumber
            item.description = description
            item.title = title
            item.type = Number(type)
            item.dateOfSigning = dateOfSigning.toString()
            setData([...data])
            notify(t('contracts:toastUpdate'))
        }
    }
    const deleteContract = (id: string) => {
        const item = data.find(x => x.id === id)
        if (item) {
            setData([...data.filter(x => x.id !== id)])
            notify(t('contracts:toastDelete'))
        }
    }

    const onSubmit = () => {
        if (buildingId && description && contractNumber && title && type && dateOfSigning) {
            createContract(
                buildingId,
                contractNumber,
                description,
                title,
                type,
                dateOfSigning
            )
        }
    }

    return (
        <MainLayout>
            <Background>
                <div className="flex flex-col px-4 py-8 space-x-0 space-y-7 lg:flex-row lg:space-x-7 lg:space-y-0">
                    <div className={`flex flex-col ${hidden ? 'lg:w-6' : 'lg:w-1/3'}`}>
                        <div className="flex flex-row items-center justify-between">
                            <div className={`${hidden ? 'hidden' : 'block'}`}>
                                <div className="text-xs font-light tracking-wide uppercase text-gray-500">{t('contracts:contractCreate')}</div>
                            </div>
                            <button
                                className="outline-none appearance-none cursor-pointer focus:outline-none flex-shrink-0"
                                onClick={() => setHidden(!hidden)}>
                                <MenuAlt1Icon className="w-6 h-6 text-gray-900 dark:text-white" />
                            </button>
                        </div>
                        <div className={`${hidden ? 'hidden' : 'block'}`}>
                            <FormContextProvider onSubmit={onSubmit}>
                                <Select
                                    label={t('contracts:contractBuilding')}
                                    errorMessage={t('contracts:contractBuildingErrorMessage')}
                                    defaultValue={'none'}
                                    required
                                    options={[
                                        { label: t('contracts:contractBuildingNone'), value: 'none', disabled: true },
                                        ...buildings
                                    ]}
                                    onChange={(value: string | undefined) => setBuildingId(value)} />
                                <Input
                                    label={t('contracts:contractContractNumber')}
                                    placeholder={t('contracts:contractContractNumberPlaceholder')}
                                    errorMessage={t('contracts:contractContractNumberErrorMessage')}
                                    required
                                    minLength={1}
                                    maxLength={32}
                                    onChange={(value: string | undefined) => setContractNumber(value)} />
                                <Input
                                    label={t('contracts:contractTitle')}
                                    placeholder={t('contracts:contractTitlePlaceholder')}
                                    errorMessage={t('contracts:contractTitleErrorMessage')}
                                    required
                                    minLength={1}
                                    maxLength={64}
                                    onChange={(value: string | undefined) => setTitle(value)} />
                                <Textarea
                                    label={t('contracts:contractDescription')}
                                    placeholder={t('contracts:contractDescriptionPlaceholder')}
                                    errorMessage={t('contracts:contractDescriptionErrorMessage')}
                                    required
                                    minLength={1}
                                    maxLength={512}
                                    onChange={(value: string | undefined) => setDescription(value)} />
                                <Select
                                    label={t('contracts:contractType')}
                                    errorMessage={t('contracts:contractTypeErrorMessage')}
                                    defaultValue={'none'}
                                    required
                                    options={[
                                        { label: t('contracts:contractTypeNone'), value: 'none', disabled: true },
                                        { label: t('contracts:contractTypeCivil'), value: '0' },
                                        { label: t('contracts:contractTypeSale'), value: '1' },
                                        { label: t('contracts:contractTypeSupply'), value: '2' },
                                        { label: t('contracts:contractTypeExecutive'), value: '3' },
                                        { label: t('contracts:contractTypeLiability'), value: '4' },
                                        { label: t('contracts:contractTypeCooperation'), value: '5' },
                                        { label: t('contracts:contractTypeManagement'), value: '6' },
                                        { label: t('contracts:contractTypeMemorandum'), value: '7' },
                                        { label: t('contracts:contractTypeLease'), value: '8' }
                                    ]}
                                    onChange={(value: string | undefined) => setType(value)} />
                                <DayPicker
                                    label={t('contracts:contractDateOfSigning')}
                                    placeholder={t('contracts:contractDateOfSigningPlaceholder')}
                                    errorMessage={t('contracts:contractDateOfSigningErrorMessage')}
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
                                    onChange={(value: Date | undefined) => setDateOfSigning(value)} />
                                <Button
                                    title={t('contracts:contractCreateButton')}
                                    type="submit"
                                    rounded />
                            </FormContextProvider>
                        </div>
                    </div>
                    <div className={`w-full ${hidden ? '' : 'lg:w-2/3'}`}>
                        <Products
                            products={products}
                            messages={{
                                noDataFound: t('contracts:dataNotFound')
                            }}
                            searchOptions={{ placeholder: t('contracts:searchPlaceholder'), onChange: (value: string) => setSearch(value) }}
                            sortByOptions={[
                                { title: t('contracts:sortAscByTitle'), value: 'ascByTitle' },
                                { title: t('contracts:sortDescByTitle'), value: 'descByTitle' }
                            ]}
                            onSortByChange={(value: string) => setSort(value)} />
                    </div>
                </div>
                <ContractUpdate
                    buildings={buildings}
                    data={data}
                    selected={selectedContractUpdate}
                    invoke={updateContract} />
                <ContractDelete
                    data={data}
                    selected={selectedContractDelete}
                    invoke={deleteContract} />
            </Background>
        </MainLayout>
    )
}

interface ContractUpdateProps {
    buildings: { label: string, value: string }[]
    data: Contract[]
    selected: { value: string | undefined } | undefined
    invoke: (id: string, description: string, contractNumber: string, title: string, type: string, dateOfSigning: Date) => void
}

const ContractUpdate: FunctionComponent<ContractUpdateProps> = ({ buildings, data, selected, invoke }: ContractUpdateProps) => {
    const { t } = useTranslation()

    const [buildingId, setBuildingId] = useState<string | undefined>(undefined)
    const [description, setDescription] = useState<string | undefined>(undefined)
    const [contractNumber, setContractNumber] = useState<string | undefined>(undefined)
    const [title, setTitle] = useState<string | undefined>(undefined)
    const [type, setType] = useState<string | undefined>(undefined)
    const [dateOfSigning, setDateOfSigning] = useState<Date | undefined>(undefined)
    const [isOpen, setIsOpen] = useState<boolean>(false)

    useEffect(() => {
        const item = data.find(x => x.id === selected?.value)
        if (item) {
            setBuildingId(item.buildingId)
            setDescription(item.description)
            setContractNumber(item.contractNumber)
            setTitle(item.title)
            setType(String(item.type))
            setDateOfSigning(new Date(item.dateOfSigning))
            setIsOpen(!isOpen)
        }
    }, [selected])

    const onSubmit = () => {
        if (selected?.value && description && contractNumber && title && type && dateOfSigning) {
            invoke(
                selected.value,
                description,
                contractNumber,
                title,
                type,
                dateOfSigning
            )
            setIsOpen(!isOpen)
        }
    }

    return (
        <Modal
            title={t('contracts:contractUpdateModal')}
            isOpen={isOpen}
            onClick={(value: boolean) => setIsOpen(value)}>
            <FormContextProvider onSubmit={onSubmit}>
                <Select
                    label={t('contracts:contractBuilding')}
                    defaultValue={buildingId}
                    disabled={true}
                    options={[...buildings]} />
                <Input
                    label={t('contracts:contractContractNumber')}
                    defaultValue={contractNumber}
                    placeholder={t('contracts:contractContractNumberPlaceholder')}
                    errorMessage={t('contracts:contractContractNumberErrorMessage')}
                    required
                    minLength={1}
                    maxLength={32}
                    onChange={(value: string | undefined) => setContractNumber(value)} />
                <Input
                    label={t('contracts:contractTitle')}
                    defaultValue={title}
                    placeholder={t('contracts:contractTitlePlaceholder')}
                    errorMessage={t('contracts:contractTitleErrorMessage')}
                    required
                    minLength={1}
                    maxLength={64}
                    onChange={(value: string | undefined) => setTitle(value)} />
                <Textarea
                    label={t('contracts:contractDescription')}
                    defaultValue={description}
                    placeholder={t('contracts:contractDescriptionPlaceholder')}
                    errorMessage={t('contracts:contractDescriptionErrorMessage')}
                    required
                    minLength={1}
                    maxLength={512}
                    onChange={(value: string | undefined) => setDescription(value)} />
                <Select
                    label={t('contracts:contractType')}
                    defaultValue={type}
                    errorMessage={t('contracts:contractTypeErrorMessage')}
                    required
                    options={[
                        { label: t('contracts:contractTypeCivil'), value: '0' },
                        { label: t('contracts:contractTypeSale'), value: '1' },
                        { label: t('contracts:contractTypeSupply'), value: '2' },
                        { label: t('contracts:contractTypeExecutive'), value: '3' },
                        { label: t('contracts:contractTypeLiability'), value: '4' },
                        { label: t('contracts:contractTypeCooperation'), value: '5' },
                        { label: t('contracts:contractTypeManagement'), value: '6' },
                        { label: t('contracts:contractTypeMemorandum'), value: '7' },
                        { label: t('contracts:contractTypeLease'), value: '8' }
                    ]}
                    onChange={(value: string | undefined) => setType(value)} />
                <DayPicker
                    label={t('contracts:contractDateOfSigning')}
                    defaultValue={dateOfSigning}
                    placeholder={t('contracts:contractDateOfSigningPlaceholder')}
                    errorMessage={t('contracts:contractDateOfSigningErrorMessage')}
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
                    onChange={(value: Date | undefined) => setDateOfSigning(value)} />
                <Button
                    title={t('contracts:contractUpdateModalButton')}
                    type="submit"
                    rounded />
            </FormContextProvider>
        </Modal>
    )
}

interface ContractDeleteProps {
    data: Contract[]
    selected: { value: string | undefined } | undefined
    invoke: (id: string) => void
}

const ContractDelete: FunctionComponent<ContractDeleteProps> = ({ data, selected, invoke }: ContractDeleteProps) => {
    const { t } = useTranslation()

    const [choice, setChoice] = useState<string | undefined>(undefined)
    const [isOpen, setIsOpen] = useState<boolean>(false)

    useEffect(() => {
        const item = data.find(x => x.id === selected?.value)
        if (item) {
            setIsOpen(!isOpen)
        }
    }, [selected])

    const onSubmit = () => {
        if (selected?.value && choice) {
            invoke(selected.value)
            setIsOpen(!isOpen)
        }
    }

    return (
        <Modal
            title={t('contracts:contractDeleteModal')}
            isOpen={isOpen}
            onClick={(value: boolean) => setIsOpen(value)}>
            <FormContextProvider onSubmit={onSubmit}>
                <Select
                    label={t('contracts:contractDelete')}
                    defaultValue={'none'}
                    errorMessage={t('contracts:contractDeleteErrorMessage')}
                    required
                    options={[
                        { label: t('contracts:contractDeleteNone'), value: 'none', disabled: true },
                        { label: t('contracts:contractDeleteAgree'), value: '0' }
                    ]}
                    onChange={(value: string | undefined) => setChoice(value)} />
                <Button
                    title={t('contracts:contractDeleteModalButton')}
                    type="submit"
                    rounded />
            </FormContextProvider>
        </Modal>
    )
}

export default Index

export const getServerSideProps = withPageAuthRequired()
