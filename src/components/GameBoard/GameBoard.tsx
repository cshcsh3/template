import React from 'react'
import './GameBoard.scss'

import { removeItemFromArray } from '../../game/utils'

import type { Room } from '../../game/types'

// TODO proper typing
export default class GameBoard extends React.Component<any, any> {
    playerInRoom(currentPlayerPos: number): boolean {
        const { rooms } = this.props.G
        for (const room of rooms) {
            if (room.roomRange.startRange === currentPlayerPos) return true
        }
        return false
    }

    playerAtDoor(currentPlayerPos: number): boolean {
        const { rooms } = this.props.G
        const doors = rooms.flatMap(
            (room: Room) => room.doors !== undefined && room.doors
        )
        for (const door of doors) {
            if (door.pos === currentPlayerPos) return true
        }
        return false
    }

    onClick(id: number) {
        const { players, rooms, dice } = this.props.G
        const { currentPlayer } = this.props.ctx

        // check if dice has been rolled and if move is legal
        if (dice) {
            const currentPlayerPos = players[currentPlayer].pos
            let legalMoves = []

            // if player is in room
            if (this.playerInRoom(currentPlayerPos)) {
                /**
                 * 1a. Make suggestion
                 * 1b. Make accusation
                 * 2. If already made suggestion, legal moves will be door or corner rooms
                 */
            }

            // a move is legal if it's up, down, left, or right from the player
            // cannot enter a room if it's not at the door
            legalMoves = [
                currentPlayerPos - 1, // left
                currentPlayerPos + 1, // right
                currentPlayerPos - 18, // up
                currentPlayerPos + 18, // down
            ]

            // if player is at door, put as legal move
            if (this.playerAtDoor(currentPlayerPos)) {
                for (let room of rooms) {
                    if (room.roomRange.range.includes(id)) {
                        legalMoves.push(room.roomRange.startRange)
                        break
                    }
                }
            }

            for (let move of legalMoves) {
                if (!this.playerAtDoor(currentPlayerPos)) {
                    // check if there are moves within the room range and remove them
                    // this step is not necessary if player is at the door
                    for (let room of rooms) {
                        if (room.roomRange.range.includes(move)) {
                            removeItemFromArray(legalMoves, move)
                        }
                    }
                }

                // check if there are players standing at the cell
                // currently only 1 player can enter 1 room at a time
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
        const { players, cells, rooms, dice, movesLeft } = this.props.G
        const { currentPlayer, activePlayers } = this.props.ctx

        const doors = rooms.flatMap(
            (room: Room) => room.doors !== undefined && room.doors
        )

        // game board
        let tbody = []
        let roomCells = [] // store cells that are being merged (for rooms) and won't be pushed as a single cell
        let playersInRoom = []

        for (let i = 0; i < 18; i++) {
            let tCells = []
            for (let j = 0; j < 18; j++) {
                const id = 18 * i + j

                // draw rooms
                for (let room of rooms) {
                    // check if there are players in the room
                    let playerInRoom = null
                    for (let player of players) {
                        if (player.pos === room.roomRange.startRange) {
                            playerInRoom = player
                            playersInRoom.push(player.id)
                        }
                    }

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
                                {playerInRoom ? (
                                    <div
                                        style={{
                                            color: playerInRoom.color,
                                        }}
                                        className="player"
                                    >
                                        P
                                    </div>
                                ) : null}
                            </td>
                        )
                        for (let range of room.roomRange.range) {
                            roomCells.push(range)
                        }
                    }
                }

                let drawnPlayerCell = false

                // draw players
                for (let player of players) {
                    // don't draw player if they are in a room
                    if (
                        !playersInRoom.includes(player.id) &&
                        id === player.pos
                    ) {
                        // check if player is at door, ensure player is drawn with door
                        let cellClass = `cell`
                        for (let door of doors) {
                            if (door.pos === id) {
                                cellClass = `cell cell__${door.orientation}`
                                break
                            }
                        }

                        tCells.push(
                            <td
                                className={cellClass}
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

                // draw individual cells
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
            <div className="container">
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
