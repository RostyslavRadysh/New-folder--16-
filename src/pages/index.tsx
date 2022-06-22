import React, { ReactNode } from 'react'
import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import useTranslation from 'next-translate/useTranslation'
import {
  UserGroupIcon,
  KeyIcon,
  OfficeBuildingIcon,
  CreditCardIcon,
  IdentificationIcon,
  DocumentTextIcon
} from '@heroicons/react/outline'
import { calculateAge } from '@/utils/helpers'
import MainLayout from '@/layouts/mains'
import Widget from '@/components/widgets'
import Background from '@/components/backgrounds'
import List from '@/components/lists'
import Chart from '@/components/charts'
import Datatable from '@/components/datatables'
import { useGetPaymentsQuery } from '@/slicers/apis/paymentApi'
import { useGetBuildingsQuery } from '@/slicers/apis/buildingApi'
import { useGetApartmentsQuery } from '@/slicers/apis/apartmentApi'
import { useGetPersonsQuery } from '@/slicers/apis/personApi'
import { useGetAccountsQuery } from '@/slicers/apis/accountApi'
import { useGetEmployeesQuery } from '@/slicers/apis/employeeApi'
import { useGetContractsQuery } from '@/slicers/apis/contractApi'


const Index = () => {
  const { t } = useTranslation()

  const { data: payments = [] } = useGetPaymentsQuery()
  const { data: buildings = [] } = useGetBuildingsQuery()
  const { data: apartments = [] } = useGetApartmentsQuery()
  const { data: persons = [] } = useGetPersonsQuery()
  const { data: accounts = [] } = useGetAccountsQuery()
  const { data: employees = [] } = useGetEmployeesQuery()
  const { data: contracts = [] } = useGetContractsQuery()

  const widgets = [
    { title: t('index:widgetPeople'), description: persons.length, icon: <UserGroupIcon className="text-gray-500 w-7 h-7" /> },
    { title: t('index:widgetApartments'), description: apartments.length, icon: <KeyIcon className="text-gray-500 w-7 h-7" /> },
    { title: t('index:widgetBuildings'), description: buildings.length, icon: <OfficeBuildingIcon className="text-gray-500 w-7 h-7" /> },
    { title: t('index:widgetPayments'), description: payments.length, icon: <CreditCardIcon className="text-gray-500 w-7 h-7" /> },
    { title: t('index:widgetEmployees'), description: employees.length, icon: <IdentificationIcon className="text-gray-500 w-7 h-7" /> },
    { title: t('index:widgetContracts'), description: contracts.length, icon: <DocumentTextIcon className="text-gray-500 w-7 h-7" /> }
  ]
  const peopleList = [
    {
      title: t('index:listElderlyTitle'), content: (
        <div className="flex flex-row items-center justify-between">
          <div className="text-sm text-gray-500">{t('index:listElderlyDescription')}</div>
          <span className="text-gray-500 text-md">
            {persons?.filter(x => {
              if (!x.dateOfBirth) return false
              return calculateAge(new Date(x.dateOfBirth)) > 55
            }).length}
          </span>
        </div>
      )
    },
    {
      title: t('index:listAdultsTitle'), content: (
        <div className="flex flex-row items-center justify-between">
          <div className="text-sm text-gray-500">{t('index:listAdultsDescription')}</div>
          <span className="text-gray-500 text-md">
            {persons?.filter(x => {
              if (!x.dateOfBirth) return false
              return calculateAge(new Date(x.dateOfBirth)) > 25 && calculateAge(new Date(x.dateOfBirth)) < 56
            }).length}
          </span>
        </div>
      )
    },
    {
      title: t('index:listTeenagersTitle'), content: (
        <div className="flex flex-row items-center justify-between">
          <div className="text-sm text-gray-500">{t('index:listTeenagersDescription')}</div>
          <span className="text-gray-500 text-md">
            {persons?.filter(x => {
              if (!x.dateOfBirth) return false
              return calculateAge(new Date(x.dateOfBirth)) > 16 && calculateAge(new Date(x.dateOfBirth)) < 26
            }).length}
          </span>
        </div>
      )
    },
    {
      title: t('index:listChildrenTitle'), content: (
        <div className="flex flex-row items-center justify-between">
          <span className="text-sm text-gray-500">{t('index:listChildrenDescription')}</span>
          <span className="text-gray-500 text-md">
            {persons?.filter(x => {
              if (!x.dateOfBirth) return false
              return calculateAge(new Date(x.dateOfBirth)) < 17
            }).length}
          </span>
        </div>
      )
    }
  ]
  const genderChart = [
    { title: t('index:chartGenderMen'), value: persons?.filter(x => x.gender === 1).length ?? 0, color: '#bfdbff' },
    { title: t('index:chartGenderWomen'), value: persons?.filter(x => x.gender === 2).length ?? 0, color: '#2563eb' }
  ]
  const debtorsColumns = [
    t('index:datatableDebtorsAddress'),
    t('index:datatableDebtorsBalance')
  ]
  const debtorsRows: ReactNode[][] = accounts.filter(x => x.type === 0 && x.balance < 0.00).map(x => {
    const apartment = apartments.find(y => y.id === x.apartmentId)
    return [`${buildings.find(y => y.id === apartment?.buildingId)?.legalAddress}, №${apartment?.apartmentNumber}`, x.balance.toFixed(2)]
  })
  const birthdaysColumns = [
    t('index:datatableBirthdaysName'),
    t('index:datatableBirthdaysDateOfBirth')
  ]
  const birthdaysRows: ReactNode[][] = []

  return (
    <MainLayout>
      <div className="flex flex-col space-y-2">
        <div className="flex flex-col space-x-0 space-y-2 lg:flex-row lg:space-x-2 lg:space-y-0">
          <div className="w-full lg:w-2/4">
            <div className="flex flex-row space-x-2">
              <div className="w-1/2">
                <div className="flex flex-col items-center justify-center space-y-2">
                  {widgets.slice(0, 3).map((widget, i) =>
                    <Widget {...widget}
                      key={i} />
                  )}
                </div>
              </div>
              <div className="w-1/2">
                <div className="flex flex-col items-center justify-center space-y-2">
                  {widgets.slice(3, 6).map((widget, i) =>
                    <Widget {...widget}
                      key={i} />
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-1/4">
            <Background title={t('index:backgroundPeople')}>
              <List items={peopleList} />
            </Background>
          </div>
          <div className="w-full lg:w-1/4">
            <Background title={t('index:backgroundGender')}>
              <div className="flex items-center justify-center">
                <Chart data={genderChart} />
              </div>
            </Background>
          </div>
        </div>
        <div className="flex flex-col space-x-0 space-y-2 lg:flex-row lg:space-x-2 lg:space-y-0">
          <div className="w-full lg:w-1/2">
            <Background title={t('index:backgroundDebtors')}>
              <Datatable
                columns={debtorsColumns}
                rows={debtorsRows}
                messages={{
                  noDataFound: t('index:dataNotFound'),
                  previous: t('index:previous'),
                  next: t('index:next'),
                  page: t('index:page'),
                  select: t('index:select')
                }} />
            </Background>
          </div>
          <div className="w-full lg:w-1/2">
            <Background title={t('index:backgroundBirthdays')}>
              <Datatable
                columns={birthdaysColumns}
                rows={birthdaysRows}
                messages={{
                  noDataFound: t('index:dataNotFound'),
                  previous: t('index:previous'),
                  next: t('index:next'),
                  page: t('index:page'),
                  select: t('index:select')
                }} />
            </Background>
          </div>
        </div>
      </div>
    </MainLayout >
  )
}

export default Index

export const getServerSideProps = withPageAuthRequired()
