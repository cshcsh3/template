import { rooms, playerPosition, roomDeck, suspectDeck, weaponDeck, removeItemFromArray } from '../utils'

export const NoClue = {    
    setup: (ctx: any) => {
        let deck = roomDeck.concat(suspectDeck).concat(weaponDeck)
        deck = ctx.random.Shuffle(deck)

        let caseFile = {
            room: '',
            suspect: '',
            weapon: ''
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
            deck,
            playerPosition,
            rooms,
            cells: Array(324).fill(null),
        }

        return initialState
    },

    moves: {
        drawCard: (G: any, ctx: any) => {

        },
        rollDice: (G: any, ctx: any) => {
            const dice = ctx.random.D6()
            const movesLeft = dice
            return {
                ...G,
                dice,
                movesLeft,
            }
        },
        movePlayer: (G: any, ctx: any, id: number) => {
            G.playerPosition[ctx.currentPlayer].pos = id
            G.movesLeft--
            if (G.movesLeft === 0) {
                G.dice = null
                ctx.events.endTurn()
            }
        },
    },

    endIf: (G: any, ctx: any) => {},
}
