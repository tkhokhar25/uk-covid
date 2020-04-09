import React from "react";
import { Line } from "react-chartjs-2";

const Chart = ({ borderColor, backgroundColor, date, data, label, display, height, width }) =>
    <div style={{borderColor, backgroundColor, height, width }} >
        <Line
            data={{
                labels: date,
                datasets: [{
                    label,
                    fill: false,
                    borderColor,
                    data,
                    display
                }]
            }}
            options={{
                legend: {
                    display
                },
                maintainAspectRatio: false,
                scales: {
                    xAxes: [{
                        gridLines: {
                            drawOnChartArea: false,
                            display
                        },
                        ticks: {
                            autoSkip: true,
                            maxTicksLimit: 7,
                            display
                        }
                    }],
                    yAxes: [{
                        gridLines: {
                            drawOnChartArea: false,
                            display
                        },
                        ticks: {
                            autoSkip: true,
                            maxTicksLimit: 7,
                            callback: value => `${value / 1000}k`,
                            display
                        }
                    }]
                }
            }}
        />
    </div>;

export default Chart;

// import React from "react";
// import { Line } from "react-chartjs-2";

// const Chart = ({ borderColor, backgroundColor, date, data, label }) =>
//     <div style={{borderColor, backgroundColor, height:100, width:400 }} >
//         <Line
//             data={{
//                 labels: date,
//                 datasets: [{
//                     label,
//                     fill: false,
//                     display: false,
//                     borderColor,
//                     data,
//                 }]
//             }}
//             options={{
//                 legend: {
//                     display: false
//                  },
//                 maintainAspectRatio: false,
//                 scales: {
//                     xAxes: [{
//                         gridLines: {
//                             drawOnChartArea: false,
//                             display: false
//                         },
//                         ticks: {
//                             autoSkip: true,
//                             maxTicksLimit: 7,
//                             display: false
//                         }
//                     }],
//                     yAxes: [{
//                         gridLines: {
//                             drawOnChartArea: false,
//                             display: false
//                         },
//                         ticks: {
//                             autoSkip: true,
//                             maxTicksLimit: 7,
//                             callback: value => `${value / 1000}k`,
//                             display: false
//                         }
//                     }]
//                 }
//             }}
//         />
//     </div>;

// export default Chart;