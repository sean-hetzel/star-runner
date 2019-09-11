import React from "react";
import { Link } from "react-router-dom";

class Home extends React.Component {
    render() {
        return (
            <>
                <h1>Welcome Pilot</h1>
                <h2>The off world colonies need your help. The replicants are cutting off supply lines. 
                    Your mission is to deliver critical medical supplies to Arcadia 234 and to eliminate any hostile replicants along the way. </h2><br></br>
                <h1>Controls:</h1>
                <h2></h2>
                <Link className="brk-btn" to="/play">
                    Fly
                </Link>
            </>
        );
    }
}
export default Home;
