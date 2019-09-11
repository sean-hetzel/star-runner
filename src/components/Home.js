import React from "react";
import { Link } from "react-router-dom";

class Home extends React.Component {
    render() {
        return (
            <>
                <h1>WELCOME PILOT</h1>
                <h2>> The off world colonies need your help. The replicants are cutting off supply lines. 
                    Your mission is to deliver critical medical supplies to Arcadia 234 and to eliminate any hostile replicants along the way. >_</h2><br></br>
                    
                <h1>CONTROLS:</h1>
                <h2>FLY UP ▲ | FLY DOWN ▼ | FLY BACK ◄ | FLY FORWARD ► | SHOOT ⎵</h2><br></br>
                <h1>Good luck out there. You'll need it.</h1><br></br>
                <Link className="brk-btn" to="/play">
                    Fly
                </Link>
            </>
        );
    }
}
export default Home;
