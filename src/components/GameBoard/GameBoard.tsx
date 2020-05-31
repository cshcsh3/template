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
            for (let move of legalMoves) {
                // check if there are moves within the room range and remove them
                for (let room of rooms) {
                    if (room.roomRange.range.includes(move)) {
                        removeItemFromArray(legalMoves, move)
                    }
                }

                // check if there are players standing at the cell
                for (let player of players) {
                    if (player.pos === move) {
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
        const { players, cells, rooms, doors, dice, movesLeft } = this.props.G
        const { currentPlayer, activePlayers } = this.props.ctx

        // game board
        let tbody = []
        let roomCells = [] // store cells that are being merged (for rooms) and won't be pushed as a single cell

        for (let i = 0; i < 18; i++) {
            let tCells = []
            for (let j = 0; j < 18; j++) {
                const id = 18 * i + j
                let drawnPlayerCell = false

                // draw players
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
                        drawnPlayerCell = true
                        break
                    }
                }

                if (drawnPlayerCell) continue

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
                    // draw doors
                    let drawnDoorCell = false
                    for (let door of doors) {
                        if (door.pos === id) {
                            const cellClass = `cell cell__${door.orientation}`
                            tCells.push(
                                <td
                                    className={cellClass}
                                    key={id}
                                    onClick={() => this.onClick(id)}
                                >
                                    {cells[id]}
                                </td>
                            )
                            drawnDoorCell = true
                            break
                        }
                    }

                    if (drawnDoorCell) continue

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

        let cards = []
        for (let card of players[currentPlayer].hand) {
            cards.push(
                <div key={card.name} className="control__card">
                    <p className="control__card--name">{card.name}</p>
                    <p className="control__card--type">{card.type}</p>
                </div>
            )
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

                    <div className="control__btn-box">
                        <input
                            type="button"
                            value="Draw Card"
                            className="control__btn"
                            disabled={activePlayers[currentPlayer] !== 'draw'}
                            onClick={() => this.props.moves.DrawCard()}
                        />
                        <input
                            type="button"
                            value="Roll Dice"
                            className="control__btn"
                            disabled={activePlayers[currentPlayer] !== 'roll'}
                            onClick={() => this.props.moves.RollDice()}
                        />
                    </div>

                    <div className="control__card-box">{cards}</div>
                </div>
                <table id="board">
                    <tbody>{tbody}</tbody>
                </table>
            </div>
        )
    }
}
