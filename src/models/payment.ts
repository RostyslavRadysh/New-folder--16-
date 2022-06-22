interface Payment {
    id: string
    communityId: string
    title: string
    type: number
    iban: string
    sortCode: string
    currency: number
    balance: number
    remark?: string
}

export default Payment
