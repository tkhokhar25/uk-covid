import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import UKMap from './components/UKMap.jsx';
import ReactTooltip from "react-tooltip";
import { Container, Row, Col } from 'reactstrap';
import CovidTable from "./components/CovidTable.jsx";
import { Fade } from 'reactstrap';

const App = () => {
    const [cases, setCases] = useState(null)
    const [content, setContent] = useState('');
    const [areaCases, setAreaCases] = useState([]);

    useEffect(() => {
        fetch("/covid_data/uk_totals.json")
            .then(response => {
                if (response.status !== 200) {
                    console.log(`There was a problem: ${response.status}`)
                    return
                }
                response.json().then(cases => {
                    setCases(cases);
                })
            });
        
        fetch("/covid_data/uk_by_region.json")
            .then(response => {
              if (response.status !== 200) {
                console.log(`There was a problem: ${response.status}`)
                return
              }
              response.json().then(cases => {
                setAreaCases(cases);
              })
            })
    }, [])
      
    const ConfirmedChart = () =>
            <div style={{backgroundColor:'rgba(255,7,58,0.12549)'}} >
                <Line
                    data={{
                        labels: cases.Date,
                        datasets: [{
                            label: 'Confirmed Cases',
                            fill: false,
                            borderColor: '#ff073a',
                            data: cases.ConfirmedCases,
                        }]
                    }}
                    options={{
                        maintainAspectRatio: false,
                        scales: {
                            xAxes: [{
                                gridLines: {
                                    display:false
                                },
                                ticks: {
                                    autoSkip: true,
                                    maxTicksLimit: 7
                                }
                            }],
                            yAxes: [{
                                gridLines: {
                                    display:false
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

    const TestsChart = () =>
        <div style={{backgroundColor: 'rgba(58,7,255,0.12549)'}}>
            <Line
                data={{
                    labels: cases.Date,
                    datasets: [{
                        label: 'Tests',
                        fill: false,
                        borderColor: '#3a07ff',
                        data: cases.Tests
                    }]
                }}
                options={{
                    maintainAspectRatio: false,
                    scales: {
                        xAxes: [{
                            gridLines: {
                                display:false
                            },
                            ticks: {
                                autoSkip: true,
                                maxTicksLimit: 7,
                            }
                        }],
                        yAxes: [{
                            gridLines: {
                                display:false
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

    const DeathsChart = () =>
    <div style={{backgroundColor: '#DCDCDC'}}>
        <Line
            data={{
                labels: cases.Date,
                datasets: [{
                    label: 'Deaths',
                    fill: false,
                    borderColor: 'grey',
                    data: cases.Deaths,
                }]
            }}
            options={{
                maintainAspectRatio: false,
                scales: {
                    xAxes: [{
                        gridLines: {
                            display:false
                        },
                        ticks: {
                            autoSkip: true,
                            maxTicksLimit: 7
                        }
                    }],
                    yAxes: [{
                        gridLines: {
                            display:false
                        },
                        ticks: {
                            autoSkip: true,
                            maxTicksLimit: 7,
                            callback: value => `${value / 1000}k`
                        }
                    }]
                }
            }}
        /></div>;

  return (
    <Container data-tip=''>
        <Fade>
            <Row>
                <Col>
                    <h1>{'England Covid-19 Tracker'}</h1>
                </Col>
            </Row>
            <Row>
                <Col>
                    <UKMap setTooltipContent={setContent} areaCases={areaCases} />
                    <ReactTooltip>{content}</ReactTooltip>
                </Col>
                <Col>
                    <Row>{cases === null ? null : <div style={{height:200, width:700}}><ConfirmedChart /></div>}</Row>
                    <Row>{cases === null ? null : <div style={{height:200, width:700}}><TestsChart /></div>}</Row>
                    <Row>{cases === null ? null : <div style={{height:200, width:700}}><DeathsChart /></div>}</Row>
                </Col>
            </Row>
            <Row>
                <CovidTable areaCases={areaCases} />
            </Row>
        </Fade>
    </Container>
  )
}

export default App;