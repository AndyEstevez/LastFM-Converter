import React, { Component } from 'react'

export default class SavingPage extends Component {
    constructor(props){
        super(props);

        this.state = {
            all_props: props.location.state,
            tracks_info: [], 
            json: []
        }
    }

    async componentDidMount() {
        console.log(this.state.all_props.playlist.length)
        const requestOptions = {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: this.state.all_props.createdPlaylistName,
                public: this.state.all_props.access,
                user_id: this.state.all_props.user_id
            }),
        };
        fetch('/api/create-playlist', requestOptions)
            .then((response) => response.json())
            .then((data) => console.log(data))
        let tracks = [];
        
        for(let i = 0; i < this.state.all_props.playlist.length; i++){
            const responseTrack = await fetch(`/api/${this.state.all_props.playlist[i].name}/search`)
                const jsonTrack = await responseTrack.json();
                const shorterName = jsonTrack.tracks.items
               
            for(let j = 0; j < shorterName.length; j++){
                let name = this.state.all_props.playlist[i].artist.name.toUpperCase()
                if(name == (shorterName[j].artists[0].name).toUpperCase()){
                    console.log(shorterName[j])
                    tracks.push(shorterName[j])
                    break;
                }
            }
        }
        
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
