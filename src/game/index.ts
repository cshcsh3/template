import { rooms, players, roomDeck, suspectDeck, weaponDeck } from './types'

import { removeItemFromArray } from './utils'

type CaseFile = {
    room: string
    suspect: string
    weapon: string
}

const DrawCard = (G: any, ctx: any) => {
    if (G.deck.length > 0) {
        const card = G.deck.pop()
        if (card) G.players[ctx.currentPlayer].hand.push(card)
    }
    ctx.events.endStage()
}

const RollDice = (G: any, ctx: any) => {
    const dice = ctx.random.D6()
    G.dice = dice
    G.movesLeft = dice
    ctx.events.endStage()
}

const MovePlayer = (G: any, ctx: any, id: number, inRoom: boolean) => {
    G.players[ctx.currentPlayer].pos = id
    if (G.movesLeft) G.movesLeft--
    if (inRoom) {
        ctx.events.setStage('suggest')
    } else if (G.movesLeft === 0) {
        G.dice = 0
        ctx.events.endTurn()
    }
}

const MakeSuggestion = (G: any, ctx: any, suggest: boolean) => {
    if (suggest) {
        // TODO Make suggestion
    }
    ctx.events.setStage('accuse')
}

const MakeAccusation = (G: any, ctx: any, accuse: boolean) => {
    if (accuse) {
        // TODO Make accusation
    }
    ctx.events.endTurn()
}

export const NoClue = {
    setup: (ctx: any) => {
        let caseFile: CaseFile = {
            room: '',
            suspect: '',
            weapon: '',
        }

        let deck = roomDeck.concat(suspectDeck).concat(weaponDeck)
        deck = ctx.random.Shuffle(deck)

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

        // TODO proper typing
        const initialState = {
            caseFile,
            players,
            deck,
            rooms,
            roomDeck,
            suspectDeck,
            weaponDeck,
            cells: Array(324).fill(null),
        }

        return initialState
    },

    // TODO immediately go to roll if no more cards in deck
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
            suggest: {
                moves: { MakeSuggestion },
            },
            accuse: {
                moves: { MakeAccusation },
            },
        },
    },

    endIf: (G: any, ctx: any) => {},
}
