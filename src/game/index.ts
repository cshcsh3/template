import type { Ctx } from 'boardgame.io'

function IsVictory(cells: Array<number>): boolean { return false }

function IsDraw(cells: Array<number>): boolean { return false }

export const NoClue = {
    setup: () => ({
        cells: Array(324).fill(null),
        playerPosition: {
            red: 311,
            gold: 216,
            white: 6,
            dodgerblue: 11,
            forestgreen: 179,
            plum: 251,
        },
    }),

    moves: {
        clickCell: (G: any, ctx: Ctx, id: number) => {},
    },

    endIf: (G: any, ctx: Ctx) => {
        if (IsVictory(G.cells)) {
            return { winner: ctx.currentPlayer }
        }
        if (IsDraw(G.cells)) {
            return { draw: true }
        }
    },
}
