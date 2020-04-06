import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import UKMap from './components/UKMap.jsx';
import ReactTooltip from "react-tooltip";

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

    console.log(content);
  return (
    <div data-tip=''>
        <UKMap setTooltipContent={setContent} />
        <ReactTooltip>{content}</ReactTooltip>
        {cases === null ? null : <div style={{height:200, width:400}}><ConfirmedChart /></div>}
        {cases === null ? null : <div style={{height:200, width:400}}><TestsChart /></div>}
        {cases === null ? null : <div style={{height:200, width:400}}><DeathsChart /></div>}
    </div>
  )
}

export default App;