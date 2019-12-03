import React from "react";
import { Link } from "react-router-dom";
import githubLogo from "../assets/github-logo-red.png";

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
        <Link className="brk-btn" to="/game">
          Fly
        </Link>
        <Link className="brk-btn" to="/scores">
          Rank
        </Link>

        <iframe
          id="soundcloud"
          width="300"
          height="105"
          scrolling="no"
          frameBorder="no"
          allow="off" // autoplay
          src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/862763829&color=%23000000&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true"
        ></iframe>
        <a
          href="https://github.com/Seanhetzel/star-runner"
          target="_blank"
          rel="noopener noreferrer"
          id="github_logo"
        >
          <img src={githubLogo} alt="github" width="50px" height="50px" />
        </a>
        <div id="red_line_top"></div>
      </nav>
    );
  }
}

export default NavBar;
