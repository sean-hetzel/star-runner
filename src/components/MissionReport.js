import React, { Component } from "react";
import { EventEmitter } from "../events.js";
import wings from "../assets/report-wings.png";

class MissionReport extends Component {
  constructor() {
    super();
    this.state = {
      time: 0,
      damage: 0,
      penalty: 0,
      score: 0,
      pilotName: "",
      gameOver: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.pilotNameRef = React.createRef();
  }

  // idk why this isn't working
  componentDidUpdate() {
    if (this.state.gameOver) {
      this.pilotNameRef.current.focus();
    }
  }

  handleChange(event) {
    this.setState({ pilotName: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.postScore(this.state);
    this.props.history.push("/scores");
  }

  render() {
    EventEmitter.subscribe("updateScore", missionStats =>
      this.setState({
        time: missionStats.time,
        damage: missionStats.damage,
        penalty: missionStats.penalty,
        score: missionStats.score,
        gameOver: missionStats.gameOver
      })
    );

    return (
      <div id="mission_report">
        <h1 className="report-text">MISSION COMPLETE</h1>
        <img src={wings} alt="wings" height={50} width="auto" />
        <table id="report_table">
          <tbody>
            <tr>
              <td className="report_td"> TIME</td>
              <td className="report_td"> {this.state.time}</td>
            </tr>
            <tr>
              <td className="report_td"> DAMAGE</td>
              <td className="report_td">
                {this.state.damage.toLocaleString()}
              </td>
            </tr>
            <tr>
              <td className="report_td"> PENALTY</td>
              <td className="report_td">
                {this.state.penalty.toLocaleString()}
              </td>
            </tr>
            <tr>
              <td className="report_td"> SCORE</td>
              <td className="report_td">{this.state.score.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
        <form onSubmit={this.handleSubmit}>
          <input
            id="report_input"
            type="text"
            required
            placeholder="ENTER PILOT NAME"
            value={this.state.pilotName}
            onChange={this.handleChange}
            ref={this.pilotNameRef}
          />
          <button
            id="submit_button"
            className="brk-btn"
            type="submit"
            value="Submit"
          >
            ENTER
          </button>
        </form>
      </div>
    );
  }
}

export default MissionReport;
