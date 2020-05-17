import {
    rooms,
    players,
    roomDeck,
    suspectDeck,
    weaponDeck,
    removeItemFromArray,
} from '../utils'

const DrawCard = (G: any, ctx: any) => {
    if (G.deck.length > 0) {
        const card = G.deck.pop()
        G.players[ctx.currentPlayer].hand.push(card)
    }
    ctx.events.endStage()
}

const RollDice = (G: any, ctx: any) => {
    const dice = ctx.random.D6()
    G.dice = dice
    G.movesLeft = dice
    ctx.events.endStage()
}

const MovePlayer = (G: any, ctx: any, id: number) => {
    G.players[ctx.currentPlayer].pos = id
    G.movesLeft--
    if (G.movesLeft === 0) {
        G.dice = null
        ctx.events.endTurn()
    }
}

export const NoClue = {
    setup: (ctx: any) => {
        let deck = roomDeck.concat(suspectDeck).concat(weaponDeck)
        deck = ctx.random.Shuffle(deck)

        let caseFile = {
            room: '',
            suspect: '',
            weapon: '',
        }

        for (let card of deck) {
            if (!caseFile.room && card.type === 'room') {
                caseFile.room = card.name
                removeItemFromArray(deck, card)
            }

            if (!caseFile.suspect && card.type === 'suspect') {
                caseFile.suspect = card.name
                removeItemFromArray(deck, card)
            }

            if (!caseFile.weapon && card.type === 'weapon') {
                caseFile.weapon = card.name
                removeItemFromArray(deck, card)
            }
        }

        const initialState = {
            caseFile,
            players,
            deck,
            rooms,
            cells: Array(324).fill(null),
        }

        return initialState
    },

    turn: {
        activePlayers: {
            currentPlayer: 'draw',
        },
        stages: {
            draw: {
                moves: { DrawCard },
                next: 'roll',
            },
            roll: {
                moves: { RollDice },
                next: 'move',
            },
            move: {
                moves: { MovePlayer },
            },
        },
    },

    endIf: (G: any, ctx: any) => {},
}
