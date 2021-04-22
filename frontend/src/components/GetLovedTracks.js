import React, { Component } from 'react'

export default class GetLovedTracks extends Component {
    constructor(props){
        super(props);

        this.state = {
            username: this.props.match.params.username,
            playlist: [],
        }
    }

    // fetch loved tracks of the user based on the url parameter
    async componentDidMount(){
        const response = await fetch(`/api/${this.state.username}/loved_tracks`)
            const json = await response.json();
            console.log(json.lovedtracks.track)
            this.setState({ playlist: json.lovedtracks.track })
    }

    render() {
        return (
            <div>
                <div>
                    {this.state.playlist.map(function(index){
                        return(
                            <div>
                                <div>{index.name} by {index.artist.name}</div>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }
}
