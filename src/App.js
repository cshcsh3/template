import React from 'react'
import { Client } from 'boardgame.io/react'

class GameBoard extends React.Component {
    onClick(id) {
        if (this.isActive(id)) {
            this.props.moves.clickCell(id)
            this.props.events.endTurn()
        }
    }

    isActive(id) {
        if (!this.props.isActive) return false
        if (this.props.G.cells[id] !== null) return false
        return true
    }

    render() {
        const { playerPosition, cells } = this.props.G
        let winner = ''
        if (this.props.ctx.gameover) {
            winner =
                this.props.ctx.gameover.winner !== undefined ? (
                    <div id="winner">
                        Winner: {this.props.ctx.gameover.winner}
                    </div>
                ) : (
                    <div id="winner">Draw!</div>
                )
        }

        const cellStyle = {
            border: '1px solid #555',
            width: '50px',
            height: '50px',
            lineHeight: '50px',
            textAlign: 'center',
            backgroundColor: '#333',
        }

        let tbody = []
        for (let i = 0; i < 18; i++) {
            let tCells = []
            for (let j = 0; j < 18; j++) {
                const id = 18 * i + j
                let skip = false

                for (let key in playerPosition) {
                    if (playerPosition.hasOwnProperty(key)) {
                        if (id === playerPosition[key]) {
                            const playerStyle = {
                                color: key,
                                fontWeight: 'bold',
                            }
                            tCells.push(
                                <td
                                    style={cellStyle}
                                    key={id}
                                    onClick={() => this.onClick(id)}
                                >
                                    <span style={playerStyle}>P</span>
                                </td>
                            )
                            skip = true
                            break
                        }
                    }
                }

                if (skip) {
                    continue
                }

                tCells.push(
                    <td
                        style={cellStyle}
                        key={id}
                        onClick={() => this.onClick(id)}
                    >
                        {cells[id]}
                    </td>
                )
            }
            tbody.push(<tr key={i}>{tCells}</tr>)
        }

        return (
            <div>
                <table id="board">
                    <tbody>{tbody}</tbody>
                </table>
                {winner}
            </div>
        )
    }
}

function IsVictory(cells) {}

function IsDraw(cells) {}

const NoClue = {
    setup: () => ({
        cells: Array(324).fill(null),
        playerPosition: {
            red: 311,
            yellow: 216,
            white: 6,
            blue: 11,
            green: 179,
            purple: 251,
        },
    }),

    moves: {
        clickCell: (G, ctx, id) => {},
    },

    endIf: (G, ctx) => {
        if (IsVictory(G.cells)) {
            return { winner: ctx.currentPlayer }
        }
        if (IsDraw(G.cells)) {
            return { draw: true }
        }
    },
}

const App = Client({
    game: NoClue,
    numPlayers: 6,
    board: GameBoard,
})

export default App
