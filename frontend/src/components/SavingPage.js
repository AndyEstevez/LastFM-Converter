import React, { Component } from 'react'

export default class SavingPage extends Component {
    constructor(props){
        super(props);

        this.state = {
            all_props: props.location.state,
            tracks_info: [], 
            json: [],
            playlistId: '',
            currentTracksCompleted: 0,
            trackNotFound: 0,
            totalTracks: props.location.playlist.length
        }
    }

    async componentDidMount() {
        console.log("TOTAL TRACKS: " + this.state.totalTracks)

        // fetch request for creating a Spotify Playlist
        const requestOptions = {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: this.state.all_props.createdPlaylistName,
                public: this.state.all_props.access,
                user_id: this.state.all_props.user_id
            }),
        };
        const responseCreatePlaylist = await fetch('/api/create-playlist', requestOptions)
            const jsonPlaylist = await responseCreatePlaylist.json();
            const playlistId = jsonPlaylist.id

        
        // fetch request for searching each loved track based on track name on Spotify API
        let tracks = "";
        let trackName = "";
        for(let i = 0; i < this.state.all_props.playlist.length; i++){
            trackName = this.state.all_props.playlist[i].name
            let artistName = this.state.all_props.playlist[i].artist.name
            if (trackName.includes("?")){
                trackName = trackName.replace(/\?/g, '%3F');
            }
            if (trackName.includes("/")){
                trackName = trackName.replace(/\//g, '');
            }
            // if (trackName.includes('(') || trackName.includes(')')){
            //     trackName = trackName.replace(/[()]/g, '');
            // }
            if (artistName.includes("/")){
                artistName = artistName.replace(/\//g, ' ');
                console.log(artistName)
            }

            const responseTrack = await fetch(`/api/${trackName}/${artistName}/search`)
                const jsonTrack = await responseTrack.json();
                const uri = jsonTrack
                
                
                const optionsAddTracks = {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        playlist_id: playlistId,
                        uris: uri
                    }),
                }
            const responseAdd = await fetch('/api/add-tracks', optionsAddTracks)
                const jsonAdd = await responseAdd.json();
                console.log(jsonAdd)
                if (jsonAdd.hasOwnProperty('error')){
                    this.setState({ currentTracksCompleted: this.state.currentTracksCompleted+1, trackNotFound: this.state.trackNotFound+1 })
                }
                else{
                    this.setState({ currentTracksCompleted: this.state.currentTracksCompleted+1})
                }
        }
        console.log("tracks not found: " + this.state.trackNotFound)
        console.log("Tracks completed: " + this.state.currentTracksCompleted)
        console.log("Total tracks: " + this.state.totalTracks)
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
        const currentProgress = Math.round((this.state.currentTracksCompleted / this.state.totalTracks) * 100);
        return (
            <div style={{margin: "auto"}}>
                {/* {typeof this.state.all_props == undefined ? this.renderForbidden() : null } */}
                <div style={{ textAlign: "center", fontWeight: "500", }}>
                    <p>Saving to Spotify</p>
                    <p>{this.state.currentTracksCompleted} of {this.state.totalTracks}</p>
                    <p>(Tracks Not Found: {this.state.trackNotFound})</p>

                </div>
                <div class="progress-wrapper" style={{margin: "auto", width: "50%"}}>
                    <progress class="progress is-success is-large" 
                            value={this.state.currentTracksCompleted} 
                            max={this.state.totalTracks}>
                            {currentProgress}%
                    </progress>
                    <p class="progress-value has-text-black">{currentProgress}%</p>
                </div>
            </div>
        )
    }
}
