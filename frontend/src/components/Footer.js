import React, { Component } from 'react';

class Footer extends Component {
    render() {
        return (
            <footer class="footer" style={{position: "absolute", bottom: "0", width: "100%", background: "#F14668", color: "white",}}>
            <div class="content has-text-centered">
              <p>
                <strong style={{color: "black"}}>LastFM Converter</strong> by Andy Estevez. The source code is licensed 
                <a href="http://opensource.org/licenses/mit-license.php" style={{color: "white", fontFamily: "italic" }}>MIT</a>. The website content
                is licensed <a href="http://creativecommons.org/licenses/by-nc-sa/4.0/" style={{color: "white"}}>CC BY NC SA 4.0</a>.
              </p>
            </div>
            <div class="columns is-mobile is-centered">
                <div class="column is-narrow">
                    <p>About</p>
                    <p>Contact</p>
                </div>
                <div class="column is-narrow">
                    <p><a href="https://www.termsfeed.com/live/284671ea-0fc1-4413-938e-f159c3278ef0" target="_blank" style={{color: "white"}}>Terms of Service</a></p>
                    <p><a href="https://www.termsfeed.com/live/cab2b3a1-79b1-441c-80af-13dbbcf9efde" target="_blank" style={{color: "white"}}>Privacy Policy</a></p>
                </div>
            </div>
          </footer>
        );
    }
}

export default Footer;