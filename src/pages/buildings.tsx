import React, { FunctionComponent, useState, useEffect, useMemo } from 'react'
import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import useTranslation from 'next-translate/useTranslation'
import { MenuAlt1Icon, DownloadIcon, CogIcon, TrashIcon } from '@heroicons/react/outline'
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
import MonthPicker from '@/components/monthpickers'
import Textarea from '@/components/textareas'
import Select from '@/components/selects'
import Button from '@/components/buttons'
import Modal from '@/components/modals'
import Community from '@/models/community'
import Payment from '@/models/payment'
import Building from '@/models/building'
import Service from '@/models/service'
import Snapshot from '@/models/snapshot'
import Apartment from '@/models/apartment'
import Person from '@/models/person'
import Account from '@/models/account'
import Invoice from '@/models/invoice'
import communitiesJson from '@/jsons/communities.json'
import paymentsJson from '@/jsons/payments.json'
import buildingsJson from '@/jsons/buildings.json'
import servicesJson from '@/jsons/services.json'
import snapshotsJson from '@/jsons/snapshots.json'
import apartmentsJson from '@/jsons/apartments.json'
import personsJson from '@/jsons/persons.json'
import accountsJson from '@/jsons/accounts.json'
import invoicesJson from '@/jsons/invoices.json'

const Index = () => {
    const { t, lang } = useTranslation()
    const { notify } = useToast()

    const [communities] = useState<Community[]>(() => Object.values(JSON.parse(JSON.stringify(communitiesJson))) as Community[])

    const [hidden, setHidden] = useState<boolean>(false)
    const [search, setSearch] = useState<string>('')
    const [sort, setSort] = useState<string>('ascByLegalAddress')
    const [payments] = useState<{ label: string, value: string }[]>(() => (Object.values(JSON.parse(JSON.stringify(paymentsJson))) as Payment[]).map(x => { return { label: x.title, value: x.id } }))
    const [data, setData] = useState<Building[]>(() => Object.values(JSON.parse(JSON.stringify(buildingsJson))) as Building[])
    const [services, setServices] = useState<Service[]>(() => Object.values(JSON.parse(JSON.stringify(servicesJson))) as Service[])
    const [snapshots, setSnapshots] = useState<Snapshot[]>(() => Object.values(JSON.parse(JSON.stringify(snapshotsJson))) as Snapshot[])
    const [invoices, setInvoices] = useState<Invoice[]>(() => Object.values(JSON.parse(JSON.stringify(invoicesJson))) as Invoice[])
    const [selectedBuildingUpdate, setSelectedBuildingUpdate] = useState<{ value: string | undefined }>()
    const [selectedServiceUpdate, setSelectedServiceUpdate] = useState<{ value: string | undefined }>()
    const [selectedSnapshotUpdate, setSelectedSnapshotUpdate] = useState<{ value: string | undefined }>()
    const [selectedSnapshotDelete, setSelectedSnapshotDelete] = useState<{ value: string | undefined }>()

    const [buildingId, setBuildingId] = useState<string | undefined>(undefined)
    const [date, setDate] = useState<Date | undefined>(undefined)
    const [payToDate, setPayToDate] = useState<Date | undefined>(undefined)

    useEffect(() => {
        const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' })
        switch (sort) {
            case 'ascByLegalAddress': {
                setData([...data.sort((x, y) => collator.compare(x.legalAddress, y.legalAddress))])
                break
            }
            case 'descByLegalAddress': {
                setData([...data.sort((x, y) => collator.compare(y.legalAddress, x.legalAddress))])
                break
            }
        }
    }, [sort])
    const products = useMemo<{ id: string, question: string, answer: JSX.Element }[]>(() => {
        const filteredData = search === '' ? data : data.filter(x => x.legalAddress.toLowerCase().indexOf(search.toLowerCase()) > -1)
        return filteredData.map(x => {
            return {
                id: x.id,
                question: x.legalAddress,
                answer: (() => {
                    const heatingTypes = [
                        { label: t('buildings:buildingHeatingUnknown'), value: '0' },
                        { label: t('buildings:buildingHeatingCentralized'), value: '1' },
                        { label: t('buildings:buildingHeatingIndividual'), value: '2' },
                        { label: t('buildings:buildingHeatingAutonomous'), value: '3' }
                    ]
                    const warmingTypes = [
                        { label: t('buildings:buildingWarmingUnknown'), value: '0' },
                        { label: t('buildings:buildingWarmingPolystyrene'), value: '1' },
                        { label: t('buildings:buildingWarmingMineralWool'), value: '2' },
                        { label: t('buildings:buildingWarmingBasaltWool'), value: '3' },
                    ]
                    const constructionTypes = [
                        { label: t('buildings:buildingConstructionUnknown'), value: '0' },
                        { label: t('buildings:buildingConstructionMonolithicFrame'), value: '1' },
                        { label: t('buildings:buildingConstructionBrick'), value: '2' }
                    ]
                    const wallTypes = [
                        { label: t('buildings:buildingWallUnknown'), value: '0' },
                        { label: t('buildings:buildingWallBrick'), value: '1' },
                        { label: t('buildings:buildingWallKeramoblok'), value: '2' },
                        { label: t('buildings:buildingWallAeroblock'), value: '3' },
                        { label: t('buildings:buildingWallFerroconcrete'), value: '4' },
                        { label: t('buildings:buildingWallAnother'), value: '5' }
                    ]
                    const territoryTypes = [
                        { label: t('buildings:buildingTerritoryUnknown'), value: '0' },
                        { label: t('buildings:buildingTerritoryOpen'), value: '1' },
                        { label: t('buildings:buildingTerritoryClosedFromCarsAndStrangers'), value: '2' },
                        { label: t('buildings:buildingTerritoryClosedFromCars'), value: '3' }
                    ]
                    const parkingTypes = [
                        { label: t('buildings:buildingParkingUnknown'), value: '0' },
                        { label: t('buildings:buildingParkingGround'), value: '1' },
                        { label: t('buildings:buildingParkingUnderground'), value: '2' },
                        { label: t('buildings:buildingParkingUndergroundWithElevator'), value: '3' },
                        { label: t('buildings:buildingParkingGarageBoxes'), value: '4' },
                        { label: t('buildings:buildingParkingGroundMultiLevel'), value: '5' }
                    ]
                    const elevatorTypes = [
                        { label: t('buildings:buildingElevatorUnknown'), value: '0' },
                        { label: t('buildings:buildingElevatorAvailable'), value: '1' },
                        { label: t('buildings:buildingElevatorNotAvailable'), value: '2' }
                    ]
                    const serviceTypes = [
                        { label: t('buildings:serviceTypeBuildingMaintenance'), value: '0' },
                        { label: t('buildings:serviceTypeRemovalOfWaste'), value: '1' },
                        { label: t('buildings:serviceTypeWaterSupply'), value: '2' },
                        { label: t('buildings:serviceTypeElectricitySupply'), value: '3' }
                    ]
                    const list = [
                        { title: t('buildings:buildingPayment'), content: <div className="text-sm text-gray-500">{payments.find(y => y.value === x.paymentId)?.label}</div> },
                        { title: t('buildings:buildingBuilt'), content: <div className="text-sm text-gray-500">{x.built}</div> },
                        { title: t('buildings:buildingNumberOfFloors'), content: <div className="text-sm text-gray-500">{x.numberOfFloors}</div> },
                        { title: t('buildings:buildingNumberOfApartments'), content: <div className="text-sm text-gray-500">{x.numberOfApartments}</div> },
                        { title: t('buildings:buildingArea'), content: <div className="text-sm text-gray-500">{x.area.toFixed(2)}</div> },
                        { title: t('buildings:buildingCeilingHeight'), content: <div className="text-sm text-gray-500">{x.ceilingHeight.toFixed(2)}</div> },
                        { title: t('buildings:buildingHeating'), content: <div className="text-sm text-gray-500">{heatingTypes.find(y => y.value === String(x.heating))?.label}</div> },
                        { title: t('buildings:buildingWarming'), content: <div className="text-sm text-gray-500">{warmingTypes.find(y => y.value === String(x.warming))?.label}</div> },
                        { title: t('buildings:buildingConstruction'), content: <div className="text-sm text-gray-500">{constructionTypes.find(y => y.value === String(x.construction))?.value}</div> },
                        { title: t('buildings:buildingWall'), content: <div className="text-sm text-gray-500">{wallTypes.find(y => y.value === String(x.wall))?.label}</div> },
                        { title: t('buildings:buildingTerritory'), content: <div className="text-sm text-gray-500">{territoryTypes.find(y => y.value === String(x.territory))?.value}</div> },
                        { title: t('buildings:buildingParking'), content: <div className="text-sm text-gray-500">{parkingTypes.find(y => y.value === String(x.parking))?.label}</div> },
                        { title: t('buildings:buildingElevator'), content: <div className="text-sm text-gray-500">{elevatorTypes.find(y => y.value === String(x.elevator))?.label}</div> },
                        { title: t('buildings:buildingRemark'), content: <div className="text-sm text-gray-500">{x.remark ?? t('buildings:buildingRemarkNone')}</div> }
                    ]
                    const servicesColumns = [
                        t('buildings:datatableServiceType'),
                        t('buildings:datatableServiceCost'),
                        undefined
                    ]
                    const servicesRows = services.filter(y => y.buildingId === x.id).map(y => {
                        return [
                            serviceTypes.find(z => z.value === String(y.type))?.label,
                            y.cost.toFixed(2),
                            (
                                <span className="flex flex-row items-center justify-end">
                                    <button
                                        className="outline-none cursor-pointer focus:outline-none">
                                        <CogIcon
                                            className="w-6 h-6 text-gray-500 flex-shrink-0"
                                            onClick={() => setSelectedServiceUpdate({ ...{ value: y.id } })} />
                                    </button>
                                </span>
                            )
                        ]
                    }) ?? []
                    const snapshotsColumns = [
                        t('buildings:datatableSnapshotDate'),
                        t('buildings:datatableSnapshotAmount'),
                        undefined
                    ]
                    const snapshotsRows = snapshots.filter(y => y.buildingId === x.id).map(y => {
                        return [
                            toFormatMonth(new Date(y.date)),
                            invoices.filter(z => z.date === y.date).map(z => z.total + (-z.balance)).reduce((z, h) => z + h).toFixed(2),
                            (
                                <span className="flex flex-row items-center justify-end space-x-2">
                                    <button
                                        className="outline-none cursor-pointer focus:outline-none">
                                        <DownloadIcon
                                            className="w-6 h-6 text-gray-500 flex-shrink-0"
                                            onClick={async () => {
                                                const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, BorderStyle } = (await import('docx'))
                                                const { saveAs } = (await import('file-saver')).default

                                                const payments = Object.values(JSON.parse(JSON.stringify(paymentsJson))) as Payment[]
                                                const buildings = Object.values(JSON.parse(JSON.stringify(buildingsJson))) as Building[]
                                                const apartments = Object.values(JSON.parse(JSON.stringify(apartmentsJson))) as Apartment[]

                                                const invoicesTypes = [
                                                    { title: t('buildings:fileInvoicesBuildingMaintenanceTitle'), description: t('buildings:fileInvoicesBuildingMaintenanceDescription'), format: t('buildings:fileInvoicesBuildingMaintenanceFormat'), value: '0' },
                                                    { title: t('buildings:fileInvoicesRemovalOfWasteTitle'), description: t('buildings:fileInvoicesRemovalOfWasteDescription'), format: t('buildings:fileInvoicesRemovalOfWasteFormat'), value: '1' },
                                                    { title: t('buildings:fileInvoicesWaterSupplyTitle'), description: t('buildings:fileInvoicesWaterSupplyDescription'), format: t('buildings:fileInvoicesWaterSupplyFormat'), value: '2' },
                                                    { title: t('buildings:fileInvoicesElectricitySupplyTitle'), description: t('buildings:fileInvoicesElectricitySupplyDescription'), format: t('buildings:fileInvoicesElectricitySupplyFormat'), value: '3' }
                                                ]

                                                const building = buildings.find(z => z.id === y.buildingId)
                                                const payment = payments.find(z => z.id === building?.paymentId)

                                                const borders = {
                                                    top: { style: BorderStyle.NONE, size: 0, color: "#ffffff" },
                                                    bottom: { style: BorderStyle.NONE, size: 0, color: "#ffffff" },
                                                    left: { style: BorderStyle.NONE, size: 0, color: "#ffffff" },
                                                    right: { style: BorderStyle.NONE, size: 0, color: "#ffffff" },
                                                }
                                                const documentCreator = new Document({
                                                    sections: [
                                                        {
                                                            children: [
                                                                ...invoices.filter(z => z.date === y.date).map(z => {
                                                                    const type = invoicesTypes.find(y => y.value === String(z.type))
                                                                    return (
                                                                        new Table({
                                                                            width: {
                                                                                size: 100,
                                                                                type: WidthType.PERCENTAGE,
                                                                            },
                                                                            alignment: AlignmentType.CENTER,
                                                                            rows: [
                                                                                new TableRow({
                                                                                    cantSplit: true,
                                                                                    children: [
                                                                                        new TableCell({
                                                                                            children: [
                                                                                                new Paragraph({
                                                                                                    children: [
                                                                                                        new TextRun({ text: (`${communities[0]?.legalName}, ${t('buildings:fileInvoicesLegalCode')} ${communities[0]?.legalCode}`), font: 'Calibri', size: 24 }),
                                                                                                        new TextRun({ text: (`${t('buildings:fileInvoicesIban')} ${payment?.iban}, ${t('buildings:fileInvoicesSortCode')} ${payment?.sortCode}`), font: 'Calibri', size: 24, break: 1 }),
                                                                                                        new TextRun({ text: (`${t('buildings:fileInvoicesDate')} ${y.date}, ${t('buildings:fileInvoicesPayToDate')} ${y.payToDate}`), font: 'Calibri', bold: true, allCaps: true, size: 24, break: 1 }),
                                                                                                        new TextRun({ text: type?.title, font: 'Calibri', bold: true, size: 24, break: 1 })
                                                                                                    ],
                                                                                                    alignment: AlignmentType.CENTER,
                                                                                                })
                                                                                            ],
                                                                                            columnSpan: 3,
                                                                                            borders: borders
                                                                                        })
                                                                                    ]
                                                                                }),
                                                                                new TableRow({
                                                                                    cantSplit: true,
                                                                                    children: [
                                                                                        new TableCell({
                                                                                            children: [new Paragraph({
                                                                                                children: [
                                                                                                    new TextRun({ text: (`${t('buildings:fileInvoicesAddress')}: ${building?.legalAddress}, №${apartments.find(y => y.id === z.apartmentId)?.apartmentNumber}`), font: 'Calibri', size: 24 }),
                                                                                                    new TextRun({ text: (`${t('buildings:fileInvoicesPayer')}: ${z.payer}`), font: 'Calibri', size: 24, break: 1 }),
                                                                                                    new TextRun({ text: (`${t('buildings:fileInvoicesAccountNumber')}: ${z.accountNumber}`), font: 'Calibri', size: 24, break: 1 }),
                                                                                                    new TextRun({ text: (`${type?.description}: ${z.indicator} ${type?.format}`), font: 'Calibri', size: 24, break: 1 }),
                                                                                                    new TextRun({ text: (`${t('buildings:fileInvoicesCost')}: ${z.cost.toFixed(2)} / ${type?.format}`), font: 'Calibri', size: 24, break: 1 })
                                                                                                ],
                                                                                                alignment: AlignmentType.LEFT
                                                                                            })],
                                                                                            columnSpan: 3,
                                                                                            borders: borders
                                                                                        })
                                                                                    ]
                                                                                }),
                                                                                new TableRow({
                                                                                    cantSplit: true,
                                                                                    children: [
                                                                                        new TableCell({
                                                                                            children: [new Paragraph({
                                                                                                children: [new TextRun({ text: t('buildings:fileInvoicesBalance'), font: 'Calibri', bold: true, size: 24 })],
                                                                                                alignment: AlignmentType.LEFT
                                                                                            })],
                                                                                            borders: borders
                                                                                        }),
                                                                                        new TableCell({
                                                                                            children: [new Paragraph({
                                                                                                children: [new TextRun({ text: t('buildings:fileInvoicesAmount'), font: 'Calibri', bold: true, size: 24 })],
                                                                                                alignment: AlignmentType.LEFT
                                                                                            })],
                                                                                            borders: borders
                                                                                        }),
                                                                                        new TableCell({
                                                                                            children: [new Paragraph({
                                                                                                children: [new TextRun({ text: t('buildings:fileInvoicesSum'), font: 'Calibri', bold: true, size: 24 })],
                                                                                                alignment: AlignmentType.LEFT
                                                                                            })],
                                                                                            borders: borders
                                                                                        })
                                                                                    ]
                                                                                }),
                                                                                new TableRow({
                                                                                    cantSplit: true,
                                                                                    children: [
                                                                                        new TableCell({
                                                                                            children: [new Paragraph({
                                                                                                children: [new TextRun({ text: z.balance.toFixed(2), font: 'Calibri', size: 24 })],
                                                                                                alignment: AlignmentType.LEFT
                                                                                            })],
                                                                                            borders: borders
                                                                                        }),
                                                                                        new TableCell({
                                                                                            children: [new Paragraph({
                                                                                                children: [new TextRun({ text: z.total.toFixed(2), font: 'Calibri', size: 24 })],
                                                                                                alignment: AlignmentType.LEFT
                                                                                            })],
                                                                                            borders: borders
                                                                                        }),
                                                                                        new TableCell({
                                                                                            children: [new Paragraph({
                                                                                                children: [new TextRun({ text: (-z.balance + z.total).toFixed(2), font: 'Calibri', size: 24 })],
                                                                                                alignment: AlignmentType.LEFT
                                                                                            })],
                                                                                            borders: borders
                                                                                        })
                                                                                    ]
                                                                                })
                                                                            ]
                                                                        })
                                                                    )
                                                                })
                                                            ]
                                                        }
                                                    ]
                                                })
                                                Packer.toBlob(documentCreator).then(blob => {
                                                    saveAs(blob, "invoices.docx")
                                                })
                                            }
                                            } />
                                    </button>
                                    <button
                                        className="outline-none cursor-pointer focus:outline-none flex-shrink-0">
                                        <CogIcon
                                            className="w-6 h-6 text-gray-500"
                                            onClick={() => setSelectedSnapshotUpdate({ ...{ value: y.id } })} />
                                    </button>
                                    <button
                                        className="outline-none cursor-pointer focus:outline-none flex-shrink-0">
                                        <TrashIcon
                                            className="w-6 h-6 text-gray-500"
                                            onClick={() => setSelectedSnapshotDelete({ ...{ value: y.id } })} />
                                    </button>
                                </span>
                            )
                        ]
                    }) ?? []

                    return (
                        <div className="flex flex-col space-y-4">
                            <List items={list} />
                            <Button
                                title={t('buildings:buildingUpdateButton')}
                                type="button"
                                rounded
                                onClick={() => setSelectedBuildingUpdate({ ...{ value: x.id } })} />
                            <div className="text-center text-xs font-bold tracking-wider text-gray-900 uppercase dark:text-white">{t('buildings:datatableServices')}</div>
                            <Datatable
                                columns={servicesColumns}
                                rows={servicesRows}
                                messages={{
                                    noDataFound: t('buildings:dataNotFound'),
                                    previous: t('buildings:previous'),
                                    next: t('buildings:next'),
                                    page: t('buildings:page'),
                                    select: t('buildings:select')
                                }} />
                            <div className="text-center text-xs font-bold tracking-wider text-gray-900 uppercase dark:text-white">{t('buildings:datatableSnapshots')}</div>
                            <Datatable
                                columns={snapshotsColumns}
                                rows={snapshotsRows}
                                messages={{
                                    noDataFound: t('buildings:dataNotFound'),
                                    previous: t('buildings:previous'),
                                    next: t('buildings:next'),
                                    page: t('buildings:page'),
                                    select: t('buildings:select')
                                }} />
                        </div>
                    )
                })()
            }
        })
    }, [data, services, snapshots, invoices, search, lang])

    const updateBuilding = (id: string, heating: string, warming: string, construction: string, wall: string, territory: string, parking: string, elevator: string, remark: string | undefined) => {
        const item = data.find(x => x.id === id)
        if (item) {
            item.heating = Number(heating)
            item.warming = Number(warming)
            item.construction = Number(construction)
            item.wall = Number(wall)
            item.territory = Number(territory)
            item.parking = Number(parking)
            item.elevator = Number(elevator)
            item.remark = remark
            setData([...data])
            notify(t('buildings:toastUpdate'))
        }
    }
    const updateService = (id: string, cost: number) => {
        const item = services.find(x => x.id === id)
        if (item) {
            item.cost = cost
            setServices([...services])
            notify(t('buildings:toastUpdate'))
        }
    }
    const createSnapshot = (buildingId: string, date: Date, payToDate: Date) => {
        const item = data.find(x => x.id == buildingId)
        if (item) {
            const snapshot = {
                id: data.length.toString(),
                buildingId: buildingId,
                date: date.toString(),
                payToDate: payToDate.toString(),
                isCompleted: false
            } as Snapshot
            snapshots.push(snapshot)
            setSnapshots([...snapshots])
            const accounts = Object.values(JSON.parse(JSON.stringify(accountsJson))) as Account[]
            const persons = Object.values(JSON.parse(JSON.stringify(personsJson))) as Person[]
            const newInvoices = accounts.map((x, i) => {
                const service = services.find(y => y.type === x.type)
                const person = persons.find(y => y.apartmentId === x.apartmentId && y.ownershipPercentage > 0)
                const newInvoice = {
                    id: (invoices.length + i).toString(),
                    apartmentId: x.apartmentId,
                    date: date.toString(),
                    type: x.type,
                    accountNumber: x.accountNumber,
                    balance: x.balance,
                    indicator: x.indicator,
                    cost: service?.cost,
                    total: (service?.cost ?? 0) * x.indicator,
                    payer: `${person?.secondName} ${person?.firstName}`,
                    ownershipPercentage: person?.ownershipPercentage
                } as Invoice
                return newInvoice
            })
            setInvoices([...invoices, ...newInvoices])
            notify(t('buildings:toastCreate'))
        }
    }
    const updateSnapshot = (id: string) => {
        const item = snapshots.find(x => x.id === id)
        if (item) {
            item.isCompleted = true
            setSnapshots([...snapshots])
            notify(t('buildings:toastUpdate'))
        }
    }
    const deleteSnapshot = (id: string) => {
        const item = snapshots.find(x => x.id === id)
        if (item) {
            setSnapshots([...snapshots.filter(x => x.id !== id)])
            notify(t('buildings:toastDelete'))
        }
    }

    const onSubmit = () => {
        if (buildingId && date && payToDate) {
            createSnapshot(
                buildingId,
                date,
                payToDate
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
                                <div className="text-xs font-light tracking-wide uppercase text-gray-500">{t('buildings:snapshotCreate')}</div>
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
                                    label={t('buildings:snapshotBuilding')}
                                    errorMessage={t('buildings:snapshotBuildingErrorMessage')}
                                    defaultValue={'none'}
                                    required
                                    options={[
                                        { label: t('buildings:snapshotBuildingNone'), value: 'none', disabled: true },
                                        ...data.map(x => { return { label: x.legalAddress, value: x.id } })
                                    ]}
                                    onChange={(value: string | undefined) => setBuildingId(value)} />
                                <MonthPicker
                                    label={t('buildings:snapshotDate')}
                                    placeholder={t('buildings:snapshotDatePlaceholder')}
                                    errorMessage={t('buildings:snapshotDateErrorMessage')}
                                    required
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
                                <DayPicker
                                    label={t('buildings:snapshotPayToDate')}
                                    placeholder={t('buildings:snapshotPayToDatePlaceholder')}
                                    errorMessage={t('buildings:snapshotPayToDateErrorMessage')}
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
                                    onChange={(value: Date | undefined) => setPayToDate(value)} />
                                <Button
                                    title={t('buildings:snapshotCreateButton')}
                                    type="submit"
                                    rounded />
                            </FormContextProvider>
                        </div>
                    </div>
                    <div className={`w-full ${hidden ? '' : 'lg:w-2/3'}`}>
                        <Products
                            products={products}
                            messages={{
                                noDataFound: t('buildings:dataNotFound')
                            }}
                            searchOptions={{ placeholder: t('buildings:searchPlaceholder'), onChange: (value: string) => setSearch(value) }}
                            sortByOptions={[
                                { title: t('buildings:sortAscByLegalAddress'), value: 'ascByLegalAddress' },
                                { title: t('buildings:sortDescByLegalAddress'), value: 'descByLegalAddress' }
                            ]}
                            onSortByChange={(value: string) => setSort(value)} />
                    </div>
                </div>
                <BuildingUpdate
                    payments={payments}
                    data={data}
                    selected={selectedBuildingUpdate}
                    invoke={updateBuilding} />
                <ServiceUpdate
                    data={data}
                    services={services}
                    selected={selectedServiceUpdate}
                    invoke={updateService} />
                <SnapshotUpdate
                    data={data}
                    snapshots={snapshots}
                    selected={selectedSnapshotUpdate}
                    invoke={updateSnapshot} />
                <SnapshotDelete
                    snapshots={snapshots}
                    selected={selectedSnapshotDelete}
                    invoke={deleteSnapshot} />
            </Background>
        </MainLayout>
    )
}

interface BuildingUpdateProps {
    payments: { label: string, value: string }[]
    data: Building[]
    selected: { value: string | undefined } | undefined
    invoke: (id: string, heating: string, warming: string, construction: string, wall: string, territory: string, parking: string, elevator: string, remark: string | undefined) => void
}

const BuildingUpdate: FunctionComponent<BuildingUpdateProps> = ({ payments, data, selected, invoke }: BuildingUpdateProps) => {
    const { t } = useTranslation()

    const [paymentId, setPaymentId] = useState<string | undefined>(undefined)
    const [legalAddress, setLegalAddress] = useState<string | undefined>(undefined)
    const [built, setBuilt] = useState<string | undefined>(undefined)
    const [numberOfFloors, setNumberOfFloors] = useState<string | undefined>(undefined)
    const [numberOfApartments, setNumberOfApartments] = useState<string | undefined>(undefined)
    const [area, setArea] = useState<string | undefined>(undefined)
    const [ceilingHeight, setCeilingHeight] = useState<string | undefined>(undefined)
    const [heating, setHeating] = useState<string | undefined>(undefined)
    const [warming, setWarming] = useState<string | undefined>(undefined)
    const [construction, setConstruction] = useState<string | undefined>(undefined)
    const [wall, setWall] = useState<string | undefined>(undefined)
    const [territory, setTerritory] = useState<string | undefined>(undefined)
    const [parking, setParking] = useState<string | undefined>(undefined)
    const [elevator, setElevator] = useState<string | undefined>(undefined)
    const [remark, setRemark] = useState<string | undefined>(undefined)
    const [isOpen, setIsOpen] = useState<boolean>(false)

    useEffect(() => {
        const item = data.find(x => x.id === selected?.value)
        if (item) {
            setPaymentId(item.paymentId)
            setLegalAddress(item.legalAddress)
            setBuilt(String(item.built))
            setNumberOfFloors(String(item.numberOfFloors))
            setNumberOfApartments(String(item.numberOfApartments))
            setArea(item.area.toFixed(2))
            setCeilingHeight(item.ceilingHeight.toFixed(2))
            setHeating(String(item.heating))
            setWarming(String(item.warming))
            setConstruction(String(item.construction))
            setWall(String(item.wall))
            setTerritory(String(item.territory))
            setParking(String(item.parking))
            setElevator(String(item.elevator))
            setRemark(item.remark)
            setIsOpen(!isOpen)
        }
    }, [selected])

    const onSubmit = () => {
        if (selected?.value && heating && warming && construction && wall && territory && parking && elevator) {
            invoke(
                selected.value,
                heating,
                warming,
                construction,
                wall,
                territory,
                parking,
                elevator,
                remark
            )
            setIsOpen(!isOpen)
        }
    }

    return (
        <Modal
            title={t('buildings:buildingUpdateModal')}
            isOpen={isOpen}
            onClick={(value: boolean) => setIsOpen(value)}>
            <FormContextProvider onSubmit={onSubmit}>
                <Select
                    label={t('buildings:buildingPayment')}
                    defaultValue={paymentId}
                    disabled={true}
                    options={[...payments]} />
                <Input
                    label={t('buildings:buildingLegalAddress')}
                    defaultValue={legalAddress}
                    disabled={true} />
                <Input
                    label={t('buildings:buildingBuilt')}
                    defaultValue={built}
                    disabled={true} />
                <Input
                    label={t('buildings:buildingNumberOfFloors')}
                    defaultValue={numberOfFloors}
                    disabled={true} />
                <Input
                    label={t('buildings:buildingNumberOfApartments')}
                    defaultValue={numberOfApartments}
                    disabled={true} />
                <Input
                    label={t('buildings:buildingArea')}
                    defaultValue={area}
                    disabled={true} />
                <Input
                    label={t('buildings:buildingCeilingHeight')}
                    defaultValue={ceilingHeight}
                    disabled={true} />
                <Select
                    label={t('buildings:buildingHeating')}
                    defaultValue={heating}
                    errorMessage={t('buildings:buildingHeatingErrorMessage')}
                    required
                    options={[
                        { label: t('buildings:buildingHeatingUnknown'), value: '0' },
                        { label: t('buildings:buildingHeatingCentralized'), value: '1' },
                        { label: t('buildings:buildingHeatingIndividual'), value: '2' },
                        { label: t('buildings:buildingHeatingAutonomous'), value: '3' }
                    ]}
                    onChange={(value: string | undefined) => setHeating(value)} />
                <Select
                    label={t('buildings:buildingWarming')}
                    defaultValue={warming}
                    errorMessage={t('buildings:buildingWarmingErrorMessage')}
                    required
                    options={[
                        { label: t('buildings:buildingWarmingUnknown'), value: '0' },
                        { label: t('buildings:buildingWarmingPolystyrene'), value: '1' },
                        { label: t('buildings:buildingWarmingMineralWool'), value: '2' },
                        { label: t('buildings:buildingWarmingBasaltWool'), value: '3' }
                    ]}
                    onChange={(value: string | undefined) => setWarming(value)} />
                <Select
                    label={t('buildings:buildingConstruction')}
                    defaultValue={construction}
                    errorMessage={t('buildings:buildingConstructionErrorMessage')}
                    required
                    options={[
                        { label: t('buildings:buildingConstructionUnknown'), value: '0' },
                        { label: t('buildings:buildingConstructionMonolithicFrame'), value: '1' },
                        { label: t('buildings:buildingConstructionBrick'), value: '2' }
                    ]}
                    onChange={(value: string | undefined) => setConstruction(value)} />
                <Select
                    label={t('buildings:buildingWall')}
                    defaultValue={wall}
                    errorMessage={t('buildings:buildingWallErrorMessage')}
                    required
                    options={[
                        { label: t('buildings:buildingWallUnknown'), value: '0' },
                        { label: t('buildings:buildingWallBrick'), value: '1' },
                        { label: t('buildings:buildingWallKeramoblok'), value: '2' },
                        { label: t('buildings:buildingWallAeroblock'), value: '3' },
                        { label: t('buildings:buildingWallFerroconcrete'), value: '4' },
                        { label: t('buildings:buildingWallAnother'), value: '5' }
                    ]}
                    onChange={(value: string | undefined) => setWall(value)} />
                <Select
                    label={t('buildings:buildingTerritory')}
                    defaultValue={territory}
                    errorMessage={t('buildings:buildingTerritoryErrorMessage')}
                    required
                    options={[
                        { label: t('buildings:buildingTerritoryUnknown'), value: '0' },
                        { label: t('buildings:buildingTerritoryOpen'), value: '1' },
                        { label: t('buildings:buildingTerritoryClosedFromCarsAndStrangers'), value: '2' },
                        { label: t('buildings:buildingTerritoryClosedFromCars'), value: '3' },
                    ]}
                    onChange={(value: string | undefined) => setTerritory(value)} />
                <Select
                    label={t('buildings:buildingParking')}
                    defaultValue={parking}
                    errorMessage={t('buildings:buildingParkingErrorMessage')}
                    required
                    options={[
                        { label: t('buildings:buildingParkingUnknown'), value: '0' },
                        { label: t('buildings:buildingParkingGround'), value: '1' },
                        { label: t('buildings:buildingParkingUnderground'), value: '2' },
                        { label: t('buildings:buildingParkingUndergroundWithElevator'), value: '3' },
                        { label: t('buildings:buildingParkingGarageBoxes'), value: '4' },
                        { label: t('buildings:buildingParkingGroundMultiLevel'), value: '5' }
                    ]}
                    onChange={(value: string | undefined) => setParking(value)} />
                <Select
                    label={t('buildings:buildingElevator')}
                    defaultValue={elevator}
                    errorMessage={t('buildings:buildingElevatorErrorMessage')}
                    required
                    options={[
                        { label: t('buildings:buildingElevatorUnknown'), value: '0' },
                        { label: t('buildings:buildingElevatorAvailable'), value: '1' },
                        { label: t('buildings:buildingElevatorNotAvailable'), value: '2' },
                        { label: t('buildings:buildingElevatorTemporarilyNotWorking'), value: '3' }
                    ]}
                    onChange={(value: string | undefined) => setElevator(value)} />
                <Textarea
                    label={t('buildings:buildingRemark')}
                    defaultValue={remark}
                    placeholder={t('buildings:buildingRemarkPlaceholder')}
                    errorMessage={t('buildings:buildingRemarkErrorMessage')}
                    minLength={0}
                    maxLength={1024}
                    onChange={(value: string | undefined) => setRemark(value)} />
                <Button
                    title={t('buildings:buildingUpdateModalButton')}
                    type="submit"
                    rounded />
            </FormContextProvider>
        </Modal>
    )
}

interface ServiceUpdateProps {
    data: Building[]
    services: Service[]
    selected: { value: string | undefined } | undefined
    invoke: (id: string, cost: number) => void
}

const ServiceUpdate: FunctionComponent<ServiceUpdateProps> = ({ data, services, selected, invoke }: ServiceUpdateProps) => {
    const { t } = useTranslation()

    const [buildingId, setBuildingId] = useState<string | undefined>(undefined)
    const [type, setType] = useState<string | undefined>(undefined)
    const [cost, setCost] = useState<number | undefined>(undefined)
    const [isOpen, setIsOpen] = useState<boolean>(false)

    useEffect(() => {
        const item = services.find(x => x.id === selected?.value)
        if (item) {
            setBuildingId(item.buildingId)
            setType(String(item.type))
            setCost(item.cost)
            setIsOpen(!isOpen)
        }
    }, [selected])

    const onSubmit = () => {
        if (selected?.value && cost) {
            invoke(
                selected.value,
                cost
            )
            setIsOpen(!isOpen)
        }
    }

    return (
        <Modal
            title={t('buildings:serviceUpdateModal')}
            isOpen={isOpen}
            onClick={(value: boolean) => setIsOpen(value)}>
            <FormContextProvider onSubmit={onSubmit}>
                <Select
                    label={t('buildings:serviceBuilding')}
                    defaultValue={buildingId}
                    disabled={true}
                    options={[...data.map(x => { return { label: x.legalAddress, value: x.id } })]} />
                <Select
                    label={t('buildings:serviceType')}
                    defaultValue={type}
                    disabled={true}
                    options={[
                        { label: t('buildings:serviceTypeBuildingMaintenance'), value: '0' },
                        { label: t('buildings:serviceTypeRemovalOfWaste'), value: '1' },
                        { label: t('buildings:serviceTypeWaterSupply'), value: '2' },
                        { label: t('buildings:serviceTypeElectricitySupply'), value: '3' }
                    ]} />
                <Numeric
                    label={t('buildings:serviceCost')}
                    defaultValue={cost?.toFixed(2)}
                    placeholder={t('buildings:serviceCostPlaceholder')}
                    errorMessage={t('buildings:serviceCostErrorMessage')}
                    allowNegative
                    allowDouble
                    required
                    onChange={(value: number | undefined) => setCost(value)} />
                <Button
                    title={t('buildings:serviceUpdateModalButton')}
                    type="submit"
                    rounded />
            </FormContextProvider>
        </Modal>
    )
}

interface SnapshotUpdateProps {
    data: Building[]
    snapshots: Snapshot[]
    selected: { value: string | undefined } | undefined
    invoke: (id: string) => void

}

const SnapshotUpdate: FunctionComponent<SnapshotUpdateProps> = ({ data, snapshots, selected, invoke }: SnapshotUpdateProps) => {
    const { t } = useTranslation()

    const [buildingId, setBuildingId] = useState<string | undefined>(undefined)
    const [date, setDate] = useState<Date | undefined>(undefined)
    const [payToDate, setPayToDate] = useState<Date | undefined>(undefined)
    const [isCompleted, setComplete] = useState<boolean>(false)
    const [isOpen, setIsOpen] = useState<boolean>(false)

    useEffect(() => {
        const item = snapshots.find(x => x.id === selected?.value)
        if (item) {
            setBuildingId(item.buildingId)
            setDate(new Date(item.date))
            setPayToDate(new Date(item.payToDate))
            setComplete(item.isCompleted)
            setIsOpen(!isOpen)
        }
    }, [selected])

    const onSubmit = () => {
        if (selected?.value) {
            invoke(
                selected.value
            )
            setIsOpen(!isOpen)
        }
    }

    return (
        <Modal
            title={t('buildings:snapshotUpdateModal')}
            isOpen={isOpen}
            onClick={(value: boolean) => setIsOpen(value)}>
            <FormContextProvider onSubmit={onSubmit}>
                <Select
                    label={t('buildings:snapshotBuilding')}
                    defaultValue={buildingId}
                    disabled={true}
                    options={[...data.map(x => { return { label: x.legalAddress, value: x.id } })]} />
                <MonthPicker
                    label={t('buildings:snapshotDate')}
                    defaultValue={date}
                    disabled={true}
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
                    label={t('buildings:snapshotPayToDate')}
                    defaultValue={payToDate}
                    disabled={true}
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
                    onChange={(value: Date | undefined) => setPayToDate(value)} />
                <Select
                    label={t('buildings:snapshotIsCompleted')}
                    defaultValue={isCompleted ? '0' : '1'}
                    disabled={true}
                    options={[
                        { label: t('buildings:snapshotIsCompletedFalse'), value: '0', disabled: true },
                        { label: t('buildings:snapshotIsCompletedTrue'), value: '1', disabled: true }
                    ]} />
                <Button
                    title={t('buildings:snapshotUpdateModalButton')}
                    type="submit"
                    rounded
                    disabled={isCompleted} />
            </FormContextProvider>
        </Modal>
    )
}

interface SnapshotDeleteProps {
    snapshots: Snapshot[]
    selected: { value: string | undefined } | undefined
    invoke: (id: string) => void
}

const SnapshotDelete: FunctionComponent<SnapshotDeleteProps> = ({ snapshots, selected, invoke }: SnapshotDeleteProps) => {
    const { t } = useTranslation()

    const [choice, setChoice] = useState<string | undefined>(undefined)
    const [isOpen, setIsOpen] = useState<boolean>(false)

    useEffect(() => {
        const item = snapshots.find(x => x.id === selected?.value)
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
            title={t('buildings:snapshotDeleteModal')}
            isOpen={isOpen}
            onClick={(value: boolean) => setIsOpen(value)}>
            <FormContextProvider onSubmit={onSubmit}>
                <Select
                    label={t('buildings:snapshotDeleteSnapshot')}
                    defaultValue={'none'}
                    errorMessage={t('buildings:snapshotDeleteSnapshotErrorMessage')}
                    required
                    options={[
                        { label: t('buildings:snapshotDeleteSnapshotNone'), value: 'none', disabled: true },
                        { label: t('buildings:snapshotDeleteSnapshotAgree'), value: '0' }
                    ]}
                    onChange={(value: string | undefined) => setChoice(value)} />
                <Button
                    title={t('buildings:snapshotDeleteModalButton')}
                    type="submit"
                    rounded />
            </FormContextProvider>
        </Modal>
    )
}

export default Index

export const getServerSideProps = withPageAuthRequired()
