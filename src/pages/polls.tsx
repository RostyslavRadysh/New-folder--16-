import React, { FunctionComponent, useState, useEffect, useMemo } from 'react'
import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import useTranslation from 'next-translate/useTranslation'
import { MenuAlt1Icon, CogIcon } from '@heroicons/react/outline'
import MainLayout from '@/layouts/mains'
import { useToast } from '@/providers/toastContextProvider'
import FormContextProvider from '@/providers/formContextProvider'
import Background from '@/components/backgrounds'
import Products from '@/components/products'
import List from '@/components/lists'
import Datatable from '@/components/datatables'
import Input from '@/components/inputs'
import Numeric from '@/components/numerics'
import Textarea from '@/components/textareas'
import Select from '@/components/selects'
import Button from '@/components/buttons'
import Modal from '@/components/modals'
import { toFormatDate } from '@/utils/helpers'
import Poll from '@/models/poll'
import Vote from '@/models/vote'
import Building from '@/models/building'
import Apartment from '@/models/apartment'
import Person from '@/models/person'
import pollsJson from '@/jsons/polls.json'
import votesJson from '@/jsons/votes.json'
import buildingsJson from '@/jsons/buildings.json'
import apartmentsJson from '@/jsons/apartments.json'
import personsJson from '@/jsons/persons.json'

const Index = () => {
    const { t, lang } = useTranslation()
    const { notify } = useToast()

    const [hidden, setHidden] = useState<boolean>(false)
    const [search, setSearch] = useState<string>('')
    const [sort, setSort] = useState<string>('ascByTime')
    const [buildings] = useState<{ label: string, value: string }[]>(() => (Object.values(JSON.parse(JSON.stringify(buildingsJson))) as Building[]).map(x => { return { label: x.legalAddress, value: x.id } }))
    const [data, setData] = useState<Poll[]>(() => Object.values(JSON.parse(JSON.stringify(pollsJson))) as Poll[])
    const [votes, setVotes] = useState<Vote[]>(() => Object.values(JSON.parse(JSON.stringify(votesJson))) as Vote[])
    const [selectedVoteUpdate, setSelectedVoteUpdate] = useState<{ value: string | undefined }>()

    const [buildingId, setBuildingId] = useState<string | undefined>(undefined)
    const [title, setTitle] = useState<string | undefined>(undefined)
    const [description, setDescription] = useState<string | undefined>(undefined)

    useEffect(() => {
        switch (sort) {
            case 'ascByTime': {
                setData([...data.sort((x, y) => new Date(y.time).getTime() - new Date(x.time).getTime())])
                break
            }
            case 'descByTime': {
                setData([...data.sort((x, y) => new Date(x.time).getTime() - new Date(y.time).getTime())])
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
                    const voteTypes = [
                        { label: t('polls:voteTypeUnknown'), value: '0' },
                        { label: t('polls:voteTypeAgree'), value: '1' },
                        { label: t('polls:voteTypeDisagree'), value: '2' },
                        { label: t('polls:voteTypeAbstained'), value: '3' }
                    ]
                    const list = [
                        { title: t('polls:pollBuilding'), content: <div className="text-sm text-gray-500">{buildings.find(y => y.value === x.buildingId)?.label}</div> },
                        { title: t('polls:pollDescription'), content: <div className="text-sm text-gray-500">{x.description}</div> },
                        { title: t('polls:pollTime'), content: <div className="text-sm text-gray-500">{toFormatDate(new Date(x.time))}</div> }
                    ]
                    const votesColumns = [
                        t('polls:datatableVotesName'),
                        t('polls:datatableVotesType'),
                        undefined
                    ]
                    const votesRows = votes?.map(y => {
                        return [
                            y.voter,
                            voteTypes.find(x => x.value === String(y.type))?.label,
                            (
                                <span className="flex flex-row items-center justify-end">
                                    <button
                                        className="outline-none cursor-pointer focus:outline-non flex-shrink-0">
                                        <CogIcon
                                            className="w-6 h-6 text-gray-500"
                                            onClick={() => setSelectedVoteUpdate({ ...{ value: y.id } })} />
                                    </button>
                                </span>
                            )
                        ]
                    }) ?? []

                    return (
                        <div className="flex flex-col space-y-4" >
                            <List items={list} />
                            <div className="text-center text-xs font-bold tracking-wider text-gray-900 uppercase dark:text-white">{t('polls:datatableVotes')}</div>
                            <Datatable
                                columns={votesColumns}
                                rows={votesRows}
                                messages={{
                                    noDataFound: t('polls:dataNotFound'),
                                    previous: t('polls:previous'),
                                    next: t('polls:next'),
                                    page: t('polls:page'),
                                    select: t('polls:select')
                                }} />
                        </div >
                    )
                })()
            }
        })
    }, [data, votes, search, lang])

    const createPoll = (buildingId: string, title: string, description: string) => {
        let newVotes: Vote[] = []
        const apartments = Object.values(JSON.parse(JSON.stringify(apartmentsJson)) as Apartment[])
        const persons = Object.values(JSON.parse(JSON.stringify(personsJson)) as Person[])
        apartments.forEach(x => {
            persons.filter(y => y.apartmentId === x.id).forEach(y => {
                if (y.ownershipPercentage > 0) {
                    const vote = {
                        id: votes.length.toString(),
                        pollId: data.length.toString(),
                        apartmentNumber: x.apartmentNumber,
                        area: x.area,
                        voter: (`${y.secondName} ${y.firstName} ${y.middleName ?? ''}`).trimEnd(),
                        ownershipPercentage: y.ownershipPercentage,
                        type: 0
                    }
                    newVotes.push(vote)
                }
            })
        })

        const poll = {
            id: data.length.toString(),
            buildingId: buildingId,
            title: title,
            description: description,
            time: (new Date()).toString(),
        } as Poll
        setData([...data, poll])
        setVotes([...votes, ...newVotes])
        notify(t('polls:toastCreate'))
    }
    const updateVote = (id: string, type: string) => {
        const item = votes?.find(x => x.id === id)
        if (item) {
            item.type = Number(type)
            setVotes([...votes])
            notify(t('polls:toastUpdate'))
        }
    }

    const onSubmit = () => {
        if (buildingId && title && description) {
            createPoll(
                buildingId,
                title,
                description
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
                                <div className="text-xs font-light tracking-wide uppercase text-gray-500">{t('polls:pollCreate')}</div>
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
                                    label={t('polls:pollBuilding')}
                                    errorMessage={t('polls:pollBuildingErrorMessage')}
                                    defaultValue={'none'}
                                    required
                                    options={[
                                        { label: t('polls:pollBuildingNone'), value: 'none', disabled: true },
                                        ...buildings
                                    ]}
                                    onChange={(value: string | undefined) => setBuildingId(value)} />
                                <Input
                                    label={t('polls:pollTitle')}
                                    placeholder={t('polls:pollTitlePlaceholder')}
                                    errorMessage={t('polls:pollTitleErrorMessage')}
                                    required
                                    minLength={1}
                                    maxLength={64}
                                    onChange={(value: string | undefined) => setTitle(value)} />
                                <Textarea
                                    label={t('polls:pollDescription')}
                                    placeholder={t('polls:pollDescriptionPlaceholder')}
                                    errorMessage={t('polls:pollDescriptionErrorMessage')}
                                    required
                                    minLength={1}
                                    maxLength={512}
                                    onChange={(value: string | undefined) => setDescription(value)} />
                                <Button
                                    title={t('polls:pollCreateButton')}
                                    type="submit"
                                    rounded />
                            </FormContextProvider>
                        </div>
                    </div>
                    <div className={`w-full ${hidden ? '' : 'lg:w-2/3'}`}>
                        <Products
                            products={products}
                            messages={{
                                noDataFound: t('polls:dataNotFound')
                            }}
                            searchOptions={{ placeholder: t('polls:searchPlaceholder'), onChange: (value: string) => setSearch(value) }}
                            sortByOptions={[
                                { title: t('polls:sortAscByTime'), value: 'ascByTime' },
                                { title: t('polls:sortDescByTime'), value: 'descByTime' }
                            ]}
                            onSortByChange={(value: string) => setSort(value)} />
                    </div>
                </div>
                <VoteUpdate
                    buildings={buildings}
                    data={data}
                    votes={votes}
                    selected={selectedVoteUpdate}
                    invoke={updateVote} />
            </Background>
        </MainLayout>
    )
}

interface VoteUpdateProps {
    buildings: { label: string, value: string }[]
    data: Poll[]
    votes: Vote[]
    selected: { value: string | undefined } | undefined
    invoke: (id: string, type: string) => void
}

const VoteUpdate: FunctionComponent<VoteUpdateProps> = ({ buildings, data, votes, selected, invoke }: VoteUpdateProps) => {
    const { t } = useTranslation()

    const [buildingId, setBuildingId] = useState<string | undefined>(undefined)
    const [pollId, setPollId] = useState<string | undefined>(undefined)
    const [apartmentNumber, setApartmentNumber] = useState<string | undefined>(undefined)
    const [area, setArea] = useState<number | undefined>(undefined)
    const [voter, setVoter] = useState<string | undefined>(undefined)
    const [ownershipPercentage, setOwnershipPercentage] = useState<number | undefined>(undefined)
    const [type, setType] = useState<string | undefined>(undefined)
    const [isOpen, setIsOpen] = useState<boolean>(false)

    useEffect(() => {
        const item = votes?.find(x => x.id === selected?.value)
        if (item) {
            setBuildingId(data.find(x => x.id === item.pollId)?.buildingId)
            setPollId(item.pollId)
            setApartmentNumber(item.apartmentNumber)
            setArea(item.area)
            setVoter(item.voter)
            setOwnershipPercentage(item.ownershipPercentage)
            setType(String(item.type))
            setIsOpen(!isOpen)
        }
    }, [selected])

    const onSubmit = () => {
        if (selected?.value && type) {
            invoke(
                selected.value,
                type
            )
            setIsOpen(!isOpen)
        }
    }

    return (
        <Modal
            title={t('polls:voteUpdateModal')}
            isOpen={isOpen}
            onClick={(value: boolean) => setIsOpen(value)}>
            <FormContextProvider onSubmit={onSubmit}>
                <Select
                    label={t('polls:voteBuilding')}
                    defaultValue={buildingId}
                    disabled={true}
                    options={[...buildings]} />
                <Select
                    label={t('polls:votePoll')}
                    defaultValue={pollId}
                    disabled={true}
                    options={[...data.map(x => { return { label: x.title, value: x.id } })]} />
                <Input
                    label={t('polls:voteApartmentNumber')}
                    defaultValue={apartmentNumber}
                    disabled={true} />
                <Numeric
                    label={t('polls:voteArea')}
                    defaultValue={area?.toFixed(2)}
                    disabled={true} />
                <Input
                    label={t('polls:voteVoter')}
                    defaultValue={voter}
                    disabled={true} />
                <Numeric
                    label={t('polls:voteOwnershipPercentage')}
                    defaultValue={ownershipPercentage?.toFixed(2)}
                    disabled={true} />
                <Select
                    label={t('polls:voteType')}
                    defaultValue={type}
                    required
                    options={[
                        { label: t('polls:voteTypeUnknown'), value: '0' },
                        { label: t('polls:voteTypeAgree'), value: '1' },
                        { label: t('polls:voteTypeDisagree'), value: '2' },
                        { label: t('polls:voteTypeAbstained'), value: '3' }
                    ]}
                    onChange={(value: string | undefined) => {
                        setType(value)
                    }} />
                <Button
                    title={t('polls:voteUpdateModalButton')}
                    type="submit"
                    rounded />
            </FormContextProvider>
        </Modal>
    )
}

export default Index

export const getServerSideProps = withPageAuthRequired()
