import React, { useState, useEffect } from "react";
import UKMap from './components/UKMap.jsx';
import ReactTooltip from "react-tooltip";
import { Container, Row, Col } from 'reactstrap';
import CovidTable from "./components/CovidTable.jsx";
import { Button } from 'reactstrap';
import Chart from './components/Chart.jsx';
import Dashboard from "./components/Dashboard.jsx";
import { Red, Blue, Grey, LightRed, LightBlue, LightGrey } from './components/Constants.jsx';
import Sketcher from './components/Sketcher.jsx';

const borderColors = [Red, Blue, Grey];
const backgroundColors = [LightRed, LightBlue, LightGrey];
const labels = ['CONFIRMED', 'TESTED', 'DECEASED'];

const App = () => {
    const [cases, setCases] = useState(null);
    const [content, setContent] = useState('');
    const [areaCases, setAreaCases] = useState([]);
    const [Regional, toggleDisplayRegional] = useState({ display: false, fileName: '', regionCases: '' });
    const [secondaryTable, setSecondaryTable] = useState({ display: false, areaName: '' });
    const [displaySimulator, setDisplaySimulator] = useState(false);

    useEffect(() => {
        fetch(process.env.PUBLIC_URL + "/covid_data/uk_totals.json")
            .then(response => {
                if (response.status !== 200) {
                    console.log(`There was a problem: ${response.status}`)
                    return
                }
                response.json().then(cases => {
                    setCases(cases);
                })
            });
        
        fetch(process.env.PUBLIC_URL + "/covid_data/uk_by_region.json")
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
        <div>
            {displaySimulator ? <Sketcher setDisplaySimulator={setDisplaySimulator}/> :
          <Container data-tip=''>
              <Row>
                  <h1>{'England Covid-19 Tracker'}</h1>
                  <Button color='primary' onClick={() => setDisplaySimulator(true)}><h4>View Simulator</h4></Button>
              </Row>
              <Row>
                  <Col>
                      {cases === null ? null : <Dashboard borderColors={borderColors} backgroundColors={backgroundColors} labels={labels} cases={cases} /> }
                      <Col>
                          <UKMap setTooltipContent={setContent} areaCases={areaCases} Regional={Regional} toggleDisplayRegional={toggleDisplayRegional} secondaryTable={secondaryTable} setSecondaryTable={setSecondaryTable} />
                          <ReactTooltip>{content}</ReactTooltip>
                          {/* {(localCases === null || content==='') ? null : <Chart borderColor={borderColors[0]} backgroundColor={backgroundColors[0]} label={labels[0]} date={localCases.Date} data={localCases['East Midlands'].Derby} display={true} height={200} width={700} />} */}
                      </Col>
                  </Col>
                  <Col>
                      <CovidTable areaCases={areaCases} toggleDisplayRegional={toggleDisplayRegional} secondaryTable={secondaryTable} setSecondaryTable={setSecondaryTable} />
                  </Col>
              </Row>
              <Row>
                  {cases === null ? null : borderColors.map((color, i)=> <Chart borderColor={borderColors[i]} backgroundColor={backgroundColors[i]} label={labels[i]} date={cases.Date} data={cases[Object.keys(cases)[i]]} display={true} height={200} width={700} />)}
              </Row>
              <Row>
                  <Button style={{backgroundColor: 'White', color: 'black'}} onClick={() => window.open('https://www.github.com/tkhokhar25/uk-covid')}>
                      <img src={process.env.PUBLIC_URL + '/logo32.png'} alt='yolo'></img>Check out on Github
                  </Button>
              </Row>
          </Container>
          }
      </div>
    )
}

export default App;