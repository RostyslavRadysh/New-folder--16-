import React, { FunctionComponent, useState, useEffect, useMemo } from 'react'
import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import useTranslation from 'next-translate/useTranslation'
import { MenuAlt1Icon } from '@heroicons/react/outline'
import { toLocalISOTime } from '@/utils/helpers'
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
import Employee from '@/models/employee'
import {
    useGetEmployeesQuery,
    useAddEmployeeMutation,
    useUpdateEmployeeMutation,
    useDeleteEmployeeMutation
} from '@/slicers/apis/employeeApi'

const Index = () => {
    const { t, lang } = useTranslation()

    const [hidden, setHidden] = useState<boolean>(false)
    const [search, setSearch] = useState<string>('')
    const [sort, setSort] = useState<string>('ascByName')
    const { data: employees = [] } = useGetEmployeesQuery()
    const [selectedUpdateEmployee, setSelectedUpdateEmployee] = useState<{ value: string | undefined }>()
    const [selectedDeleteEmployee, setSelectedDeleteEmployee] = useState<{ value: string | undefined }>()

    useEffect(() => {
        const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' })
        switch (sort) {
            case 'ascByName': {
                employees.sort((x, y) => collator.compare(`${x.firstName} ${x.secondName} ${x.middleName}`, `${y.firstName} ${y.secondName} ${y.middleName}`))
                break
            }
            case 'descByName': {
                employees.sort((x, y) => collator.compare(`${y.firstName} ${y.secondName} ${y.middleName}`, `${x.firstName} ${x.secondName} ${x.middleName}`))
                break
            }
        }
    }, [sort])
    const data = useMemo<{ id: string, question: string, answer: JSX.Element }[]>(() => {
        const filteredData = search === '' ? employees : employees.filter(x => `${x.firstName} ${x.secondName} ${x.middleName}`.toLowerCase().indexOf(search.toLowerCase()) > -1)
        return filteredData.map(x => {
            return {
                id: x.id,
                question: `${x.firstName} ${x.secondName} ${x.middleName ?? ''}`.trimEnd(),
                answer: (() => {
                    const genderTypes = [
                        { label: t('employees:employeeGenderUnknown'), value: '0' },
                        { label: t('employees:employeeGenderMale'), value: '1' },
                        { label: t('employees:employeeGenderFemale'), value: '2' }
                    ]
                    const employeeTypes = [
                        { label: t('employees:employeeGenderUnknown'), value: '0' },
                        { label: t('employees:employeeTypeIndividual'), value: '1' },
                        { label: t('employees:employeeTypeEntrepreneur'), value: '2' }
                    ]
                    const list = [
                        { title: t('employees:employeeGender'), content: <div className="text-sm text-gray-500">{genderTypes.find(y => y.value === String(x.type))?.label}</div> },
                        { title: t('employees:employeeDateOfBirth'), content: <div className="text-sm text-gray-500">{x.dateOfBirth ?? t('employees:employeeDateOfBirthNone')}</div> },
                        { title: t('employees:employeePhoneNumber'), content: <div className="text-sm text-gray-500">{x.phoneNumber ?? t('employees:employeePhoneNumberNone')}</div> },
                        { title: t('employees:employeeEmail'), content: <div className="text-sm text-gray-500">{x.email ?? t('employees:employeeEmailNone')}</div> },
                        { title: t('employees:employeeSalary'), content: <div className="text-sm text-gray-500">{x.salary.toFixed(2)}</div> },
                        { title: t('employees:employeeType'), content: <div className="text-sm text-gray-500">{employeeTypes.find(y => y.value === String(x.type))?.label}</div> },
                        { title: t('employees:employeeRemark'), content: <div className="text-sm text-gray-500">{x.remark ?? t('employees:employeeRemarkNone')}</div> }
                    ]

                    return (
                        <div className="flex flex-col space-y-4">
                            <List items={list} />
                            <div className="flex flex-row items-center justify-start space-x-2">
                                <Button
                                    title={t('employees:employeeUpdateButton')}
                                    type="button"
                                    rounded
                                    onClick={() => setSelectedUpdateEmployee({ ...{ value: x.id } })} />
                                <Button
                                    title={t('employees:employeeDeleteButton')}
                                    type="button"
                                    color="red"
                                    rounded
                                    onClick={() => setSelectedDeleteEmployee({ ...{ value: x.id } })} />
                            </div>
                        </div>
                    )
                })()
            }
        })
    }, [employees, search, lang])

    return (
        <MainLayout>
            <Background>
                <div className="flex flex-col px-4 py-8 space-x-0 space-y-7 lg:flex-row lg:space-x-7 lg:space-y-0">
                    <div className={`flex flex-col ${hidden ? 'lg:w-6' : 'lg:w-1/3'}`}>
                        <div className="flex flex-row items-center justify-between">
                            <div className={`${hidden ? 'hidden' : 'block'}`}>
                                <div className="text-xs font-light tracking-wide uppercase text-gray-500">{t('employees:employeeCreate')}</div>
                            </div>
                            <button
                                className="outline-none appearance-none cursor-pointer focus:outline-none flex-shrink-0"
                                onClick={() => setHidden(!hidden)}>
                                <MenuAlt1Icon className="w-6 h-6 text-gray-900 dark:text-white" />
                            </button>
                        </div>
                        <div className={`${hidden ? 'hidden' : 'block'}`}>
                            <CreateEmployee />
                        </div>
                    </div>
                    <div className={`w-full ${hidden ? '' : 'lg:w-2/3'}`}>
                        <Products
                            products={data}
                            messages={{
                                noDataFound: t('employees:dataNotFound')
                            }}
                            searchOptions={{ placeholder: t('employees:searchPlaceholder'), onChange: (value: string) => setSearch(value) }}
                            sortByOptions={[
                                { title: t('employees:sortAscByName'), value: 'ascByName' },
                                { title: t('employees:sortDescByName'), value: 'descByName' }
                            ]}
                            onSortByChange={(value: string) => setSort(value)} />
                    </div>
                </div>
                <UpdateEmployee selected={selectedUpdateEmployee} />
                <DeleteEmployee selected={selectedDeleteEmployee} />
            </Background>
        </MainLayout>
    )
}

const CreateEmployee: FunctionComponent = () => {
    const { t } = useTranslation()
    const { notify } = useToast()

    const [addEmployee] = useAddEmployeeMutation()

    const [firstName, setFirstName] = useState<string | undefined>(undefined)
    const [secondName, setSecondName] = useState<string | undefined>(undefined)
    const [middleName, setMiddleName] = useState<string | undefined>(undefined)
    const [gender, setGender] = useState<string | undefined>(undefined)
    const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(undefined)
    const [phoneNumber, setPhoneNumber] = useState<string | undefined>(undefined)
    const [email, setEmail] = useState<string | undefined>(undefined)
    const [currency, setCurrency] = useState<string | undefined>(undefined)
    const [salary, setSalary] = useState<number | undefined>(undefined)
    const [type, setType] = useState<string | undefined>(undefined)
    const [remark, setRemark] = useState<string | undefined>(undefined)

    const onSubmit = () => {
        if (firstName || secondName || gender || currency || salary || type) return
        const employee = {
            firstName: firstName,
            secondName: secondName,
            middleName: middleName,
            gender: Number(gender),
            dateOfBirth: dateOfBirth ? toLocalISOTime(dateOfBirth) : null,
            phoneNumber: phoneNumber,
            email: email,
            currency: Number(currency),
            salary: salary,
            type: Number(type),
            remark: remark
        } as Employee
        addEmployee(employee)
        notify(t('employees:toastCreate'))
    }

    return (
        <FormContextProvider onSubmit={onSubmit}>
                                <Input
                                    label={t('employees:employeeFirstName')}
                                    placeholder={t('employees:employeeFirstNamePlaceholder')}
                                    errorMessage={t('employees:employeeFirstNameErrorMessage')}
                                    required
                                    minLength={1}
                                    maxLength={64}
                                    onChange={(value: string | undefined) => setFirstName(value)} />
                                <Input
                                    label={t('employees:employeeSecondName')}
                                    placeholder={t('employees:employeeSecondNamePlaceholder')}
                                    errorMessage={t('employees:employeeSecondNameErrorMessage')}
                                    required
                                    minLength={1}
                                    maxLength={64}
                                    onChange={(value: string | undefined) => setSecondName(value)} />
                                <Input
                                    label={t('employees:employeeMiddleName')}
                                    placeholder={t('employees:employeeMiddleNamePlaceholder')}
                                    errorMessage={t('employees:employeeMiddleNameErrorMessage')}
                                    minLength={0}
                                    maxLength={64}
                                    onChange={(value: string | undefined) => setMiddleName(value)} />
                                <Select
                                    label={t('employees:employeeGender')}
                                    defaultValue={'0'}
                                    required
                                    options={[
                                        { label: t('employees:employeeGenderUnknown'), value: '0' },
                                        { label: t('employees:employeeGenderMale'), value: '1' },
                                        { label: t('employees:employeeGenderFemale'), value: '2' }
                                    ]}
                                    onChange={(value: string | undefined) => setGender(value)} />
                                <DayPicker
                                    label={t('employees:employeeDateOfBirth')}
                                    placeholder={t('employees:employeeDateOfBirthlaceholder')}
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
                                    label={t('employees:employeePhoneNumber')}
                                    placeholder={t('employees:employeePhoneNumberPlaceholder')}
                                    errorMessage={t('employees:employeePhoneNumberErrorMessage')}
                                    minLength={0}
                                    maxLength={32}
                                    onChange={(value: string | undefined) => setPhoneNumber(value)} />
                                <Input
                                    label={t('employees:employeeEmail')}
                                    placeholder={t('employees:employeeEmailPlaceholder')}
                                    errorMessage={t('employees:employeeEmailErrorMessage')}
                                    minLength={0}
                                    maxLength={128}
                                    onChange={(value: string | undefined) => setEmail(value)} />
                                <Select
                                    label={t('employees:employeeCurrency')}
                                    defaultValue={'none'}
                                    required
                                    errorMessage={t('employees:employeeCurrencyErrorMessage')}
                                    options={[
                                        { label: t('employees:employeeCurrencyNone'), value: 'none', disabled: true },
                                        { label: t('employees:employeeCurrencyUsd'), value: '0' },
                                        { label: t('employees:employeeCurrencyEur'), value: '1' },
                                        { label: t('employees:employeeCurrencyUah'), value: '2' },
                                        { label: t('employees:employeeCurrencyPln'), value: '3' }
                                    ]}
                                    onChange={(value: string | undefined) => setCurrency(value)} />
                                <Numeric
                                    label={t('employees:employeeSalary')}
                                    placeholder={t('employees:employeeSalaryPlaceholder')}
                                    errorMessage={t('employees:employeeSalaryErrorMessage')}
                                    allowDouble
                                    required
                                    onChange={(value: number | undefined) => setSalary(value)} />
                                <Select
                                    label={t('employees:employeeType')}
                                    defaultValue={'0'}
                                    required
                                    options={[
                                        { label: t('employees:employeeTypeUnknown'), value: '0' },
                                        { label: t('employees:employeeTypeIndividual'), value: '1' },
                                        { label: t('employees:employeeTypeEntrepreneur'), value: '2' }
                                    ]}
                                    onChange={(value: string | undefined) => setType(value)} />
                                <Textarea
                                    label={t('employees:employeeRemark')}
                                    placeholder={t('employees:employeeRemarkPlaceholder')}
                                    errorMessage={t('employees:employeeRemarkErrorMessage')}
                                    minLength={0}
                                    maxLength={1024}
                                    onChange={(value: string | undefined) => setRemark(value)} />
                                <Button
                                    title={t('employees:employeeCreateButton')}
                                    type="submit"
                                    rounded />
                            </FormContextProvider>
    )
}

interface UpdateEmployeeProps {
    selected: { value: string | undefined } | undefined
}

const UpdateEmployee: FunctionComponent<UpdateEmployeeProps> = ({ selected }: UpdateEmployeeProps) => {
    const { t } = useTranslation()
    const { notify } = useToast()

    const { data: employees = [] } = useGetEmployeesQuery()
    const [updateEmployee] = useUpdateEmployeeMutation()

    const [firstName, setFirstName] = useState<string | undefined>(undefined)
    const [secondName, setSecondName] = useState<string | undefined>(undefined)
    const [middleName, setMiddleName] = useState<string | undefined>(undefined)
    const [gender, setGender] = useState<string | undefined>(undefined)
    const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(undefined)
    const [phoneNumber, setPhoneNumber] = useState<string | undefined>(undefined)
    const [email, setEmail] = useState<string | undefined>(undefined)
    const [currency, setCurrency] = useState<string | undefined>(undefined)
    const [salary, setSalary] = useState<number | undefined>(undefined)
    const [type, setType] = useState<string | undefined>(undefined)
    const [remark, setRemark] = useState<string | undefined>(undefined)
    const [isOpen, setIsOpen] = useState<boolean>(false)

    useEffect(() => {
        const employee = employees.find(x => x.id === selected?.value)
        if (employee) {
            setFirstName(employee.firstName)
            setSecondName(employee.secondName)
            setMiddleName(employee.middleName)
            setGender(String(employee.gender))
            setDateOfBirth(employee.dateOfBirth ? new Date(employee.dateOfBirth) : undefined)
            setPhoneNumber(employee.phoneNumber)
            setEmail(employee.email)
            setCurrency(String(employee.currency))
            setSalary(employee.salary)
            setType(String(employee.type))
            setRemark(employee.remark)
            setIsOpen(!isOpen)
        }
    }, [selected])

    const onSubmit = () => {
        if (!selected?.value || !firstName || !secondName || !gender || !currency || !salary || !type) return
        const employee = employees.find(x => x.id === selected?.value)
        if (!employee) return
        updateEmployee({
            ...employee,
            firstName: firstName,
            secondName: secondName,
            middleName: middleName,
            gender: Number(gender),
            dateOfBirth: dateOfBirth ? toLocalISOTime(dateOfBirth) : null,
            phoneNumber: phoneNumber,
            email: email,
            currency: Number(currency),
            salary: salary,
            type: Number(type),
            remark: remark
        } as Employee)
        notify(t('employees:toastUpdate'))
        setIsOpen(!isOpen)
    }

    return (
        <Modal
            title={t('employees:employeeUpdateModal')}
            isOpen={isOpen}
            onClick={(value: boolean) => setIsOpen(value)}>
            <FormContextProvider onSubmit={onSubmit}>
                <Input
                    label={t('employees:employeeFirstName')}
                    defaultValue={firstName}
                    placeholder={t('employees:employeeFirstNamePlaceholder')}
                    errorMessage={t('employees:employeeFirstNameErrorMessage')}
                    required
                    minLength={1}
                    maxLength={64}
                    onChange={(value: string | undefined) => setFirstName(value)} />
                <Input
                    label={t('employees:employeeSecondName')}
                    defaultValue={secondName}
                    placeholder={t('employees:employeeSecondNamePlaceholder')}
                    errorMessage={t('employees:employeeSecondNameErrorMessage')}
                    required
                    minLength={1}
                    maxLength={64}
                    onChange={(value: string | undefined) => setSecondName(value)} />
                <Input
                    label={t('employees:employeeMiddleName')}
                    defaultValue={middleName}
                    placeholder={t('employees:employeeMiddleNamePlaceholder')}
                    errorMessage={t('employees:employeeMiddleNameErrorMessage')}
                    minLength={0}
                    maxLength={64}
                    onChange={(value: string | undefined) => setMiddleName(value)} />
                <Select
                    label={t('employees:employeeGender')}
                    defaultValue={gender}
                    required
                    options={[
                        { label: t('employees:employeeGenderUnknown'), value: '0' },
                        { label: t('employees:employeeGenderMale'), value: '1' },
                        { label: t('employees:employeeGenderFemale'), value: '2' }
                    ]}
                    onChange={(value: string | undefined) => setGender(value)} />
                <DayPicker
                    label={t('employees:employeeDateOfBirth')}
                    defaultValue={dateOfBirth}
                    placeholder={t('employees:employeeDateOfBirthlaceholder')}
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
                    label={t('employees:employeePhoneNumber')}
                    defaultValue={phoneNumber}
                    placeholder={t('employees:employeePhoneNumberPlaceholder')}
                    errorMessage={t('employees:employeePhoneNumberErrorMessage')}
                    minLength={0}
                    maxLength={32}
                    onChange={(value: string | undefined) => setPhoneNumber(value)} />
                <Input
                    label={t('employees:employeeEmail')}
                    defaultValue={email}
                    placeholder={t('employees:employeeEmailPlaceholder')}
                    errorMessage={t('employees:employeeEmailErrorMessage')}
                    minLength={0}
                    maxLength={128}
                    onChange={(value: string | undefined) => setEmail(value)} />
                <Select
                    label={t('employees:employeeCurrency')}
                    defaultValue={currency}
                    required
                    options={[
                        { label: t('employees:employeeCurrencyUsd'), value: '0' },
                        { label: t('employees:employeeCurrencyEur'), value: '1' },
                        { label: t('employees:employeeCurrencyUah'), value: '2' },
                        { label: t('employees:employeeCurrencyPln'), value: '3' }
                    ]}
                    onChange={(value: string | undefined) => setCurrency(value)} />
                <Numeric
                    label={t('employees:employeeSalary')}
                    defaultValue={salary?.toFixed(2)}
                    placeholder={t('employees:employeeSalaryPlaceholder')}
                    errorMessage={t('employees:employeeSalaryErrorMessage')}
                    allowDouble
                    required
                    onChange={(value: number | undefined) => setSalary(value)} />
                <Select
                    label={t('employees:employeeType')}
                    defaultValue={type}
                    required
                    options={[
                        { label: t('employees:employeeTypeUnknown'), value: '0' },
                        { label: t('employees:employeeTypeIndividual'), value: '1' },
                        { label: t('employees:employeeTypeEntrepreneur'), value: '2' }
                    ]}
                    onChange={(value: string | undefined) => setType(value)} />
                <Textarea
                    label={t('employees:employeeRemark')}
                    defaultValue={remark}
                    placeholder={t('employees:employeeRemarkPlaceholder')}
                    errorMessage={t('employees:employeeRemarkErrorMessage')}
                    minLength={0}
                    maxLength={1024}
                    onChange={(value: string | undefined) => setRemark(value)} />
                <Button
                    title={t('employees:employeeUpdateModalButton')}
                    type="submit"
                    rounded />
            </FormContextProvider>
        </Modal>
    )
}

interface DeleteEmployeeProps {
    selected: { value: string | undefined } | undefined
}

const DeleteEmployee: FunctionComponent<DeleteEmployeeProps> = ({ selected }: DeleteEmployeeProps) => {
    const { t } = useTranslation()
    const { notify } = useToast()

    const { data: employees = [] } = useGetEmployeesQuery()
    const [deleteEmployee] = useDeleteEmployeeMutation()

    const [choice, setChoice] = useState<string | undefined>(undefined)
    const [isOpen, setIsOpen] = useState<boolean>(false)

    useEffect(() => {
        const employee = employees.find(x => x.id === selected?.value)
        if (employee) {
            setIsOpen(!isOpen)
        }
    }, [selected])

    const onSubmit = () => {
        if (!selected?.value || !choice) return
        deleteEmployee(selected?.value)
        notify(t('employees:toastDelete'))
        setIsOpen(!isOpen)
    }

    return (
        <Modal
            title={t('employees:employeeDeleteModal')}
            isOpen={isOpen}
            onClick={(value: boolean) => setIsOpen(value)}>
            <FormContextProvider onSubmit={onSubmit}>
                <Select
                    label={t('employees:employeeDelete')}
                    defaultValue={'none'}
                    errorMessage={t('employees:employeeDeleteErrorMessage')}
                    required
                    options={[
                        { label: t('employees:employeeDeleteNone'), value: 'none', disabled: true },
                        { label: t('employees:employeeDeleteAgree'), value: '0' }
                    ]}
                    onChange={(value: string | undefined) => setChoice(value)} />
                <Button
                    title={t('employees:employeeDeleteModalButton')}
                    type="submit"
                    rounded />
            </FormContextProvider>
        </Modal>
    )
}

export default Index

export const getServerSideProps = withPageAuthRequired()
