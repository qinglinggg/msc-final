import React, { Component } from "react";
var charts = {};

class Graph extends React.Component {
  componentDidMount() {
    let dummyData = {
      labels: [
        "Boston",
        "Worcester",
        "Springfield",
        "Lowell",
        "Cambridge",
        "New Bedford",
      ],
      datasets: [
        {
          label: "Population",
          data: [617594, 181045, 153060, 106519, 105162, 95072],
          // backgroundColor: 'green',
          backgroundColor: ["rgba(255,99,132,0.6)", "rgba(54,162,235,0.6)"],
          borderWidth: 1,
          borderColor: "gray",
          // hoverBorderWidth: 1,
          // hoverBorderColor: 'black'
        },
      ],
    };

    let optionsData = {
      plugins: {
        title: {
          display: true,
          text: "Largest Cities in Massachussets",
          fontSize: 35,
        },
        legend: {
          display: false,
          position: "right",
          labels: {
            fontColor: "black",
          },
        },
        tooltip: {
          enabled: false,
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
    // let chartTopics = ["question1"];
    // chartTopics.forEach((topic) => {
    //   let canvas = document.getElementById("graph1").getContext("2d");
    //   if (typeof charts[topic] != "undefined") {
    //     charts[topic].destroy();
    //   }
    //   charts[topic] = new window.Chart(canvas, {
    //     type: "bar",
    //     data: dummyData,
    //     options: optionsData,
    //   });
    // });
    let count = this.props.count;
    // console.log("graph" + count);
    let canvas = document.getElementById("graph" + count);
    if (canvas != null) {
      // console.log(canvas);
      canvas = canvas.getContext("2d");
    } else {
      // console.log(canvas);
    }
    if (typeof charts[count] != "undefined") {
      charts[count].destroy();
    }
    charts[count] = new window.Chart(canvas, {
      type: "bar",
      data: dummyData,
      options: optionsData,
    });
  }

  render() {
    return (
      <React.Fragment>
        <canvas id={"graph" + this.props.count}></canvas>
      </React.Fragment>
    );
  }
}

export default Graph;
