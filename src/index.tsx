import React from 'react'
import ReactDOM from 'react-dom'
import * as serviceWorker from './serviceWorker'
import GameBoard from './components/GameBoard/GameBoard'

import { NoClue } from './game'
import { Client } from 'boardgame.io/react'

const App = Client({
    game: NoClue,
    numPlayers: 6,
    board: GameBoard,
})

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
