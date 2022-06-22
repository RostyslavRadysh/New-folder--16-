interface Building {
    id: string
    paymentId: string
    legalAddress: string
    built: number
    numberOfFloors: number
    numberOfApartments: number
    area: number
    ceilingHeight: number
    heating: number
    warming: number
    construction: number
    wall: number
    territory: number
    parking: number
    elevator: number
    remark?: string
}

export default Building
