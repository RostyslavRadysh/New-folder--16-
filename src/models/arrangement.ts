interface Arrangement {
    id: string
    paymentId: string
    arrangementNumber: string
    title: string
    description?: string
    iban: string
    sortCode: string
    total: number
    time: string
}

export default Arrangement
