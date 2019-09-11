import React from "react";
import { Link } from "react-router-dom";

class NavBar extends React.Component {
    render() {
        return (
            <nav id="nav_bar">
                <Link id="star_runner_logo" to="/">
                    STAR RUNNER
                </Link>
                <Link className="brk-btn" to="/">
                    Home
                </Link>
                <Link className="brk-btn" to="/play">
                    Fly
                </Link>
                <Link className="brk-btn" to="/scores">
                    Stats
                </Link>
                <Link className="brk-btn" to="/profile">
                    Profile
                </Link>
            </nav>
        );
    }
}

export default NavBar;
