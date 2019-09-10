import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link, Redirect, Switch } from "react-router-dom";
import Navbar from "./components/NavBar";
import Home from "./components/Home";
import Play from "./components/Play";
import Profile from "./components/Profile";
import Scores from "./components/Scores";
import "./App.css";

class App extends Component {
	state = {
		userName: ""
	}
	
  
	render() {
  
	  return (
		<Router>

		  <Navbar />
			<Route path="/" exact component={Home} />
			<Route path="/profile" exact render={(props) => <Profile {...props} user={this.state} />} />
			<Route path="/scores" render={(props) => <Scores {...props} user={this.state} />} />
			<Route path="/play" component={Play} />
			<Route render={() => <Redirect to="/" />} />
		</Router>
	  )
	}
  }

export default App;
