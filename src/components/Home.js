import React from "react";
import { Link } from "react-router-dom";

class Home extends React.Component {
    render() {
        return (
            <>
                <h2 className="home_info">STAR DATE: JULY 2, 2154</h2>
                <h2 className="home_info">LOGS: PRE-FLIGHT BREIF</h2>
                <h2 className="home_info">STATUS: URGENT</h2>
                <h2 className="home_info">>_</h2>
                <br></br>
                <h1>WELCOME PILOT</h1>
                <h2>
                    The off world colonies need your help. The replicants are
                    cutting off supply lines and revolting. Your mission is to
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
