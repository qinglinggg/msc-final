import React, { Component } from 'react';

class Graph extends React.Component {
    componentDidMount() {
        let dummyData = {
            labels: ['Boston', 'Worcester', 'Springfield', 'Lowell', 'Cambridge', 'New Bedford'],
            datasets: [{
              label: 'Population',
              data: [
                617594,
                181045,
                153060,
                106519,
                105162,
                95072
              ],
              // backgroundColor: 'green',
              backgroundColor: [
                'rgba(255,99,132,0.6)',
                'rgba(54,162,235,0.6)'
              ],
              borderWidth: 1,
              borderColor: 'gray',
              // hoverBorderWidth: 1,
              // hoverBorderColor: 'black'
            }]
          };
    
        let optionsData = {
          plugins: {
            title: {
              display: true,
              text: 'Largest Cities in Massachussets',
              fontSize: 35
            },
            legend: {
              display: false,
              position: 'right',
              labels: {
                fontColor: 'black'
              }
            },
            tooltip: {
              enabled: false
            }
          },
          layout: {
            padding: {
              left: 50,
              right: 0,
              bottom: 0,
              top: 0
            }
          }
        };
        if (graph1_chart != null) {
            graph1_chart.destroy();
        }
        try {
            
        let graph1 = document.getElementById('graph1').getContext('2d');
        let graph1_chart = new window.Chart(graph1, {type: 'bar', data: dummyData, options: optionsData});
        } catch (e) {

        }
    }

    render() {
        return(
            <React.Fragment>
                <canvas id="graph1"></canvas>
            </React.Fragment>
        );
    }
}
 
export default Graph;