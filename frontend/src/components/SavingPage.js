import React, { Component } from 'react'

export default class SavingPage extends Component {
    constructor(props){
        super(props);

        this.state = {
            all_props: props.location.state,
            tracks_info: [], 
            json: [],
            playlistId: '',
        }
    }

    async componentDidMount() {
        console.log(this.state.all_props.playlist.length)

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
                trackName = trackName.replace(/\?/g,'');
            }
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
                await fetch('/api/add-tracks', optionsAddTracks)
        }

        console.log(tracks)

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
        console.log(this.state.all_props)
        return (
            <div>
                {/* {typeof this.state.all_props == undefined ? this.renderForbidden() : null } */}
                
            </div>
        )
    }
}
