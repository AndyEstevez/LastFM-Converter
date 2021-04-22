import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import GetLovedTracks from './GetLovedTracks';

class HomePage extends Component {
    constructor(props){
        super(props);

        this.state = {

        }
    }

    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path='/'>HOME PAGE</Route>
                    <Route path='/user/:username' component={GetLovedTracks}/>
                </Switch>
            </Router>
        );
    }
}

export default HomePage;