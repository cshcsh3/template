type RoomRange = {
    startRange: number
    height: number
    width: number
    range: Array<number>
}

type Room = {
    name: string
    roomRange: RoomRange
}
type Rooms = Array<Room>

type Players = {
    player: number
    pos: number
    color: string
    hand: Array<Card>
}

type Card = {
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

export const rooms: Rooms = [
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
        roomRange: roomRange(108, 3, 5),
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

export const players: Array<Players> = [
    {
        player: 0,
        pos: 311,
        color: 'red',
        hand: [],
    },
    {
        player: 1,
        pos: 216,
        color: 'gold',
        hand: [],
    },
    {
        player: 2,
        pos: 6,
        color: 'white',
        hand: [],
    },
    {
        player: 3,
        pos: 11,
        color: 'dodgerblue',
        hand: [],
    },
    {
        player: 4,
        pos: 179,
        color: 'forestgreen',
        hand: [],
    },
    {
        player: 5,
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
