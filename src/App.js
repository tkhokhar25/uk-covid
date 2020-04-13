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
    const [localCases, setLocalCases] = useState(null);
    const [graphData, setGraphData] = useState({ data: [], display: false });
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

        fetch(process.env.PUBLIC_URL + "/covid_data/local_totals.json")
            .then(response => {
                if (response.status !== 200) {
                    console.log(`There was a problem: ${response.status}`)
                    return
                }
                response.json().then(cases => {
                    setLocalCases(cases);
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
    console.log(graphData);

    return (
        <div style={{maxWidth: window.innerWidth}}>
            {displaySimulator ? <Sketcher setDisplaySimulator={setDisplaySimulator}/> :
          <Container data-tip=''>
                <Row style={{paddingTop: '25px'}}>
                    <Col xs='12' md='6'><h1>{'England Covid-19 Tracker'}</h1></Col>
                  <Col xs='12' md='6' style={{paddingBottom: '25px'}}><Button color='primary' onClick={() => setDisplaySimulator(true)}><h4>View Simulator</h4></Button></Col>
              </Row>
              <Row>
                <Col>{cases === null ? null : <Dashboard borderColors={borderColors} backgroundColors={backgroundColors} labels={labels} cases={cases} /> } </Col>
              </Row>
              <Row>
                <Col xs='12' md='6'>
                    <UKMap setTooltipContent={setContent} areaCases={areaCases} Regional={Regional} toggleDisplayRegional={toggleDisplayRegional} secondaryTable={secondaryTable} setSecondaryTable={setSecondaryTable} setGraphData={setGraphData} localCases={localCases} />
                    <ReactTooltip>{content}</ReactTooltip>
                    {graphData.display ? <h2 style={{marginLeft: '25px'}}>{content}</h2> : null}
                    {graphData.display ? <Chart borderColor={borderColors[0]} backgroundColor={backgroundColors[0]} label={labels[0]} date={localCases.Date} data={graphData.data} display={true} height={200} width={700} /> : null }
                    <h2 style={{marginLeft: '25px'}}>{'England Trends'}</h2>
                    {cases === null ? null : borderColors.map((color, i)=> <Chart borderColor={borderColors[i]} backgroundColor={backgroundColors[i]} label={labels[i]} date={cases.Date} data={cases[Object.keys(cases)[i]]} display={true} height={200} width={700} />)}
                </Col>
                <Col xs='12' md='6'>
                    <CovidTable areaCases={areaCases} toggleDisplayRegional={toggleDisplayRegional} secondaryTable={secondaryTable} setSecondaryTable={setSecondaryTable} />
                </Col>
              </Row>
              <Row>
                  <Col xs='12' style={{margin: '25px'}}>
                    <Button style={{backgroundColor: 'White', color: 'black'}} onClick={() => window.open('https://www.github.com/tkhokhar25/uk-covid')}>
                        <img src={process.env.PUBLIC_URL + '/logo32.png'} alt='yolo'></img>Check out on Github
                    </Button>
                </Col>
              </Row>
          </Container>
          }
      </div>
    )
}

export default App;