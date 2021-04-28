import React, { Component } from 'react'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Link } from 'react-router-dom'

export default class GetLovedTracks extends Component {
    constructor(props){
        super(props);

        this.state = {
            username: this.props.match.params.username,
            playlist: [],
            open: false,
            access: true,
            isAuthenticated: false,
            access_token: '',
            user_id: '',
            createdPlaylistName: '',
        }

        this.handleOpen = this.handleOpen.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    // fetch loved tracks of the user based on the url parameter
    async componentDidMount(){
            fetch('/api/is-authenticated')
                .then(response => response.json())
                .then(data => {
                    this.setState({isAuthenticated: data.status});
                    if(!data.status){
                        console.log("NOT AUTHENTICATED")
                    }
                })
        
        const responseUserID = await fetch('/api/get-user-id')
            const dataID = await responseUserID.json()

        const responseLovedTracks = await fetch(`/api/${this.state.username}/loved_tracks`)
            const json = await responseLovedTracks.json();
            this.setState({ playlist: json.lovedtracks.track, user_id: dataID })
            console.log(this.state.user_id)
    }

    handleOpen() {
        this.setState({
            open: true
        })
    }

    handleClose() {
        this.setState({
            open: false
        })
    }

    handleChange(event) {
        console.log(event.target.value)
        this.setState({
            access: !this.state.access
        })
    }

    handlePlaylistName = (event) => {
        console.log(event.target.value)
        this.setState({
            createdPlaylistName: event.target.value
        })
    }

    renderAccess(){
        return(
            <div>
            <button class="button is-medium" onClick={this.handleOpen} style={{ backgroundColor: "#1DB954", 
                        color: "white", 
                        fontWeight: "500", 
                        display: "flex", 
                        margin: "auto" }}>
                    <span class="icon" style={{ margin: "auto", padding: "auto" }}>
                        <img src={"http://127.0.0.1:8000/static/images/spotify_black.png"}/>
                    </span>
                    Add to Spotify
                </button>

                <div style={{ textAlign: "center", }}>
                    {this.state.playlist.map(function(index){
                        return(
                            <div style={{paddingBottom: "2.5rem"}}>
                                <div>{index.name} by {index.artist.name}</div>
                            </div>
                        )
                    })}
                </div>

                <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
                    <DialogContent>
                    <DialogContentText>
                        Add name & access to playlist
                    </DialogContentText>
                    <TextField autoFocus margin="dense" id="name" label="Playlist Name" type="text" fullWidth onChange={this.handlePlaylistName}/>
                    <RadioGroup value={this.state.access} onChange={this.handleChange}>
                        <FormControlLabel value={true} control={<Radio/>} label="Public"/> 
                        <FormControlLabel value={false} control={<Radio/>} label="Private"/>
                    </RadioGroup>
                    <DialogActions>
                        <Link to={{pathname: "/saving", 
                                    access: this.state.access,
                                    isAuthenticated: this.state.isAuthenticated,
                                    playlist: this.state.playlist,
                                    createdPlaylistName: this.state.createdPlaylistName,
                                    user_id: this.state.user_id,
                                    state: this.state }}>
                            <Button>
                                Save
                            </Button>
                        </Link>
                    </DialogActions>
                    </DialogContent>
                </Dialog>
            </div>
        )
    }

    renderForbidden(){
        return(
            <div id="app" style={{textAlign:"center", fontWeight: "bold", fontSize: "3em"}}>
                <div>403</div>
                <div class="txt">
                    Forbidden<span class="blink"></span>
                </div>
            </div>
        )
    }

    render() {
        return (
            <div style={{paddingBottom: "250px"}}>

            {this.state.isAuthenticated ? this.renderAccess() : this.renderForbidden() }
                

            </div>
        )
    }
}