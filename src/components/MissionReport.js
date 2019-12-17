import React, { Component } from 'react'

export default class MissionReport extends Component {
  render() {
    return (
      <div className="report">
      {console.log("report3")}
      <h1 className="report-text">Report</h1>
      <h4 className="report-text">{this.props.report}</h4>
    </div>
    )
  }
}
