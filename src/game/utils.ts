export const removeItemFromArray = (arr: Array<any>, item: any) => {
    let index = arr.indexOf(item)
    arr.splice(index, 1)
}
