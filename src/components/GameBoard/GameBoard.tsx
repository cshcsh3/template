import React from 'react'
import './GameBoard.scss'

import { removeItemFromArray, capitalize } from '../../game/utils'

import type { Room, Card } from '../../game/types'

// TODO proper typing
export default class GameBoard extends React.Component<any, any> {
    showText(
        stage: string,
        player: number,
        dice: number,
        movesLeft: number
    ): string {
        if (stage === 'draw') {
            return `Player ${player}, please draw`
        }
        if (stage === 'roll') {
            return `Player ${player}, please roll dice`
        }
        if (stage === 'move') {
            return `Player ${player}, rolled ${dice}, moves left ${movesLeft}`
        }
        if (stage === 'suggest') {
            return `Player ${player} is suggesting...`
        }
        if (stage === 'accuse') {
            return `Player ${player} is accusing...`
        }
        return 'Welp!'
    }

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

            /**
             * Scenarios in which player can be in the room:
             * 1. They roll the dice then enter a room with remaining dice rolls
             *      a. They can only make a suggestion or an accusation next
             * 2. They are already in a room from the previous turn
             *      a. Assume that they've already made a suggestion, the only legal moves will be door or corner rooms
             *      b. If they move to the door, the only legal moves for the remaining turn will be everywhere but the room they just left
             */
            // TODO Case 2a.
            if (this.playerInRoom(currentPlayerPos)) {
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
                // Case 1a.
                this.props.moves.MovePlayer(id, this.playerInRoom(id))
            }
        }
    }

    render() {
        const {
            players,
            cells,
            rooms,
            dice,
            movesLeft,
            roomDeck,
            weaponDeck,
            suspectDeck,
        } = this.props.G
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
                        let cellClass = 'cell'
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
                        {this.showText(
                            activePlayers[currentPlayer],
                            currentPlayer,
                            dice,
                            movesLeft
                        )}
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

                    <div className="control__cards">
                        <p className="control__heading">Your drawn cards</p>
                        <div className="control__card-box">{cards}</div>
                    </div>

                    {
                        // if player is in suggest or accuse stage
                        activePlayers[currentPlayer] === 'suggest' ||
                        activePlayers[currentPlayer] === 'accuse' ? (
                            <div className="control__suggest">
                                <p className="control__heading">
                                    {capitalize(activePlayers[currentPlayer])}
                                </p>
                                <div className="control__suggest-select">
                                    <p className="control__subheading">
                                        Weapon
                                    </p>
                                    {weaponDeck.map((weapon: Card) => {
                                        return (
                                            <label>
                                                <input
                                                    type="radio"
                                                    value={weapon.name}
                                                    name={weapon.type}
                                                />
                                                {weapon.name}
                                            </label>
                                        )
                                    })}
                                </div>
                                <div className="control__suggest-select">
                                    <p className="control__subheading">
                                        Suspect
                                    </p>
                                    {suspectDeck.map((suspect: Card) => {
                                        return (
                                            <label>
                                                <input
                                                    type="radio"
                                                    value={suspect.name}
                                                    name={suspect.type}
                                                />
                                                {suspect.name}
                                            </label>
                                        )
                                    })}
                                </div>
                                <div className="control__suggest-select">
                                    <p className="control__subheading">Room</p>
                                    {roomDeck.map((room: Card) => {
                                        return (
                                            <label>
                                                <input
                                                    type="radio"
                                                    value={room.name}
                                                    name={room.type}
                                                />
                                                {room.name}
                                            </label>
                                        )
                                    })}
                                </div>
                                <div className="control__btn-box">
                                    <input
                                        type="button"
                                        value={`Skip ${capitalize(
                                            activePlayers[currentPlayer]
                                        )}`}
                                        className="control__btn"
                                        onClick={() => {
                                            if (
                                                activePlayers[currentPlayer] ===
                                                'suggest'
                                            ) {
                                                this.props.moves.MakeSuggestion(
                                                    false
                                                )
                                            }
                                            if (
                                                activePlayers[currentPlayer] ===
                                                'accuse'
                                            ) {
                                                this.props.moves.MakeAccusation(
                                                    false
                                                )
                                            }
                                        }}
                                    />
                                    <input
                                        type="button"
                                        value={`${capitalize(
                                            activePlayers[currentPlayer]
                                        )}`}
                                        className="control__btn"
                                        onClick={() => {
                                            if (
                                                activePlayers[currentPlayer] ===
                                                'suggest'
                                            ) {
                                                this.props.moves.MakeSuggestion(
                                                    true
                                                )
                                            }
                                            if (
                                                activePlayers[currentPlayer] ===
                                                'accuse'
                                            ) {
                                                this.props.moves.MakeAccusation(
                                                    true
                                                )
                                            }
                                        }}
                                        disabled // TODO take input from radio
                                    />
                                </div>
                            </div>
                        ) : null
                    }
                </div>
                <table id="board">
                    <tbody>{tbody}</tbody>
                </table>
            </div>
        )
    }
}
