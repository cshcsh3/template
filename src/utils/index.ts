export type RoomRange = {
    startRange: number
    height: number
    width: number
    range: Array<number>
}

export const roomRange = (
    startPos: number,
    height: number,
    width: number
): RoomRange => {
    let range = []

    for (let h = 0; h < height; h++) {
        let widthStart = 18 * h + startPos
        range.push(widthStart)
        for (let w = 1; w < width; w++) {
            range.push(widthStart + w)
        }
    }

    return {
        startRange: startPos,
        height,
        width,
        range,
    }
}
