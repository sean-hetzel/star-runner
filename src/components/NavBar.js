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
                    Rank
                </Link>
                <Link className="brk-btn" to="/profile">
                    Profile
                </Link>
                <iframe
                    id="soundcloud"
                    width="300"
                    height="95"
                    scrolling="no"
                    frameBorder="no"
                    allow="no"
                    src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/862763829&color=%23000000&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true"
                ></iframe>
                <div id="red_line_top"></div>
            </nav>
        );
    }
}

export default NavBar;
