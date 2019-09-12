import React, { Component } from "react";

class Scores extends React.Component {
    render() {
        return (
            <>
                <h1>HIGH SCORES:</h1>;
                {this.props.scores.map(user => {
                    return <> <h1>{user.display_name} {user.high_score}</h1></>;
                })}
            </>
        );
    }
}

export default Scores;
