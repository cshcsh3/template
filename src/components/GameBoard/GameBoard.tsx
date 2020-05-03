import React from 'react'

import './GameBoard.scss'

// TODO Proper typing
export default class GameBoard extends React.Component<any, any> {
    onClick(id: number) {
        if (this.isActive(id)) {
            this.props.moves.clickCell(id)
            this.props.events.endTurn()
        }
    }

    isActive(id: number) {
        if (!this.props.isActive) return false
        if (this.props.G.cells[id] !== null) return false
        return true
    }

    render() {
        const { playerPosition, cells } = this.props.G
        let winner: any = null
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

        let tbody = []
        for (let i = 0; i < 18; i++) {
            let tCells = []
            for (let j = 0; j < 18; j++) {
                const id = 18 * i + j
                let skip = false

                for (let key in playerPosition) {
                    if (playerPosition.hasOwnProperty(key)) {
                        if (id === playerPosition[key]) {
                            tCells.push(
                                <td
                                    className="cell"
                                    key={id}
                                    onClick={() => this.onClick(id)}
                                >
                                    <span style={{ color: key }} className="player">P</span>
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
                        className="cell"
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
