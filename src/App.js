import React, { useState, useEffect } from "react";
import UKMap from './components/UKMap.jsx';
import ReactTooltip from "react-tooltip";
import { Container, Row, Col } from 'reactstrap';
import CovidTable from "./components/CovidTable.jsx";
import { Button } from 'reactstrap';
import Chart from './components/Chart.jsx';

const App = () => {
    const [cases, setCases] = useState(null)
    const [content, setContent] = useState('');
    const [areaCases, setAreaCases] = useState([]);
    const [Regional, toggleDisplayRegional] = useState({ display: false, fileName: '', regionCases: '' });
    const [secondaryTable, setSecondaryTable] = useState({ display: false, areaName: '' });

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

  return (
    <Container data-tip=''>
        <Row>
            <Col>
                <h1>{'England Covid-19 Tracker'}</h1>
            </Col>
        </Row>
        <Row>
            <Col>
                <UKMap setTooltipContent={setContent} areaCases={areaCases} Regional={Regional} toggleDisplayRegional={toggleDisplayRegional} secondaryTable={secondaryTable} setSecondaryTable={setSecondaryTable} />
                <ReactTooltip>{content}</ReactTooltip>
            </Col>
            <Col>
                <CovidTable areaCases={areaCases} toggleDisplayRegional={toggleDisplayRegional} secondaryTable={secondaryTable} setSecondaryTable={setSecondaryTable} />
                
            </Col>
        </Row>
        <Row>{cases === null ? null : <Chart borderColor={'#ff073a'} backgroundColor={'rgba(255,7,58,0.12549)'} date={cases.Date} data={cases.ConfirmedCases} label={'Confirmed Cases'} />} </Row>
        <Row>{cases === null ? null : <Chart borderColor={'#3a07ff'} backgroundColor={'rgba(58,7,255,0.12549)'} date={cases.Date} data={cases.Tests} label={'Tests'} />} </Row>
        <Row>{cases === null ? null : <Chart borderColor={'grey'} backgroundColor={'#DCDCDC'} date={cases.Date} data={cases.Deaths} label={'Deaths'} />} </Row>
        <Row>
            <Button style={{backgroundColor: 'White', color: 'black'}} onClick={() => window.open('https://www.github.com/tkhokhar25/uk-covid')}>
                <img src='/logo32.png' alt='yolo'></img>Check out on Github
            </Button>
        </Row>
    </Container>
  )
}

export default App;