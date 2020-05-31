type RoomRange = {
    startRange: number
    height: number
    width: number
    range: Array<number>
}

export type Room = {
    name: string
    roomRange: RoomRange
}

export type Door = {
    pos: number
    orientation: 'top' | 'bottom' | 'left' | 'right'
}

export type Player = {
    id: number
    pos: number
    color: string
    hand: Array<Card>
}

export type Card = {
    name: string
    type: 'room' | 'suspect' | 'weapon'
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

export const rooms: Array<Room> = [
    {
        name: 'Kitchen',
        roomRange: roomRange(0, 3, 5),
    },
    {
        name: 'Ballroom',
        roomRange: roomRange(7, 4, 4),
    },
    {
        name: 'Conservatory',
        roomRange: roomRange(14, 4, 4),
    },
    {
        name: 'Billiard Room',
        roomRange: roomRange(104, 3, 4),
    },
    {
        name: 'Dining Room',
        roomRange: roomRange(108, 5, 5),
    },
    {
        name: 'No Clue',
        roomRange: roomRange(115, 5, 5),
    },
    {
        name: 'Library',
        roomRange: roomRange(194, 3, 4),
    },
    {
        name: 'Hall',
        roomRange: roomRange(241, 5, 5),
    },
    {
        name: 'Lounge',
        roomRange: roomRange(252, 4, 5),
    },
    {
        name: 'Study',
        roomRange: roomRange(284, 3, 4),
    },
]

export const doors: Array<Door> = [
    {
        pos: 201,
        orientation: 'top',
    },
    {
        pos: 238,
        orientation: 'bottom',
    },
    {
        pos: 131,
        orientation: 'left',
    },
    {
        pos: 57,
        orientation: 'top',
    },
    {
        pos: 79,
        orientation: 'top',
    },
    {
        pos: 82,
        orientation: 'top',
    },
    {
        pos: 67,
        orientation: 'right',
    },
    {
        pos: 103,
        orientation: 'right',
    },
    {
        pos: 158,
        orientation: 'top',
    },
    {
        pos: 211,
        orientation: 'right',
    },
    {
        pos: 177,
        orientation: 'bottom',
    },
    {
        pos: 266,
        orientation: 'bottom',
    },
    {
        pos: 225,
        orientation: 'bottom',
    },
    {
        pos: 264,
        orientation: 'left',
    },
]

export const players: Array<Player> = [
    {
        id: 0,
        pos: 311,
        color: 'red',
        hand: [],
    },
    {
        id: 1,
        pos: 216,
        color: 'gold',
        hand: [],
    },
    {
        id: 2,
        pos: 6,
        color: 'white',
        hand: [],
    },
    {
        id: 3,
        pos: 11,
        color: 'dodgerblue',
        hand: [],
    },
    {
        id: 4,
        pos: 179,
        color: 'forestgreen',
        hand: [],
    },
    {
        id: 5,
        pos: 251,
        color: 'plum',
        hand: [],
    },
]

export const roomDeck: Array<Card> = [
    {
        name: 'Kitchen',
        type: 'room',
    },
    {
        name: 'Ballroom',
        type: 'room',
    },
    {
        name: 'Conservatory',
        type: 'room',
    },
    {
        name: 'Billiard Room',
        type: 'room',
    },
    {
        name: 'Dining Room',
        type: 'room',
    },
    {
        name: 'Library',
        type: 'room',
    },
    {
        name: 'Hall',
        type: 'room',
    },
    {
        name: 'Lounge',
        type: 'room',
    },
    {
        name: 'Study',
        type: 'room',
    },
]

export const suspectDeck: Array<Card> = [
    {
        name: 'Miss Scar',
        type: 'suspect',
    },
    {
        name: 'Dr Snow',
        type: 'suspect',
    },
    {
        name: 'Mrs Pelican',
        type: 'suspect',
    },
    {
        name: 'Colonel Custard',
        type: 'suspect',
    },
    {
        name: 'Professor Plump',
        type: 'suspect',
    },
    {
        name: 'Mr Vegan',
        type: 'suspect',
    },
]

export const weaponDeck: Array<Card> = [
    {
        name: 'Wrench',
        type: 'weapon',
    },
    {
        name: 'Candlestick',
        type: 'weapon',
    },
    {
        name: 'Lead Pipe',
        type: 'weapon',
    },
    {
        name: 'Rope',
        type: 'weapon',
    },
    {
        name: 'Revolver',
        type: 'weapon',
    },
    {
        name: 'Knife',
        type: 'weapon',
    },
]

export const removeItemFromArray = (arr: Array<any>, item: any) => {
    let index = arr.indexOf(item)
    arr.splice(index, 1)
}
