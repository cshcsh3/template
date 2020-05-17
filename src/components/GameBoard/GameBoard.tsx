import React from 'react'
import './GameBoard.scss'

import { removeItemFromArray } from '../../utils'

// TODO proper typing
export default class GameBoard extends React.Component<any, any> {
    onClick(id: number) {
        const { playerPosition, rooms, dice } = this.props.G
        const { currentPlayer } = this.props.ctx

        // check if dice has been rolled and if move is legal
        if (dice) {
            const currentPlayerPos = playerPosition[currentPlayer].pos

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
                this.props.moves.movePlayer(id)
            }
        }
    }

    render() {
        const { playerPosition, cells, rooms, dice } = this.props.G
        const { currentPlayer } = this.props.ctx

        // game board
        let tbody = []
        let roomCells = [] // store cells that are being merged (for rooms) and won't be pushed as a single cell

        for (let i = 0; i < 18; i++) {
            let tCells = []
            for (let j = 0; j < 18; j++) {
                const id = 18 * i + j
                let skip = false

                for (let player of playerPosition) {
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
                        {dice
                            ? `you've rolled ${dice}`
                            : `please roll the dice`}
                    </p>
                    <input
                        type="button"
                        value="Roll Dice"
                        className="control__button"
                        disabled={dice ? true : false}
                        onClick={() => this.props.moves.rollDice()}
                    />
                </div>
                <table id="board">
                    <tbody>{tbody}</tbody>
                </table>
            </div>
        )
    }
}
