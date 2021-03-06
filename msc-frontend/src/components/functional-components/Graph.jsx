import React, { Component } from "react";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";

var charts = {};

class Graph extends React.Component {

  constructor(props) {
    super(props);
    this.resetGraph = this.resetGraph.bind(this);
    this.generateColor = this.generateColor.bind(this);
    this.showCountedLabels = this.showCountedLabels.bind(this);
    this.generateOptionsConfig = this.generateOptionsConfig.bind(this);
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
      if (el && par) {
        el.style.backgroundColor = color;
        el.style.height = 5 + "px";
        el.style.width = 15 + "px";
      }
    });
    let data = {};
    data = {
      // setup
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
    try {
      let chartStatus = Chart.getChart("graph-" + count);
      if (chartStatus != undefined) chartStatus.destroy();
    } catch(e) {
      console.log("Failed to destroy chart");
    }
    // config
    charts[count] = new Chart(canvas, {
      type: this.state.type,
      data: data,
      options: this.state.optionData,
      plugins: [ChartDataLabels],
    });
  }

  generateOptionsConfig() {
    let totalCount = 0;
    this.props.countData.map((val) => {
      if(this.props.type != "SA") totalCount += val;
      else totalCount += val.y;
    });
    let tempOpt = {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        x: {
          min: 0,
          ticks: {
            stepSize: 1
          }
        },
        y: {
          min: 0,
          ticks: {
            stepSize: 1
          }
        }
      },
      plugins: {
        title: {
          display: true,
          text: 'Persentase data - ' + totalCount + ' pilihan responden',
          position: 'bottom'
        },
        datalabels: {
          labels: {
            value: {
              color: 'white',
              textAlign: 'center'
            }
          },
          formatter: this.props.type != "SA" ? (
            function(value) {
              let calculateVal = Math.round((value / totalCount) * 100);
              return calculateVal + '%\n' + value + " votes";
            }
          ) : function(value) {
            return value.y;
          }
        },
        legend: {
          display: false,
        },
        tooltip: {
          enabled: true,
          callbacks: {
            label: function(tooltipItem){
              let idx = tooltipItem.formattedValue;
              idx = idx.slice(1, idx.length-1);
              idx = idx.split(',')[0];
              return tooltipItem.dataset.data[idx-1].title;
            }
          }
        }
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
    if(this.props.type != "SA") delete tempOpt.scales;
    console.log(tempOpt);
    this.setState({optionData : tempOpt});
  }

  componentDidMount() {
    this.generateOptionsConfig();
    if(this.props.type == "MC") this.setState({type : "pie"}, () => this.resetGraph());
    else if(this.props.type == "CB") this.setState({type : "doughnut"}, () => this.resetGraph());
    else if(this.props.type == "SA") this.setState({type : "bubble"}, () => this.resetGraph());
    else if(this.props.type == "LS") this.setState({type : "bar"}, () => this.resetGraph());
  }

  showCountedLabels() {
    return this.props.countData.map((countSum, ci) => {
      return (
        <React.Fragment key={"graph-" + ci}>
          <div className="item-subgraph" id={"item-subgraph-" + this.props.count + ci}>
            <span id={"color-subgraph-" + this.props.count + ci} className="item-color"></span>
            <span className="item-text">{ this.props.answerList[ci] } : { this.props.type != "SA" ? countSum : countSum.y}</span>
          </div>
        </React.Fragment>
      );
    });
  }

  countingAnswers() {
    let data = [];
    this.props.answerList.map((d, idx) => {
      data.push({
        index: idx,
        answer: d,
        flag: false
      })
    })
    data.map((current) => {
      if(current.flag) return;
      let count = 1;
      data.map((d, idx) => {
        if(idx == current.index || d.flag) return;
        if(d.answer.toLowerCase() == current.answer.toLowerCase()) {
          count++;
          d.flag = true;
        }
      })
      current.count = count;
      current.flag = true;
    })
    return data;
  }

  // showListedAnswers() {
  //   // let countedAns = this.countingAnswers();
  //   // console.log(countedAns);
  //   let idx = -1;
  //   return (
  //     <div className="shortanswer-list">
  //     {
  //       countedAns.map((ans) => {
  //         idx++;
  //         // if(ans.count == undefined) return;
  //         return (
  //           <React.Fragment>
  //             {/* <div className="shortanswer-item" key={"shortanswerList-" + idx}>
  //               <div className="shortanswer-ans">{ ans.answer }</div>
  //               <div className="shortanswer-count">{ ans.count }</div>
  //             </div> */}
  //             <div className="shortanswer-item" key={"shortanswerList-" + idx}>
  //               <div className="shortanswer-ans">{ ans.answer }</div>
  //               <div className="shortanswer-count">{ ans.count }</div>
  //             </div>
  //           </React.Fragment>
  //         )
  //       })
  //     }
  //     </div>
  //   )
  // }

  render() {
    return (
      <React.Fragment>
        { this.props.countData.length > 0 ?
        (
        <div className="graph-section">
          {/* { this.state.type != "N/A" ? ( */}
          <React.Fragment>
            <canvas id={"graph-" + this.props.count} className="graph-chart"></canvas>
            <div className="sub-graph">
              { this.showCountedLabels() }
            </div>
          </React.Fragment>
          {/* ) : this.showListedAnswers()} */}
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
