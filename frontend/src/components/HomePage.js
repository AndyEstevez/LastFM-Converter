import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import GetLovedTracks from './GetLovedTracks';
import ErrorPage from './ErrorPage';

class HomePage extends Component {
    constructor(props){
        super(props);

        this.state = {
            username: '',
        }

        this.handleInputChange = this.handleInputChange.bind(this)
    }

    renderNavbar() {
        return(
            <nav class="navbar is-danger">
                    <div class="navbar-brand">
                        <a class="navbar-item" href="/">
                            <img src={"http://127.0.0.1:8000/static/images/logo.png"} alt="logo"/>
                        </a>
                    </div>
                    <div class="navbar-end">
                        <div class="navbar-item">
                            <div class="field is-grouped">
                            <p class="control">
                                <a class="bd-tw-button button is-black">
                                <span class="icon">
                                    <img src={"http://127.0.0.1:8000/static/images/spotify_logo.png"}/>
                                </span>
                                <span style={{fontWeight: "bold"}}>
                                    Connect to Spotify
                                </span>
                                </a>
                            </p>
                            </div>
                        </div>
                    </div>
                </nav>
        )
    }

    renderHomePage() {
        return(
            <div style={{textAlign: "center"}}>
                <h1 style={{ marginTop: "50px", 
                    fontSize:"200%", 
                    height: "2em", 
                    textAlign: "center" }}>Convert LastFM Loved Tracks to a Spotify Playlist</h1>
                <h3 style={{ fontSize:"150%", 
                    textAlign: "center", 
                    margin:"auto", 
                    marginTop: "50px", 
                    marginBottom: "20px" }}>Enter LastFM Username:</h3>
                    <div class="field">
                        <div class="control">
                        <input class="input is-medium" type="text" placeholder="e.g. RJ" onChange={this.handleInputChange} style={{ width:"30%", marginBottom: "20px" }}/>                        
                        </div>
                    </div>
                    <Link to={`/user/${this.state.username}`}>
                        <button class="button is-primary is-large">Submit</button>
                    </Link>
            </div>
        )
    }

    handleInputChange(event) {
        console.log(event.target.value)
        this.setState({
            username: event.target.value
        })
    }

    render() {
        return (
            <Router>
                
                {this.renderNavbar()}
                
                <Switch>
                    <Route exact path='/'>{this.renderHomePage()}</Route>
                    <Route exact path='/user/:username' component={GetLovedTracks}/>
                    {/* <Route component={ErrorPage}/> */}
                </Switch>
            </Router>
        );
    }
}

export default HomePage;