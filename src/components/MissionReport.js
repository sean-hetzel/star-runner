import React from "react";
import { EventEmitter } from "../events.js";

const API = "https://agile-atoll-75530.herokuapp.com/api/v1/scores";

class MissionReport extends React.Component {
  constructor() {
    super();
    this.state = {
      score: 0
    };
  }

  render() {
    EventEmitter.subscribe("updateScore", score =>
      this.setState({ score: score })
    );
    fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        display_name: "K",
        high_score: this.state.score
      })
    });
    return (
      <div id="mission_report">
        <h1 className="report-text">Report</h1>
        <p>{this.state.score}</p>
      </div>
    );
  }
}

export default MissionReport;
