import React, { Component } from 'react'

export default class SavingPage extends Component {
    constructor(props){
        super(props);

        this.state = {
            all_props: props.location.state
        }
    }

    componentDidMount() {
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
