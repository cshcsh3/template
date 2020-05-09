interface Rooms {
    [key: string]: RoomRange
}

type RoomRange = {
    startRange: number
    height: number
    width: number
    range: Array<number>
}

const roomRange = (
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

export const rooms: Rooms = {
    kitchen: roomRange(0, 3, 5),
    ballroom: roomRange(7, 4, 4),
    conservatory: roomRange(14, 4, 4),
    diningRoom: roomRange(108, 3, 5),
    clue: roomRange(115, 5, 5),
    billiardRoom: roomRange(104, 3, 4),
    library: roomRange(194, 3, 4),
    hall: roomRange(241, 5, 5),
    lounge: roomRange(252, 4, 5),
    study: roomRange(284, 3, 4),
}
