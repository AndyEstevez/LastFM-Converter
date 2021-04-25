import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from 'react-router-dom';
import GetLovedTracks from './GetLovedTracks';
import Footer from './Footer';

class HomePage extends Component {
    constructor(props){
        super(props);

        this.state = {
            username: '',
            showAlert: false,
            isHidden: false,
            spotifyAuthenticated: false
        }

        this.handleInputChange = this.handleInputChange.bind(this)
        this.authenticateSpotify = this.authenticateSpotify.bind(this)

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
                            <p class="control" onClick={this.authenticateSpotify}>
                                <a class="bd-tw-button button is-black">
                                <span class="icon" >
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
            <div style={{textAlign: "center", paddingBottom: "2.5rem"}}>
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
                    <button class="button is-primary is-large" 
                        value={this.state.username} 
                        onClick={this.handleSubmit}>
                        Submit
                    </button>
                    {this.state.showAlert 
                        ? <div class={`notification is-light is-warning ${this.state.isHidden ? 'is-hidden' : null}`} style={{maxWidth: "450px", margin: "auto", marginTop: "25px"}}>
                            <button class="delete" onClick={this.handleDelete}></button>
                            Please enter a username!
                            </div> 
                        : null}
                                                            
            </div>
        )
    }

    async authenticateSpotify() {
        const response = await fetch('/api/is-authenticated')
        const json = await response.json()

        this.setState({spotifyAuthenticated: json.status})

        if(!json.status){

            const response = await fetch('/api/get-auth-url')
            const json = await response.json()
            console.log(json)
            window.location.replace(json.url)
        }
    }

    handleSubmit = () => {
        if(this.state.username.trim() == ''){
            this.setState({
                showAlert: true,
                isHidden: false
            })
        }
        else{
            window.location.href = `/user/${this.state.username}`
        }
    }
    
    handleDelete = () => {
        this.setState({
            isHidden: true
        })
    }

    handleInputChange(event) {
        console.log(event.target.value)
        this.setState({
            username: event.target.value
        })
    }

    render() {
        return (
            <div style={{position: "relative", minHeight: "100vh"}}>
            <Router>
                
                {this.renderNavbar()}
                
                <Switch>
                    <Route exact path='/'>{this.renderHomePage()}</Route>
                    <Route exact path='/user/:username' component={GetLovedTracks}/>
                </Switch>

            </Router>
            <Footer/>
            </div>

        );
    }
}

export default HomePage;