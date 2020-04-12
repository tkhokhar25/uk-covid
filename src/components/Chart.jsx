import React from "react";
import { Line } from "react-chartjs-2";
import { Col } from 'reactstrap';

const Chart = ({ borderColor, backgroundColor, date, data, label, display, height, width }) =>
    <Col xs='12' style={{borderColor, backgroundColor, height, width }} >
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
    </Col>;

export default Chart;
