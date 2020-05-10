import { roomRange } from '../utils'
import type { RoomRange } from '../utils'

interface Rooms {
    [key: string]: RoomRange
}

const rooms: Rooms = {
    kitchen: roomRange(0, 3, 5),
    ballroom: roomRange(7, 4, 4),
    conservatory: roomRange(14, 4, 4),
    billiardRoom: roomRange(104, 3, 4),
    diningRoom: roomRange(108, 3, 5),
    clue: roomRange(115, 5, 5),
    library: roomRange(194, 3, 4),
    hall: roomRange(241, 5, 5),
    lounge: roomRange(252, 4, 5),
    study: roomRange(284, 3, 4),
}

export const NoClue = {
    setup: () => ({
        cells: Array(324).fill(null),
        playerPosition: {
            0: { 
                startPos: 311, 
                color: 'red' 
            },
            1: { 
                startPos: 216,
                color: 'gold'
            },
            2: {
                startPos: 6,
                color: 'white'
            },
            3: {
                startPos: 11,
                color: 'dodgerblue'
            },
            4: {
                startPos: 179,
                color: 'forestgreen'
            },
            5: {
                startPos: 251,
                color: 'plum'
            },
        },
        rooms,
    }),

    moves: {
         rollDice: (G: any, ctx: any) => ({
            ...G,
            dice: ctx.random.D6()
         }),
    },

    endIf: (G: any, ctx: any) => {
    },
}
