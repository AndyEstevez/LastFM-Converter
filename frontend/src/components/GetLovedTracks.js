import React, { Component } from 'react'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';

export default class GetLovedTracks extends Component {
    constructor(props){
        super(props);

        this.state = {
            username: this.props.match.params.username,
            playlist: [],
            open: false,
            access: "public"
        }

        this.handleOpen = this.handleOpen.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    // fetch loved tracks of the user based on the url parameter
    async componentDidMount(){
        const response = await fetch(`/api/${this.state.username}/loved_tracks`)
            const json = await response.json();
            console.log(json.lovedtracks.track)
            this.setState({ playlist: json.lovedtracks.track })
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
            access: event.target.value
        })
    }

    render() {
        return (
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
                <div style={{ textAlign: "center" }}>
                    {this.state.playlist.map(function(index){
                        return(
                            <div>
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
                    <TextField autoFocus margin="dense" id="name" label="Playlist Name" type="text" fullWidth/>
                    <RadioGroup value={this.state.access} onChange={this.handleChange}>
                        <FormControlLabel value="public" control={<Radio/>} label="Public"/> 
                        <FormControlLabel value="private" control={<Radio/>} label="Private"/>
                    </RadioGroup>
                    <DialogActions>
                        <Button>
                            Save
                        </Button>
                    </DialogActions>
                    </DialogContent>
                </Dialog>

            </div>
        )
    }
}
