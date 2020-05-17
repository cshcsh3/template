import React from 'react'
import './GameBoard.scss'

import { removeItemFromArray } from '../../utils'

// TODO proper typing
export default class GameBoard extends React.Component<any, any> {
    onClick(id: number) {
        const { players, rooms, dice } = this.props.G
        const { currentPlayer } = this.props.ctx

        // check if dice has been rolled and if move is legal
        if (dice) {
            const currentPlayerPos = players[currentPlayer].pos

            // a move is legal if it's up, down, left, or right from the player
            // cannot enter a room if it's not at the door
            let legalMoves = [
                currentPlayerPos - 1, // left
                currentPlayerPos + 1, // right
                currentPlayerPos - 18, // up
                currentPlayerPos + 18, // down
            ]

            // TODO if player is at room door then this check is nullified
            // check if there are moves within the room range and remove them
            for (let room of rooms) {
                for (let move of legalMoves) {
                    if (room.roomRange.range.includes(move)) {
                        removeItemFromArray(legalMoves, move)
                    }
                }
            }

            // update player position
            if (legalMoves.includes(id)) {
                this.props.moves.MovePlayer(id)
            }
        }
    }

    render() {
        const { players, cells, rooms, dice, movesLeft } = this.props.G
        const { currentPlayer, activePlayers } = this.props.ctx
        console.log(activePlayers)
        // game board
        let tbody = []
        let roomCells = [] // store cells that are being merged (for rooms) and won't be pushed as a single cell

        for (let i = 0; i < 18; i++) {
            let tCells = []
            for (let j = 0; j < 18; j++) {
                const id = 18 * i + j
                let skip = false

                for (let player of players) {
                    if (id === player.pos) {
                        tCells.push(
                            <td
                                className="cell"
                                key={id}
                                onClick={() => this.onClick(id)}
                            >
                                <span
                                    style={{
                                        color: player.color,
                                    }}
                                    className="player"
                                >
                                    P
                                </span>
                            </td>
                        )
                        skip = true
                        break
                    }
                }

                if (skip) continue

                // draw rooms
                for (let room of rooms) {
                    if (id === room.roomRange.startRange) {
                        tCells.push(
                            <td
                                rowSpan={room.roomRange.height}
                                colSpan={room.roomRange.width}
                                className="cell"
                                key={id}
                                onClick={() => this.onClick(id)}
                            >
                                {room.name}
                            </td>
                        )
                        for (let range of room.roomRange.range) {
                            roomCells.push(range)
                        }
                    }
                }

                // don't draw cells that were merged for the rooms
                if (!roomCells.includes(id)) {
                    tCells.push(
                        <td
                            className="cell"
                            key={id}
                            onClick={() => this.onClick(id)}
                        >
                            {cells[id]}
                        </td>
                    )
                }
            }
            tbody.push(<tr key={i}>{tCells}</tr>)
        }

        return (
            <div>
                <div className="control">
                    <p className="control__text">
                        Player {currentPlayer},{' '}
                        {activePlayers[currentPlayer] === 'draw'
                            ? 'please draw'
                            : !dice
                            ? 'please roll dice'
                            : `rolled ${dice}, moves left ${movesLeft}`}
                    </p>
                    <input
                        type="button"
                        value="Draw Card"
                        className="control__button"
                        disabled={activePlayers[currentPlayer] !== 'draw'}
                        onClick={() => this.props.moves.DrawCard()}
                    />
                    <input
                        type="button"
                        value="Roll Dice"
                        className="control__button"
                        disabled={activePlayers[currentPlayer] !== 'roll'}
                        onClick={() => this.props.moves.RollDice()}
                    />
                </div>
                <table id="board">
                    <tbody>{tbody}</tbody>
                </table>
            </div>
        )
    }
}
