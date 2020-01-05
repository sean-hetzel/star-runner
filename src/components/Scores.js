import React from "react";
import PreLoader from "./PreLoader";

class Scores extends React.Component {
  
  componentDidMount() {
    this.props.showStars();
  }

  renderTableData(i) {
    return this.props.scores.map(score => {
      const { id, display_name, high_score } = score;
      return (
        <tr key={id}>
          <td className="rank">{i}</td>
          <td>{display_name}</td>
          <td>{high_score.toLocaleString()}</td>
          {i++}
        </tr>
      );
    });
  }

  render() {
    let i = 1;
    return (
      <>
        <h1>HIGH SCORES</h1>;
        <table>
          <tbody>
            <tr>
              <th>RANK</th>
              <th>PILOT</th>
              <th>HIGHEST SCORE</th>
            </tr>
            {this.renderTableData(i)}
          </tbody>
        </table>
        {this.props.scores.length > 0 ? null : <PreLoader />}
      </>
    );
  }
}

export default Scores;
