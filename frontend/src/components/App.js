import React, { Component } from 'react'
import { render } from 'react-dom'
import HomePage from './HomePage'

export default class App extends Component {
    render() {
        return (
            <div>
                <HomePage/>
            </div>
        )
    }
}

const appDiv = document.getElementById('app');
render(<App/>, appDiv);