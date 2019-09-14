import React, { Component } from "react";
import {
    BrowserRouter as Router,
    Route,
    Link,
    Redirect,
    Switch
} from "react-router-dom";
import Navbar from "./components/NavBar";
import Home from "./components/Home";
import Play from "./components/Play";
import Profile from "./components/Profile";
import Scores from "./components/Scores";
import "./App.css";

const API = "http://localhost:3000/api/v1/scores";
const SC = require("soundcloud");

class App extends Component {
    state = {
        scores: []
    };

    componentDidMount() {
        fetch(API)
            .then(resp => resp.json())
            .then(json => this.setState({ scores: json }, console.log(json)));
        SC.initialize({
            client_id: "YOUR_CLIENT_ID",
            redirect_uri: "https://example.com/callback"
        });
        SC.stream(
            "https://soundcloud.com/user-487117060/sets/space-runner"
        ).then(function(player) {
            player.play();
        });
    }

    render() {
        return (
            <Router>
                {/* <div id="stars"></div>
                <div id="stars2"></div>
                <div id="stars3"></div> */}
                <Navbar />
                
                <Route path="/" exact component={Home} />
                <Route
                    path="/profile"
                    exact
                    render={props => <Profile {...props} user={this.state} />}
                />
                <Route
                    path="/scores"
                    render={props => <Scores scores={this.state.scores} />}
                />
                <Route path="/play" component={Play} />
                <Route render={() => <Redirect to="/" />} />
            </Router>
        );
    }
}

export default App;
