import React, { Component } from "react";
import {
    HashRouter as Router,
    Route,
    Switch
} from "react-router-dom";
import Navbar from "./components/NavBar";
import Home from "./components/Home";
import Game from "./components/Game";
import Scores from "./components/Scores";
import "./App.css";
import StarField from "./components/StarField";
import NotFound from "./components/NotFound";

const API = "https://agile-atoll-75530.herokuapp.com/api/v1/scores";

class App extends Component {
    constructor() {
        super();
        this.state = {
            scores: [],
            loaded: false,
            hideStars: false
        };
    }

    hideStars = () => {
        document.getElementById("star_field").style.visibility = "hidden";
    };

    showStars = () => {
        document.getElementById("star_field").style.visibility = "visible";
    };

    componentDidMount() {
        fetch(API)
            .then(resp => resp.json())
            .then(
                json => this.setState({ scores: json }, console.log(json)),
                this.setState({ loaded: true })
            );
    }

    render() {
        console.log("app state", this.state);

        return (
            <Router>
                <StarField />
                <Navbar />
                <Switch>
                    <Route
                        path="/"
                        exact
                        render={props => (
                            <Home {...props} showStars={this.showStars} />
                        )}
                    />
                    <Route
                        path="/game"
                        exact
                        render={props => (
                            <Game {...props} hideStars={this.hideStars} />
                        )}
                    />
                    <Route
                        path="/scores"
                        exact
                        render={props => (
                            <Scores
                                {...props}
                                loaded={this.state.loaded}
                                scores={this.state.scores}
                                showStars={this.showStars}
                            />
                        )}
                    />
                    <Route path="*" component={NotFound} />
                </Switch>
            </Router>
        );
    }
}

export default App;
