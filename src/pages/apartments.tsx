import React, { FunctionComponent, useState, useEffect, useMemo } from 'react'
import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import useTranslation from 'next-translate/useTranslation'
import { MenuAlt1Icon, CogIcon, TrashIcon } from '@heroicons/react/outline'
import { toFormatMonth } from '@/utils/helpers'
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
import Building from '@/models/building'
import Apartment from '@/models/apartment'
import Person from '@/models/person'
import Account from '@/models/account'
import Invoice from '@/models/invoice'
import buildingsJson from '@/jsons/buildings.json'
import apartmentsJson from '@/jsons/apartments.json'
import personsJson from '@/jsons/persons.json'
import accountsJson from '@/jsons/accounts.json'
import invoicesJson from '@/jsons/invoices.json'
import MonthPicker from '@/components/monthpickers'

const Index = () => {
    const { t, lang } = useTranslation()
    const { notify } = useToast()

    const [hidden, setHidden] = useState<boolean>(false)
    const [search, setSearch] = useState<string>('')
    const [sort, setSort] = useState<string>('ascByApartmentNumber')
    const [buildings] = useState<{ label: string, value: string }[]>(() => (Object.values(JSON.parse(JSON.stringify(buildingsJson))) as Building[]).map(x => { return { label: x.legalAddress, value: x.id } }))
    const [data, setData] = useState<Apartment[]>(() => Object.values(JSON.parse(JSON.stringify(apartmentsJson))) as Apartment[])
    const [persons, setPersons] = useState<Person[]>(() => Object.values(JSON.parse(JSON.stringify(personsJson))) as Person[])
    const [accounts, setAccounts] = useState<Account[]>(() => Object.values(JSON.parse(JSON.stringify(accountsJson))) as Account[])
    const [invoices, setInvoices] = useState<Invoice[]>(() => Object.values(JSON.parse(JSON.stringify(invoicesJson))) as Invoice[])
    const [selectedApartmentUpdate, setSelectedApartmentUpdate] = useState<{ value: string | undefined }>()
    const [selectedPersonUpdate, setSelectedPersonUpdate] = useState<{ value: string | undefined }>()
    const [selectedPersonDelete, setSelectedPersonDelete] = useState<{ value: string | undefined }>()
    const [selectedAccountUpdate, setSelectedAccountUpdate] = useState<{ value: string | undefined }>()
    const [selectedInvoiceUpdate, setSelectedInvoiceUpdate] = useState<{ value: string | undefined }>()

    const [apartmentId, setApartmentId] = useState<string | undefined>(undefined)
    const [firstName, setFirstName] = useState<string | undefined>(undefined)
    const [secondName, setSecondName] = useState<string | undefined>(undefined)
    const [middleName, setMiddleName] = useState<string | undefined>(undefined)
    const [gender, setGender] = useState<string | undefined>(undefined)
    const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(undefined)
    const [phoneNumber, setPhoneNumber] = useState<string | undefined>(undefined)
    const [email, setEmail] = useState<string | undefined>(undefined)
    const [date, setDate] = useState<Date | undefined>(undefined)
    const [ownershipPercentage, setOwnershipPercentage] = useState<number | undefined>(undefined)
    const [remark, setRemark] = useState<string | undefined>(undefined)

    useEffect(() => {
        const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' })
        switch (sort) {
            case 'ascByApartmentNumber': {
                setData([...data.sort((x, y) => collator.compare(x.apartmentNumber, y.apartmentNumber))])
                break
            }
            case 'descByApartmentNumber': {
                setData([...data.sort((x, y) => collator.compare(y.apartmentNumber, x.apartmentNumber))])
                break
            }
        }
    }, [sort])
    const products = useMemo<{ id: string, question: string, answer: JSX.Element }[]>(() => {
        const filteredData = search === '' ? data : data.filter(x => (`${buildings.find(y => y.value === x.buildingId)?.label}, №${x.apartmentNumber}`).toLowerCase().indexOf(search.toLowerCase()) > -1)
        return filteredData.map(x => {
            return {
                id: x.id,
                question: `${buildings.find(y => y.value === x.buildingId)?.label}, №${x.apartmentNumber}`,
                answer: (() => {
                    const accountTypes = [
                        { label: t('apartments:accountTypeBuildingMaintenance'), value: '0' },
                        { label: t('apartments:accountTypeRemovalOfWaste'), value: '1' },
                        { label: t('apartments:accountTypeWaterSupply'), value: '2' },
                        { label: t('apartments:accountTypeElectricitySupply'), value: '3' }
                    ]
                    const list = [
                        { title: t('apartments:apartmentPhoneNumber'), content: <div className="text-sm text-gray-500">{x.phoneNumber ?? t('apartments:apartmentPhoneNumberNone')}</div> },
                        { title: t('apartments:apartmentFloor'), content: <div className="text-sm text-gray-500">{x.floor ?? t('apartments:apartmentFloorNone')}</div> },
                        { title: t('apartments:apartmentEntranceNumber'), content: <div className="text-sm text-gray-500">{x.entranceNumber ?? t('apartments:apartmentEntranceNumberNone')}</div> },
                        { title: t('apartments:apartmentArea'), content: <div className="text-sm text-gray-500">{x.area.toFixed(2)}</div> },
                        { title: t('apartments:apartmentRemark'), content: <div className="text-sm text-gray-500">{x.remark ?? t('apartments:apartmentRemarkNone')}</div> }
                    ]
                    const personsColumns = [
                        t('apartments:datatablePersonName'),
                        t('apartments:datatablePersonPhoneNumber'),
                        undefined
                    ]
                    const personsRows = persons.filter(y => y.apartmentId === x.id).map(y => {
                        return [
                            `${y.secondName} ${y.firstName} ${y.middleName ?? ''}`.trimEnd(),
                            y.phoneNumber ?? t('apartments:datatablePersonPhoneNumberNone'),
                            (
                                <span className="flex flex-row items-center justify-end space-x-2">
                                    <button
                                        className="outline-none cursor-pointer appearance-none focus:outline-none flex-shrink-0">
                                        <CogIcon
                                            className="w-6 h-6 text-gray-500"
                                            onClick={() => setSelectedPersonUpdate({ ...{ value: y.id } })} />
                                    </button>
                                    <button
                                        className="outline-none cursor-pointer appearance-none focus:outline-none flex-shrink-0">
                                        <TrashIcon
                                            className="w-6 h-6 text-gray-500"
                                            onClick={() => setSelectedPersonDelete({ ...{ value: y.id } })} />
                                    </button>
                                </span>
                            )
                        ]
                    }) ?? []
                    const accountsColumns = [
                        t('apartments:datatableAccountType'),
                        t('apartments:datatableAccountBalance'),
                        undefined
                    ]
                    const accountsRows = accounts.filter(y => y.apartmentId === x.id).map(y => {
                        return [
                            accountTypes.find(z => z.value === String(y.type))?.label,
                            y.balance.toFixed(2),
                            (
                                <span className="flex flex-row items-center justify-end">
                                    <button
                                        className="outline-none cursor-pointer appearance-none focus:outline-none flex-shrink-0">
                                        <CogIcon
                                            className="w-6 h-6 text-gray-500"
                                            onClick={() => setSelectedAccountUpdate({ ...{ value: y.id } })} />
                                    </button>
                                </span>
                            )
                        ]
                    }) ?? []
                    const invoicesColumns = [
                        t('apartments:datatableInvoicesType'),
                        t('apartments:datatableInvoicesDate'),
                        t('apartments:datatableInvoicesTotal'),
                        undefined
                    ]
                    const invoicesRows = invoices.filter(y => y.apartmentId === x.id).map(y => {
                        return [
                            accountTypes.find(z => z.value === String(y.type))?.label,
                            toFormatMonth(new Date(y.date)),
                            y.total.toFixed(2),
                            (
                                <span className="flex flex-row items-center justify-end">
                                    <button
                                        className="outline-none cursor-pointer appearance-none focus:outline-none flex-shrink-0">
                                        <CogIcon
                                            className="w-6 h-6 text-gray-500"
                                            onClick={() => setSelectedInvoiceUpdate({ ...{ value: y.id } })} />
                                    </button>
                                </span>
                            )
                        ]
                    }) ?? []

                    return (
                        <div className="flex flex-col space-y-4">
                            <List items={list} />
                            <Button
                                title={t('apartments:apartmentUpdateButton')}
                                type="button"
                                rounded
                                onClick={() => setSelectedApartmentUpdate({ ...{ value: x.id } })} />
                            <div className="text-center text-xs font-bold tracking-wider text-gray-900 uppercase dark:text-white">{t('apartments:datatablePersons')}</div>
                            <Datatable
                                columns={personsColumns}
                                rows={personsRows}
                                messages={{
                                    noDataFound: t('apartments:dataNotFound'),
                                    previous: t('apartments:previous'),
                                    next: t('apartments:next'),
                                    page: t('apartments:page'),
                                    select: t('apartments:select')
                                }} />
                            <div className="text-center text-xs font-bold tracking-wider text-gray-900 uppercase dark:text-white">{t('apartments:datatableAccounts')}</div>
                            <Datatable
                                columns={accountsColumns}
                                rows={accountsRows}
                                messages={{
                                    noDataFound: t('apartments:dataNotFound'),
                                    previous: t('apartments:previous'),
                                    next: t('apartments:next'),
                                    page: t('apartments:page'),
                                    select: t('apartments:select')
                                }} />
                            <div className="text-center text-xs font-bold tracking-wider text-gray-900 uppercase dark:text-white">{t('apartments:datatableInvoices')}</div>
                            <Datatable
                                columns={invoicesColumns}
                                rows={invoicesRows}
                                messages={{
                                    noDataFound: t('apartments:dataNotFound'),
                                    previous: t('apartments:previous'),
                                    next: t('apartments:next'),
                                    page: t('apartments:page'),
                                    select: t('apartments:select')
                                }} />
                        </div>
                    )
                })()
            }
        })
    }, [data, persons, accounts, invoices, search, lang])

    const updateApartment = (id: string, phoneNumber: string | undefined, floor: string | undefined, entranceNumber: string | undefined, remark: string | undefined) => {
        const item = data.find(x => x.id === id)
        if (item) {
            item.phoneNumber = phoneNumber
            item.floor = floor
            item.entranceNumber = entranceNumber
            item.remark = remark
            setData([...data])
            notify(t('apartments:toastUpdate'))
        }
    }
    const createPerson = (apartmentId: string, firstName: string, secondName: string, middleName: string | undefined, gender: string, dateOfBirth: Date | undefined, phoneNumber: string | undefined, email: string | undefined, date: Date, ownershipPercentage: number, remark: string | undefined) => {
        const item = data.find(x => x.id === apartmentId)
        if (item) {
            const person = {
                id: persons.length.toString(),
                firstName: firstName,
                secondName: secondName,
                middleName: middleName,
                gender: Number(gender),
                dateOfBirth: dateOfBirth,
                phoneNumber: phoneNumber,
                email: email,
                date: date.toString(),
                ownershipPercentage: ownershipPercentage,
                remark: remark
            } as Person
            persons.push(person)
            setPersons([...persons])
            notify(t('apartments:toastCreate'))
        }
    }
    const updatePerson = (id: string, firstName: string, secondName: string, middleName: string | undefined, gender: string, dateOfBirth: Date | undefined, phoneNumber: string | undefined, email: string | undefined, date: Date, ownershipPercentage: number, remark: string | undefined) => {
        const item = persons.find(x => x.id === id)
        if (item) {
            item.firstName = firstName
            item.secondName = secondName
            item.middleName = middleName
            item.gender = Number(gender)
            item.dateOfBirth = dateOfBirth?.toString()
            item.phoneNumber = phoneNumber
            item.email = email
            item.date = date?.toString()
            item.ownershipPercentage = ownershipPercentage
            item.remark = remark
            setPersons([...persons])
            notify(t('apartments:toastUpdate'))
        }
    }
    const deletePerson = (id: string) => {
        const item = persons.find(y => y.id === id)
        if (item) {
            setPersons([...persons.filter(x => x.id !== id)])
            notify(t('apartments:toastDelete'))
        }
    }
    const updateAccount = (id: string, accountNumber: string | undefined, balance: number, indicator: number) => {
        const item = accounts.find(x => x.id === id)
        if (item) {
            item.accountNumber = accountNumber
            item.balance = balance
            item.indicator = indicator
            setAccounts([...accounts])
            notify(t('apartments:toastUpdate'))
        }
    }
    const updateInvoice = (id: string, accountNumber: string, balance: number, indicator: number, total: number) => {
        const item = invoices.find(x => x.id === id)
        if (item) {
            item.accountNumber = accountNumber
            item.balance = balance
            item.indicator = indicator
            item.total = total
            setInvoices([...invoices])
            notify(t('apartments:toastUpdate'))
        }
    }

    const onSubmit = () => {
        if (apartmentId && firstName && secondName && gender && phoneNumber && email && date && ownershipPercentage) {
            createPerson(
                apartmentId,
                firstName,
                secondName,
                middleName,
                gender,
                dateOfBirth,
                phoneNumber,
                email,
                date,
                ownershipPercentage,
                remark
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
                                <div className="text-xs font-light tracking-wide uppercase text-gray-500">{t('apartments:personCreate')}</div>
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
                                    label={t('apartments:personApartment')}
                                    errorMessage={t('apartments:personApartmentErrorMessage')}
                                    defaultValue={'none'}
                                    required
                                    options={[
                                        { label: t('apartments:personApartmentNone'), value: 'none', disabled: true },
                                        ...data.map(x => { return { label: (`${buildings.find(y => y.value === x.buildingId)?.label}, №${x.apartmentNumber}`), value: x.id } })
                                    ]}
                                    onChange={(value: string | undefined) => setApartmentId(value)} />
                                <Input
                                    label={t('apartments:personFirstName')}
                                    placeholder={t('apartments:personFirstNamePlaceholder')}
                                    errorMessage={t('apartments:personFirstNameErrorMessage')}
                                    required
                                    minLength={1}
                                    maxLength={64}
                                    onChange={(value: string | undefined) => setFirstName(value)} />
                                <Input
                                    label={t('apartments:personSecondName')}
                                    placeholder={t('apartments:personSecondNamePlaceholder')}
                                    errorMessage={t('apartments:personSecondNameErrorMessage')}
                                    required
                                    minLength={1}
                                    maxLength={64}
                                    onChange={(value: string | undefined) => setSecondName(value)} />
                                <Input
                                    label={t('apartments:personMiddleName')}
                                    placeholder={t('apartments:personMiddleNamePlaceholder')}
                                    errorMessage={t('apartments:personMiddleNameErrorMessage')}
                                    minLength={0}
                                    maxLength={64}
                                    onChange={(value: string | undefined) => setMiddleName(value)} />
                                <Select
                                    label={t('apartments:personGender')}
                                    defaultValue={'0'}
                                    required
                                    options={[
                                        { label: t('apartments:personGenderUnknown'), value: '0' },
                                        { label: t('apartments:personGenderMale'), value: '1' },
                                        { label: t('apartments:personGenderFemale'), value: '2' }
                                    ]}
                                    onChange={(value: string | undefined) => setGender(value)} />
                                <DayPicker
                                    label={t('apartments:personDateOfBirth')}
                                    placeholder={t('apartments:personDateOfBirthPlaceholder')}
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
                                    onChange={(value: Date | undefined) => setDateOfBirth(value)} />
                                <Input
                                    label={t('apartments:personPhoneNumber')}
                                    placeholder={t('apartments:personPhoneNumberPlaceholder')}
                                    errorMessage={t('apartments:personPhoneNumberErrorMessage')}
                                    minLength={0}
                                    maxLength={32}
                                    onChange={(value: string | undefined) => setPhoneNumber(value)} />
                                <Input
                                    label={t('apartments:personEmail')}
                                    placeholder={t('apartments:personEmailPlaceholder')}
                                    errorMessage={t('apartments:personEmailErrorMessage')}
                                    minLength={0}
                                    maxLength={128}
                                    onChange={(value: string | undefined) => setEmail(value)} />
                                <DayPicker
                                    label={t('apartments:personDate')}
                                    placeholder={t('apartments:personDatePlaceholder')}
                                    errorMessage={t('apartments:personDateErrorMessage')}
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
                                    onChange={(value: Date | undefined) => setDate(value)} />
                                <Numeric
                                    label={t('apartments:personOwnershipPercentage')}
                                    placeholder={t('apartments:personOwnershipPercentagePlaceholder')}
                                    errorMessage={t('apartments:personOwnershipPercentageErrorMessage')}
                                    allowDouble
                                    required
                                    onChange={(value: number | undefined) => setOwnershipPercentage(value)} />
                                <Textarea
                                    label={t('apartments:personRemark')}
                                    placeholder={t('apartments:personRemarkPlaceholder')}
                                    errorMessage={t('apartments:personRemarkErrorMessage')}
                                    minLength={0}
                                    maxLength={1024}
                                    onChange={(value: string | undefined) => setRemark(value)} />
                                <Button
                                    title={t('apartments:personCreateButton')}
                                    type="submit"
                                    rounded />
                            </FormContextProvider>
                        </div>
                    </div>
                    <div className={`w-full ${hidden ? '' : 'lg:w-2/3'}`}>
                        <Products
                            products={products}
                            messages={{
                                noDataFound: t('apartments:dataNotFound')
                            }}
                            searchOptions={{ placeholder: t('apartments:searchPlaceholder'), onChange: (value: string) => setSearch(value) }}
                            sortByOptions={[
                                { title: t('apartments:sortAscByTitle'), value: 'ascByApartmentNumber' },
                                { title: t('apartments:sortDescByTitle'), value: 'descByApartmentNumber' }
                            ]}
                            onSortByChange={(value: string) => setSort(value)} />
                    </div>
                </div>
                <ApartmentUpdate
                    buildings={buildings}
                    data={data}
                    selected={selectedApartmentUpdate}
                    invoke={updateApartment} />
                <PersonUpdate
                    buildings={buildings}
                    data={data}
                    persons={persons}
                    selected={selectedPersonUpdate}
                    invoke={updatePerson} />
                <PersonDelete
                    persons={persons}
                    selected={selectedPersonDelete}
                    invoke={deletePerson} />
                <AccountUpdate
                    buildings={buildings}
                    data={data}
                    accounts={accounts}
                    selected={selectedAccountUpdate}
                    invoke={updateAccount} />
                <InvoiceUpdate
                    buildings={buildings}
                    data={data}
                    invoices={invoices}
                    selected={selectedInvoiceUpdate}
                    invoke={updateInvoice} />
            </Background>
        </MainLayout>
    )
}

interface ApartmentUpdateProps {
    buildings: { label: string, value: string }[]
    data: Apartment[]
    selected: { value: string | undefined } | undefined
    invoke: (id: string, phoneNumber: string | undefined, floor: string | undefined, entranceNumber: string | undefined, remark: string | undefined) => void
}

const ApartmentUpdate: FunctionComponent<ApartmentUpdateProps> = ({ buildings, data, selected, invoke }: ApartmentUpdateProps) => {
    const { t } = useTranslation()

    const [buildingId, setBuildingId] = useState<string | undefined>(undefined)
    const [apartmentNumber, setApartmentNumber] = useState<string | undefined>(undefined)
    const [phoneNumber, setPhoneNumber] = useState<string | undefined>(undefined)
    const [floor, setFloor] = useState<string | undefined>(undefined)
    const [entranceNumber, setEntranceNumber] = useState<string | undefined>(undefined)
    const [area, setArea] = useState<number | undefined>(undefined)
    const [remark, setRemark] = useState<string | undefined>(undefined)
    const [isOpen, setIsOpen] = useState<boolean>(false)

    useEffect(() => {
        const item = data.find(x => x.id === selected?.value)
        if (item) {
            setBuildingId(item.buildingId)
            setApartmentNumber(item.apartmentNumber)
            setPhoneNumber(item.phoneNumber)
            setFloor(item.floor)
            setEntranceNumber(item.entranceNumber)
            setArea(item.area)
            setRemark(item.remark)
            setIsOpen(!isOpen)
        }
    }, [selected])

    const onSubmit = () => {
        if (selected?.value) {
            invoke(
                selected.value,
                phoneNumber,
                floor,
                entranceNumber,
                remark
            )
            setIsOpen(!isOpen)
        }
    }

    return (
        <Modal
            title={t('apartments:apartmentUpdateModal')}
            isOpen={isOpen}
            onClick={(value: boolean) => setIsOpen(value)}>
            <FormContextProvider onSubmit={onSubmit}>
                <Select
                    label={t('apartments:apartmentBuilding')}
                    defaultValue={buildingId}
                    disabled
                    options={[...buildings]} />
                <Input
                    label={t('apartments:apartmentApartmentNumber')}
                    defaultValue={apartmentNumber}
                    disabled />
                <Input
                    label={t('apartments:apartmentPhoneNumber')}
                    defaultValue={phoneNumber}
                    placeholder={t('apartments:apartmentPhoneNumberPlaceholder')}
                    errorMessage={t('apartments:apartmentPhoneNumberErrorMessage')}
                    minLength={0}
                    maxLength={32}
                    onChange={(value: string | undefined) => setPhoneNumber(value)} />
                <Input
                    label={t('apartments:apartmentFloor')}
                    defaultValue={phoneNumber}
                    placeholder={t('apartments:apartmentFloorPlaceholder')}
                    errorMessage={t('apartments:apartmentFloorErrorMessage')}
                    minLength={0}
                    maxLength={32}
                    onChange={(value: string | undefined) => setFloor(value)} />
                <Input
                    label={t('apartments:apartmentEntranceNumber')}
                    defaultValue={phoneNumber}
                    placeholder={t('apartments:apartmentEntranceNumberPlaceholder')}
                    errorMessage={t('apartments:apartmentEntranceNumberErrorMessage')}
                    minLength={0}
                    maxLength={32}
                    onChange={(value: string | undefined) => setEntranceNumber(value)} />
                <Numeric
                    label={t('apartments:apartmentArea')}
                    defaultValue={area?.toFixed(2)}
                    disabled />
                <Textarea
                    label={t('apartments:apartmentRemark')}
                    defaultValue={remark}
                    placeholder={t('apartments:apartmentRemarkPlaceholder')}
                    errorMessage={t('apartments:apartmentRemarkErrorMessage')}
                    minLength={0}
                    maxLength={1024}
                    onChange={(value: string | undefined) => setRemark(value)} />
                <Button
                    title={t('apartments:apartmentUpdateModalButton')}
                    type="submit"
                    rounded />
            </FormContextProvider>
        </Modal>
    )
}

interface PersonUpdateProps {
    buildings: { label: string, value: string }[]
    data: Apartment[]
    persons: Person[]
    selected: { value: string | undefined } | undefined
    invoke: (id: string, firstName: string, secondName: string, middleName: string | undefined, gender: string, dateOfBirth: Date | undefined, phoneNumber: string | undefined, email: string | undefined, date: Date, ownershipPercentage: number, remark: string | undefined) => void
}

const PersonUpdate: FunctionComponent<PersonUpdateProps> = ({ buildings, data, persons, selected, invoke }: PersonUpdateProps) => {
    const { t } = useTranslation()

    const [buildingId, setBuildingId] = useState<string | undefined>(undefined)
    const [apartmentId, setApartmentId] = useState<string | undefined>(undefined)
    const [firstName, setFirstName] = useState<string | undefined>(undefined)
    const [secondName, setSecondName] = useState<string | undefined>(undefined)
    const [middleName, setMiddleName] = useState<string | undefined>(undefined)
    const [gender, setGender] = useState<string | undefined>(undefined)
    const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(undefined)
    const [phoneNumber, setPhoneNumber] = useState<string | undefined>(undefined)
    const [email, setEmail] = useState<string | undefined>(undefined)
    const [date, setDate] = useState<Date | undefined>(undefined)
    const [ownershipPercentage, setOwnershipPercentage] = useState<number | undefined>(undefined)
    const [remark, setRemark] = useState<string | undefined>(undefined)
    const [isOpen, setIsOpen] = useState<boolean>(false)

    useEffect(() => {
        const item = persons.find(x => x.id === selected?.value)
        if (item) {
            setBuildingId(data.find(x => x.id === item.apartmentId)?.buildingId)
            setApartmentId(item.apartmentId)
            setFirstName(item.firstName)
            setSecondName(item.secondName)
            setMiddleName(item.middleName)
            setGender(String(item.gender))
            setDateOfBirth(item.dateOfBirth ? new Date(item.dateOfBirth) : undefined)
            setPhoneNumber(item.phoneNumber)
            setEmail(item.email)
            setDate(new Date(item.date))
            setOwnershipPercentage(item.ownershipPercentage)
            setRemark(item.remark)
            setIsOpen(!isOpen)
        }
    }, [selected])

    const onSubmit = () => {
        if (selected?.value && firstName && secondName && gender && phoneNumber && email && date && ownershipPercentage) {
            invoke(
                selected.value,
                firstName,
                secondName,
                middleName,
                gender,
                dateOfBirth,
                phoneNumber,
                email,
                date,
                ownershipPercentage,
                remark
            )
            setIsOpen(!isOpen)
        }
    }

    return (
        <Modal
            title={t('apartments:personUpdateModal')}
            isOpen={isOpen}
            onClick={(value: boolean) => setIsOpen(value)}>
            <FormContextProvider onSubmit={onSubmit}>
                <Select
                    label={t('apartments:personBuilding')}
                    defaultValue={buildingId}
                    disabled
                    options={[...buildings]}
                    onChange={(value: string | undefined) => setBuildingId(value)} />
                <Select
                    label={t('apartments:personApartment')}
                    defaultValue={apartmentId}
                    disabled
                    options={[...data.map(x => { return { label: (`${buildings.find(y => y.value === x.buildingId)?.label}, №${x.apartmentNumber}`), value: x.id } })]}
                    onChange={(value: string | undefined) => setApartmentId(value)} />
                <Input
                    label={t('apartments:personFirstName')}
                    defaultValue={firstName}
                    placeholder={t('apartments:personFirstNamePlaceholder')}
                    errorMessage={t('apartments:personFirstNameErrorMessage')}
                    required
                    minLength={1}
                    maxLength={64}
                    onChange={(value: string | undefined) => setFirstName(value)} />
                <Input
                    label={t('apartments:personSecondName')}
                    defaultValue={secondName}
                    placeholder={t('apartments:personSecondNamePlaceholder')}
                    errorMessage={t('apartments:personSecondNameErrorMessage')}
                    required
                    minLength={1}
                    maxLength={64}
                    onChange={(value: string | undefined) => setSecondName(value)} />
                <Input
                    label={t('apartments:personMiddleName')}
                    defaultValue={middleName}
                    placeholder={t('apartments:personMiddleNamePlaceholder')}
                    errorMessage={t('apartments:personMiddleNameErrorMessage')}
                    minLength={0}
                    maxLength={64}
                    onChange={(value: string | undefined) => setMiddleName(value)} />
                <Select
                    label={t('apartments:personGender')}
                    defaultValue={gender}
                    required
                    options={[
                        { label: t('apartments:personGenderUnknown'), value: '0' },
                        { label: t('apartments:personGenderMale'), value: '1' },
                        { label: t('apartments:personGenderFemale'), value: '2' }
                    ]}
                    onChange={(value: string | undefined) => setGender(value)} />
                <DayPicker
                    label={t('apartments:personDateOfBirth')}
                    defaultValue={dateOfBirth}
                    placeholder={t('apartments:personDateOfBirthPlaceholder')}
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
                    onChange={(value: Date | undefined) => setDateOfBirth(value)} />
                <Input
                    label={t('apartments:personPhoneNumber')}
                    defaultValue={phoneNumber}
                    placeholder={t('apartments:personPhoneNumberPlaceholder')}
                    errorMessage={t('apartments:personPhoneNumberErrorMessage')}
                    minLength={0}
                    maxLength={32}
                    onChange={(value: string | undefined) => setPhoneNumber(value)} />
                <Input
                    label={t('apartments:personEmail')}
                    defaultValue={email}
                    placeholder={t('apartments:personEmailPlaceholder')}
                    errorMessage={t('apartments:personEmailErrorMessage')}
                    minLength={0}
                    maxLength={128}
                    onChange={(value: string | undefined) => setEmail(value)} />
                <DayPicker
                    label={t('apartments:personDate')}
                    defaultValue={date}
                    placeholder={t('apartments:personDatePlaceholder')}
                    errorMessage={t('apartments:personDateErrorMessage')}
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
                    onChange={(value: Date | undefined) => setDate(value)} />
                <Numeric
                    label={t('apartments:personOwnershipPercentage')}
                    defaultValue={ownershipPercentage?.toFixed(2)}
                    placeholder={t('apartments:personOwnershipPercentagePlaceholder')}
                    errorMessage={t('apartments:personOwnershipPercentageErrorMessage')}
                    allowDouble
                    required
                    onChange={(value: number | undefined) => setOwnershipPercentage(value)} />
                <Textarea
                    label={t('apartments:personRemark')}
                    defaultValue={remark}
                    placeholder={t('apartments:personRemarkPlaceholder')}
                    errorMessage={t('apartments:personRemarkErrorMessage')}
                    minLength={0}
                    maxLength={1024}
                    onChange={(value: string | undefined) => setRemark(value)} />
                <Button
                    title={t('apartments:personUpdateModalButton')}
                    type="submit"
                    rounded />
            </FormContextProvider>
        </Modal>
    )
}

interface PersonDeleteProps {
    persons: Person[]
    selected: { value: string | undefined } | undefined
    invoke: (id: string) => void
}

const PersonDelete: FunctionComponent<PersonDeleteProps> = ({ persons, selected, invoke }: PersonDeleteProps) => {
    const { t } = useTranslation()

    const [choice, setChoice] = useState<string | undefined>(undefined)
    const [isOpen, setIsOpen] = useState<boolean>(false)

    useEffect(() => {
        const item = persons.find(x => x.id === selected?.value)
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
            title={t('apartments:personDeleteModal')}
            isOpen={isOpen}
            onClick={(value: boolean) => setIsOpen(value)}>
            <FormContextProvider onSubmit={onSubmit}>
                <Select
                    label={t('apartments:personDelete')}
                    defaultValue={'none'}
                    errorMessage={t('apartments:personDeleteErrorMessage')}
                    required
                    options={[
                        { label: t('apartments:personDeleteNone'), value: 'none', disabled: true },
                        { label: t('apartments:personDeleteAgree'), value: '0' }
                    ]}
                    onChange={(value: string | undefined) => setChoice(value)} />
                <Button
                    title={t('apartments:personDeleteModalButton')}
                    type="submit"
                    rounded />
            </FormContextProvider>
        </Modal>
    )
}

interface AccountUpdateProps {
    buildings: { label: string, value: string }[]
    data: Apartment[]
    accounts: Account[]
    selected: { value: string | undefined } | undefined
    invoke: (id: string, accountNumber: string | undefined, balance: number, indicator: number) => void
}

const AccountUpdate: FunctionComponent<AccountUpdateProps> = ({ buildings, data, accounts, selected, invoke }: AccountUpdateProps) => {
    const { t } = useTranslation()

    const [buildingId, setBuildingId] = useState<string | undefined>(undefined)
    const [apartmentId, setApartmentId] = useState<string | undefined>(undefined)
    const [type, setType] = useState<string | undefined>(undefined)
    const [accountNumber, setAccountNumber] = useState<string | undefined>(undefined)
    const [balance, setBalance] = useState<number | undefined>(undefined)
    const [indicator, setIndicator] = useState<number | undefined>(undefined)
    const [isOpen, setIsOpen] = useState<boolean>(false)

    useEffect(() => {
        const item = accounts.find(x => x.id === selected?.value)
        if (item) {
            setBuildingId(data.find(x => x.id === item.apartmentId)?.buildingId)
            setApartmentId(item.apartmentId)
            setType(String(item.type))
            setAccountNumber(item.accountNumber)
            setBalance(item.balance)
            setIndicator(item.indicator)
            setIsOpen(!isOpen)
        }
    }, [selected])

    const onSubmit = () => {
        if (selected?.value && balance && indicator) {
            invoke(
                selected.value,
                accountNumber,
                balance,
                indicator
            )
            setIsOpen(!isOpen)
        }
    }

    return (
        <Modal
            title={t('apartments:accountUpdateModal')}
            isOpen={isOpen}
            onClick={(value: boolean) => setIsOpen(value)}>
            <FormContextProvider onSubmit={onSubmit}>
                <Select
                    label={t('apartments:accountBuilding')}
                    defaultValue={buildingId}
                    disabled
                    options={[...buildings]} />
                <Select
                    label={t('apartments:personApartment')}
                    defaultValue={apartmentId}
                    disabled
                    options={[...data.map(x => { return { label: x.apartmentNumber, value: x.id } })]} />
                <Select
                    label={t('apartments:accountType')}
                    defaultValue={type}
                    disabled
                    options={[
                        { label: t('apartments:accountTypeBuildingMaintenance'), value: '0' },
                        { label: t('apartments:accountTypeRemovalOfWaste'), value: '1' },
                        { label: t('apartments:accountTypeWaterSupply'), value: '2' },
                        { label: t('apartments:accountTypeElectricitySupply'), value: '3' }
                    ]} />
                <Input
                    label={t('apartments:accountAccountNumber')}
                    defaultValue={accountNumber}
                    placeholder={t('apartments:accountAccountNumberPlaceholder')}
                    minLength={0}
                    maxLength={32}
                    onChange={(value: string | undefined) => setAccountNumber(value)} />
                <Numeric
                    label={t('apartments:accountBalance')}
                    defaultValue={balance?.toFixed(2)}
                    placeholder={t('apartments:accountBalancePlaceholder')}
                    errorMessage={t('apartments:accountBalanceErrorMessage')}
                    allowNegative
                    allowDouble
                    required
                    onChange={(value: number | undefined) => setBalance(value)} />
                <Numeric
                    label={t('apartments:accountIndicator')}
                    defaultValue={indicator}
                    placeholder={t('apartments:accountIndicatorPlaceholder')}
                    errorMessage={t('apartments:accountIndicatorErrorMessage')}
                    required
                    onChange={(value: number | undefined) => setIndicator(value)} />
                <Button
                    title={t('apartments:accountUpdateModalButton')}
                    type="submit"
                    rounded />
            </FormContextProvider>
        </Modal>
    )
}

interface InvoiceUpdateProps {
    buildings: { label: string, value: string }[]
    data: Apartment[]
    invoices: Invoice[]
    selected: { value: string | undefined } | undefined
    invoke: (id: string, accountNumber: string, balance: number, indicator: number, total: number) => void
}

const InvoiceUpdate: FunctionComponent<InvoiceUpdateProps> = ({ buildings, data, invoices, selected, invoke }: InvoiceUpdateProps) => {
    const { t } = useTranslation()

    const [buildingId, setBuildingId] = useState<string | undefined>(undefined)
    const [apartmentId, setApartmentId] = useState<string | undefined>(undefined)
    const [type, setType] = useState<string | undefined>(undefined)
    const [date, setDate] = useState<Date | undefined>(undefined)
    const [accountNumber, setAccountNumber] = useState<string | undefined>(undefined)
    const [balance, setBalance] = useState<number | undefined>(undefined)
    const [indicator, setIndicator] = useState<number | undefined>(undefined)
    const [total, setTotal] = useState<number | undefined>(undefined)
    const [cost, setCost] = useState<number | undefined>(undefined)
    const [payer, setPayer] = useState<string | undefined>(undefined)
    const [ownershipPercentage, setOwnershipPercentage] = useState<number | undefined>(undefined)
    const [isOpen, setIsOpen] = useState<boolean>(false)

    useEffect(() => {
        const item = invoices.find(x => x.id === selected?.value)
        if (item) {
            setBuildingId(data.find(x => x.id === item.apartmentId)?.buildingId)
            setApartmentId(item.apartmentId)
            setType(String(item.type))
            setDate(new Date(item.date))
            setAccountNumber(item.accountNumber)
            setBalance(item.balance)
            setIndicator(item.indicator)
            setTotal(item.total)
            setCost(item.cost)
            setPayer(item.payer)
            setOwnershipPercentage(item.ownershipPercentage)
            setIsOpen(!isOpen)
        }
    }, [selected])

    const onSubmit = () => {
        if (selected?.value && accountNumber && balance && indicator && total) {
            invoke(
                selected.value,
                accountNumber,
                balance,
                indicator,
                total
            )
            setIsOpen(!isOpen)
        }
    }

    return (
        <Modal
            title={t('apartments:invoiceUpdateModal')}
            isOpen={isOpen}
            onClick={(value: boolean) => setIsOpen(value)}>
            <FormContextProvider onSubmit={onSubmit}>
                <Select
                    label={t('apartments:invoiceBuilding')}
                    defaultValue={buildingId}
                    disabled
                    options={[...buildings]} />
                <Select
                    label={t('apartments:invoiceApartment')}
                    defaultValue={apartmentId}
                    disabled
                    options={[...data.map(x => { return { label: x.apartmentNumber, value: x.id } })]} />
                <Select
                    label={t('apartments:invoiceType')}
                    defaultValue={type}
                    disabled
                    options={[
                        { label: t('apartments:invoiceTypeBuildingMaintenance'), value: '0' },
                        { label: t('apartments:invoiceTypeRemovalOfWaste'), value: '1' },
                        { label: t('apartments:invoiceTypeWaterSupply'), value: '2' },
                        { label: t('apartments:invoiceTypeElectricitySupply'), value: '3' }
                    ]} />
                <MonthPicker
                    label={t('apartments:invoiceDate')}
                    defaultValue={date}
                    disabled
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
                <Input
                    label={t('apartments:invoiceAccountNumber')}
                    defaultValue={accountNumber}
                    placeholder={t('apartments:invoiceAccountNumberPlaceholder')}
                    errorMessage={t('apartments:invoiceAccountNumberErrorMessage')}
                    required
                    minLength={0}
                    maxLength={32}
                    onChange={(value: string | undefined) => setAccountNumber(value)} />
                <Numeric
                    label={t('apartments:invoiceBalance')}
                    defaultValue={balance?.toFixed(2)}
                    placeholder={t('apartments:invoiceBalancePlaceholder')}
                    errorMessage={t('apartments:invoiceBalanceErrorMessage')}
                    allowNegative
                    allowDouble
                    required
                    onChange={(value: number | undefined) => setBalance(value)} />
                <Numeric
                    label={t('apartments:invoiceIndicator')}
                    defaultValue={indicator}
                    placeholder={t('apartments:invoiceIndicatorPlaceholder')}
                    errorMessage={t('apartments:invoiceIndicatorErrorMessage')}
                    required
                    onChange={(value: number | undefined) => setIndicator(value)} />
                <Numeric
                    label={t('apartments:invoiceCost')}
                    defaultValue={cost?.toFixed(2)}
                    disabled />
                <Numeric
                    label={t('apartments:invoiceTotal')}
                    defaultValue={total?.toFixed(2)}
                    placeholder={t('apartments:invoiceTotalPlaceholder')}
                    errorMessage={t('apartments:invoiceTotalErrorMessage')}
                    allowNegative
                    allowDouble
                    required
                    onChange={(value: number | undefined) => setTotal(value)} />
                <Input
                    label={t('apartments:invoicePayer')}
                    defaultValue={payer}
                    disabled />
                <Numeric
                    label={t('apartments:invoiceOwnershipPercentage')}
                    defaultValue={ownershipPercentage?.toFixed(2)}
                    disabled />
                <Button
                    title={t('apartments:invoiceUpdateModalButton')}
                    type="submit"
                    rounded />
            </FormContextProvider>
        </Modal>
    )
}

export default Index

export const getServerSideProps = withPageAuthRequired()
