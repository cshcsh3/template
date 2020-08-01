export const removeItemFromArray = (arr: Array<any>, item: any) => {
    let index = arr.indexOf(item)
    arr.splice(index, 1)
}

export const capitalize = (s: string) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
}
