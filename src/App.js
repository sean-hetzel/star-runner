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
import Game from "./components/Game";
import Profile from "./components/Profile";
import Scores from "./components/Scores";
import "./App.css";

const API = "http://localhost:3000/api/v1/scores";

class App extends Component {
    state = {
        scores: []
    };

    componentDidMount() {
        fetch(API)
            .then(resp => resp.json())
            .then(json => this.setState({ scores: json }, console.log(json)));
    }

    render() {
        return (
            <Router>
                {/* <div id="space">
                    <div className="stars"></div>
                    <div className="stars"></div>
                    <div className="stars"></div>
                    <div className="stars"></div>
                    <div className="stars"></div>
                </div> */}
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
                <Route path="/game" component={Game} />
                <Route render={() => <Redirect to="/" />} />
            </Router>
        );
    }
}

export default App;
