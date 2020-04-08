import React from "react";
import { Line } from "react-chartjs-2";

const Chart = ({ borderColor, backgroundColor, date, data, label }) =>
    <div style={{borderColor, backgroundColor, height:200, width:700 }} >
        <Line
            data={{
                labels: date,
                datasets: [{
                    label,
                    fill: false,
                    borderColor,
                    data,
                }]
            }}
            options={{
                maintainAspectRatio: false,
                scales: {
                    xAxes: [{
                        gridLines: {
                            drawOnChartArea: false
                        },
                        ticks: {
                            autoSkip: true,
                            maxTicksLimit: 7
                        }
                    }],
                    yAxes: [{
                        gridLines: {
                            drawOnChartArea: false
                        },
                        ticks: {
                            autoSkip: true,
                            maxTicksLimit: 7,
                            callback: value => `${value / 1000}k`
                        }
                    }]
                }
            }}
        />
    </div>;

export default Chart;