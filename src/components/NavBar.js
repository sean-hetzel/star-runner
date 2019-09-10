import React from "react";
import { Link } from 'react-router-dom'

class NavBar extends React.Component {
  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">

        <div className="collapse navbar-collapse" id="navbarColor01">
          <ul className="navbar-nav mr-auto">
              <Link className="brk-btn" to="/">
                Home
              </Link>
              <Link className="brk-btn" to="/play">
                Play
              </Link>
              <Link className="brk-btn" to="/scores">
                Stats
              </Link>
              <Link className="brk-btn" to="/profile">
                Profile
              </Link>
          </ul>
        </div>
      </nav>
    );
  }
}

export default NavBar;