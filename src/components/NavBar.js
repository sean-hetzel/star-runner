import React from "react";
import { Link } from "react-router-dom";
import MusicPlayer from "react-responsive-music-player";
import githubLogo from "../assets/github-logo-red.png";
import WolfAndRaven from "../music/Wolf-and-Raven-On-the-Run.mp3";
import MADES from "../music/M.A.D.E.S-1989.mp3";
import Stilz from "../music/Stilz-See-You-Soon.mp3";
import Neuroc from "../music/Neuroc-Jacked-In.mp3";

const playlist = [
  {
    url: WolfAndRaven,
    cover: "",
    title: "On The Run",
    artist: ["Wolf And Raven"]
  },
  {
    url: MADES,
    cover: "",
    title: "1989",
    artist: ["M.A.D.E.S"]
  },
  {
    url: Stilz,
    cover: "",
    title: "See You Soon",
    artist: ["Stilz"]
  },
  {
    url: Neuroc,
    cover: "",
    title: "Jacked In",
    artist: ["Neuroc"]
  }
];

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

        <MusicPlayer
          playlist={playlist}
          width={100}
          btnColor="red"
          progressColor="red"
          autoplay={false}
        />

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
