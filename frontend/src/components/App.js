import React, { Component } from 'react'
import { render } from 'react-dom'

export default class App extends Component {
    render() {
        return (
            <div>
                TESTING APP PAGE
            </div>
        )
    }
}

const appDiv = document.getElementById('app');
render(<App/>, appDiv);