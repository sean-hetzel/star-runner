import React from "react";
import { Link } from "react-router-dom";

class Home extends React.Component {
    render() {
        return (
            <>
                <div id="space">
                    <div className="stars"></div>
                    <div className="stars"></div>
                    <div className="stars"></div>
                    <div className="stars"></div>
                    <div className="stars"></div>
                </div>
                <h4 className="home_info">STAR DATE: JULY 2, 2154</h4>
                <h4 className="home_info">LOGS: PRE-FLIGHT BREIF</h4>
                <h4 className="home_info">STATUS: URGENT</h4>
                <h4 className="home_info">>_</h4>
                <br></br>
                <h1>WELCOME PILOT</h1>
                <h2>
                    The off-world colonies need your help. A group of replicants
                    have cut off supply lines and destroyed one of our transport
                    ships. Your mission is to deliver critical relief supplies
                    to Arcadia 234 and eliminate any replicants along the way.
                    This uprising must be silenced before it gets out of hand.
                    Time is of the essence.
                </h2>
                <br></br>
                <h1>CONTROLS:</h1>
                <h2 id="cont_desc_1">FLY UP </h2>
                <h2 id="up_arrow">▲</h2>
                <h2 id="cont_desc_2"> | FLY DOWN </h2>
                <h2 id="down_arrow">▼</h2>
                <h2 id="cont_desc_3"> | FLY BACKWARD </h2>
                <h2 id="left_arrow">◄</h2>
                <h2 id="cont_desc_4"> | FLY FORWARD </h2>
                <h2 id="right_arrow">►</h2>
                <h2 id="cont_desc_5"> | SHOOT</h2>
                <h2 id="space_bar"> ⎵</h2>
                <br></br>
                <br></br>
                <br></br>
                <h1>Good luck out there. You'll need it.</h1>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <Link className="brk-btn" to="/play">
                    Fly
                </Link>
            </>
        );
    }
}
export default Home;
