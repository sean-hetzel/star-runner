import React from "react";
import { Link } from "react-router-dom";

class Home extends React.Component {
    render() {
        return (
            <>
                <h4 className="home_info">STAR DATE: JULY 2, 2154</h4>
                <h4 className="home_info">LOGS: PRE-FLIGHT BREIF</h4>
                <h4 className="home_info">STATUS: URGENT</h4>
                <h4 className="home_info">>_</h4>
                <br></br>
                <h1>WELCOME PILOT</h1>
                <h2>
                    The off world colonies need your help. The replicants are
                    cutting off supply lines and endangering millions. Your mission is to
                    deliver critical releif supplies to Arcadia 234 and
                    eliminate any hostile replicants along the way.{" "}
                </h2>
                <br></br>

                <h1>CONTROLS:</h1>
                <h2>
                    FLY UP ▲ | FLY DOWN ▼ | FLY BACKWARD ◄ | FLY FORWARD ► |
                    SHOOT ⎵
                </h2>
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
