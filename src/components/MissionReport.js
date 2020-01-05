import React from "react";
import { EventEmitter } from "../events.js";

const API = "https://agile-atoll-75530.herokuapp.com/api/v1/scores";

function reportScore(score) {
  console.log("report score", score);
  return score;
}

export default function MissionReport() {
  EventEmitter.subscribe("updateScore", score => reportScore(score));

  fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      display_name: "Mariette",
      high_score: reportScore()
    })
  });

  return (
    <div id="mission_report">
      <h1 className="report-text">Report</h1>
      <p>{reportScore()}</p>
    </div>
  );
}
