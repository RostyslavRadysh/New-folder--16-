export const toFormatDate = (date: Date): string => {
    let result = ''
    // Get day
    const day = date.getDate()
    if (day < 10) result += '0' + day
    else result += day
    result += '.'
    // Get month
    const month = date.getMonth() + 1
    if (month < 10) result += '0' + month
    else result += month
    result += '.'
    // Get year
    const year = date.getFullYear() % 100
    if (year < 10) result += '0' + year
    else result += year
    // Return result
    return result
}

export const toFormatMonth = (date: Date): string => {
    let result = ''
    // Get month
    const month = date.getMonth() + 1
    if (month < 10) result += '0' + month
    else result += month
    result += '.'
    // Get year
    const year = date.getFullYear() % 100
    if (year < 10) result += '0' + year
    else result += year
    // Return result
    return result
}

export const toLocalISOTime = (date: Date): string => {
    var tzoffset = (date).getTimezoneOffset() * 60000
    var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1)
    // Return result
    return localISOTime
}

export function calculateAge(dateOfBirth: Date) { 
    var diffMs = Date.now() - dateOfBirth.getTime()
    var ageDate = new Date(diffMs)
    return Math.abs(ageDate.getUTCFullYear() - 1970)
}
