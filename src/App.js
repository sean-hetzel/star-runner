import React, { Component } from "react";
import {
    HashRouter as Router,
    Route,
    Link,
    Redirect,
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

// const stars = document.getElementById("space");

const hideStars = () =>
    (document.getElementById("star_field").style.display = "none");

const showStars = () =>
    (document.getElementById("star_field").style.display = "block");

class App extends Component {
    constructor() {
        super();
        this.state = {
            scores: [],
            loaded: false,
            hideStars: false
        };
    }

    toggleStars = () => {
        console.log("toggled stars");
        this.setState({ hideStars: !this.state.hideStars });
        if (this.state.hideStars === true) {
            hideStars();
            console.log("stars should be hidded");
        } else {
            showStars();
            console.log("stars should not be hidden");
        }
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
                    <Route path="/" exact component={Home} />
                    <Route
                        path="/scores"
                        exact
                        render={props => (
                            <Scores
                                {...props}
                                loaded={this.state.loaded}
                                scores={this.state.scores}
                                toggleStars={this.toggleStars}
                            />
                        )}
                    />
                    <Route
                        path="/game"
                        exact
                        render={props => (
                            <Game {...props} toggleStars={this.toggleStars} />
                        )}
                    />
                    <Route path="*" component={NotFound} />
                </Switch>
            </Router>
        );
    }
}

export default App;
