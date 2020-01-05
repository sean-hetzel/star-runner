import React, { Component } from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import StarField from "./components/StarField";
import Navbar from "./components/NavBar";
import Home from "./components/Home";
import Game from "./components/Game";
import Scores from "./components/Scores";
import NotFound from "./components/NotFound";

const API = "https://agile-atoll-75530.herokuapp.com/api/v1/scores";

class App extends Component {
  constructor() {
    super();
    this.state = {
      scores: []
    };
  }

  hideStars = () => {
    document.getElementById("star_field").style.visibility = "hidden";
  };

  showStars = () => {
    document.getElementById("star_field").style.visibility = "visible";
  };

  fin = penalty => {
    console.log("pennnalty", penalty)

  }

  componentDidMount() {
    fetch(API)
      .then(resp => resp.json())
      .then(json => this.setState({ scores: json }));
  }

  render() {
    return (
      <Router>
        <StarField />
        <Navbar />
        <Switch>
          <Route
            path="/"
            exact
            render={props => <Home {...props} showStars={this.showStars} />}
          />
          <Route
            path="/game"
            exact
            render={props => <Game {...props} hideStars={this.hideStars} fin={this.fin}/>}
          />
          <Route
            path="/scores"
            exact
            render={props => (
              <Scores
                {...props}
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
