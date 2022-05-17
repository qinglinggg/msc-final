import React, { Component } from "react";
var charts = {};

class Graph extends React.Component {

  constructor(props) {
    super(props);
    this.resetGraph = this.resetGraph.bind(this);
    this.generateColor = this.generateColor.bind(this);
  }

  state = {
    type : "bar",
    optionData : {}
  }
  colorCount = 1;
  r = [255, 183 ,76];
  g = [0, 121, 204];
  b = [0, 255, 182];

  generateColor() {
    let tempR = this.r[Math.floor(this.colorCount / 9) % 3];
    let tempG = this.g[Math.floor(this.colorCount / 3) % 3];
    let tempB = this.b[Math.floor(this.colorCount / 1) % 3];
    let res = "rgba("+tempR+", "+tempG+", "+tempB+", 0.5)";
    this.colorCount += 1;
    return res;
  }

  resetGraph() {
    if (!this.state.type || !this.state.optionData) return;
    let colorData = [];
    for(let i=0; i < this.props.answerList.length; i++) colorData.push(this.generateColor());
    colorData.map((color, idx) => {
      let par = document.getElementById("item-subgraph-" + this.props.count + idx);
      let el = document.getElementById("color-subgraph-" + this.props.count + idx);
      console.log(color);
      if (el && par) {
        el.style.backgroundColor = color;
        el.style.height = 5 + "px";
        el.style.width = 15 + "px";
      }
    });
    let data = {
      labels: this.props.answerList,
      datasets: [
        {
          data: this.props.countData,
          backgroundColor: colorData,
          borderWidth: 1,
          borderColor: "white"
        }
      ],
    };
    let count = this.props.count;
    let canvas = document.getElementById("graph-" + count);
    if (canvas != null) {
      canvas = canvas.getContext("2d");
    }
    if (typeof charts[count] != "undefined") {
      charts[count].destroy();
    }
    charts[count] = new window.Chart(canvas, {
      type: this.state.type,
      data: data,
      options: this.state.optionData,
    });
  }

  componentDidMount() {
    let tempOpt = {
      plugins: {
        responsive: true,
        maintainAspectRatio: true,
        datalabels: {
          anchor: 'end',
          align: 'end',
          formatter: (val) => (`${val}%`),
          labels: {
            value: {
              color: 'white'
            }
          }
        },
        legend: {
          display: false,
        },
        tooltip: {
          enabled: true,
        },
      },
      layout: {
        padding: {
          left: 50,
          right: 0,
          bottom: 0,
          top: 0,
        },
      },
    };
    this.setState({optionData : tempOpt});
    if(this.props.type == "MC") this.setState({type : "pie"}, () => this.resetGraph());
    else if(this.props.type == "CB") this.setState({type : "bar"}, () => this.resetGraph());
    else if(this.props.type == "SA") this.setState({type : "doughnut"}, () => this.resetGraph());
    else if(this.props.type == "LS") this.setState({type : "radar"}, () => this.resetGraph());
  }

  render() {
    return (
      <React.Fragment>
        { this.props.countData.length > 0 ?
        (
        <div className="graph-section">
          <canvas id={"graph-" + this.props.count} className="graph-chart"></canvas>
          <div className="sub-graph">
            { this.props.countData.map((countSum, ci) => {
              return (
                <React.Fragment>
                    <div className="item-subgraph" id={"item-subgraph-" + this.props.count + ci}>
                      <span id={"color-subgraph-" + this.props.count + ci} className="item-color"></span>
                      <span className="item-text">{ this.props.answerList[ci] } : { countSum }</span>
                    </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>
        ) : 
        (
        <div className="graph-section">No answer found for this question...</div>
        )
        }
      </React.Fragment>
    );
  }
}

export default Graph;
