import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import UKMap from './components/UKMap.jsx';
import ReactTooltip from "react-tooltip";
import { Container, Row, Col } from 'reactstrap';

const App = () => {
    const [cases, setCases] = useState(null)
    const [content, setContent] = useState('');

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
    }, [])
      
    const ConfirmedChart = () =>
                <Line
                    data={{
                        labels: cases.Date,
                        datasets: [{
                            label: 'Confirmed Cases',
                            backgroundColor: 'red',
                            borderColor: 'red',
                            data: cases.ConfirmedCases,
                        }]
                    }}
                    options={{
                        maintainAspectRatio: false,
                    }}
                />;

    const TestsChart = () =>
        <Line
            data={{
                labels: cases.Date,
                datasets: [{
                    label: 'Tests',
                    backgroundColor: 'blue',
                    borderColor: 'blue',
                    data: cases.Tests,
                }]
            }}
            options={{
                maintainAspectRatio: false,
            }}
        />;

    const DeathsChart = () =>
        <Line
            data={{
                labels: cases.Date,
                datasets: [{
                    label: 'Deaths',
                    backgroundColor: 'grey',
                    borderColor: 'grey',
                    data: cases.Deaths,
                }]
            }}
            options={{
                maintainAspectRatio: false,
            }}
        />;

  return (
    <Container data-tip=''>
        <Row>
            <Col>
                <h1>{'UK Covid-19'}</h1>
            </Col>
        </Row>
        <Row>
            <Col>
                <UKMap setTooltipContent={setContent} />
                <ReactTooltip>{content}</ReactTooltip>
            </Col>
            <Col>
                <Row>{cases === null ? null : <div style={{height:200, width:400}}><ConfirmedChart /></div>}</Row>
                <Row>{cases === null ? null : <div style={{height:200, width:400}}><TestsChart /></div>}</Row>
                <Row>{cases === null ? null : <div style={{height:200, width:400}}><DeathsChart /></div>}</Row>
            </Col>
        </Row>
        <Row>
            
        </Row>
    </Container>
  )
}

export default App;