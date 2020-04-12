import React, { useState, useEffect } from "react";
import { geoMercator } from "d3-geo";
import { schemeReds } from "d3-scale-chromatic";
import { scaleThreshold } from "d3-scale";
import { feature } from "topojson-client";
import {
  ComposableMap,
  Geographies,
  Geography,
} from "react-simple-maps";
import { Button } from 'reactstrap';
// import {isMobile} from 'react-device-detect';

import RegionalMap from "./RegionalMap";

const width = 800;
const height = 800;

const UKMap = ({ setTooltipContent, areaCases, Regional, toggleDisplayRegional, secondaryTable, setSecondaryTable, setGraphData, localCases }) => {
  const [geographies, setGeographies] = useState([]);

  useEffect(() => {
    fetch(process.env.PUBLIC_URL + "/maps/phe_regions.json")
      .then(response => {
        if (response.status !== 200) {
          console.log(`There was a problem: ${response.status}`)
          return
        }
        response.json().then(worlddata => {
          setGeographies(feature(worlddata, worlddata.objects.eer).features)
        })
      })
  }, []);

  const handleRegionClick = regionIndex => {
    const regionName = geographies[regionIndex].properties.EER13NM
    const fileName = regionName.replace(/ /g, '_')

    setTooltipContent("");
    setGraphData({display: true, data: localCases.Totals[geographies[regionIndex].properties.EER13NM] })
    toggleDisplayRegional({ display: true, fileName, regionCases: areaCases[regionName].regional, regionName });
    setSecondaryTable({ display: true, areaName: regionName })
  }

  const projection = geoMercator().fitSize([width, height], {type:"FeatureCollection", features: geographies})
    
  var colorScale = scaleThreshold()
    .domain([1000, 1500, 2000, 2500, 5000, 15000])
    .range(schemeReds[7]);


    const UK = () => {
      return (
      <div>
      {/* <div> */}
        <ComposableMap width={ width } height={ height } projection={projection} >
            <Geographies geography={geographies}>
              {({ geographies }) =>
                geographies.map((geo, idx) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={() => {
                      setTooltipContent(`${geo.properties.EER13NM}: ${areaCases[geo.properties.EER13NM].total} Cases`);
                      setGraphData({display: true, data: localCases.Totals[geo.properties.EER13NM] })
                    }}
                    onMouseLeave={() => {
                      setTooltipContent("");
                      setGraphData({display: false, data: [] })
                    }}
                    fill={geo.properties.EER13NM in areaCases ? colorScale(areaCases[geo.properties.EER13NM].total) : colorScale(0)}
                    onClick={() => handleRegionClick(idx)}
                    style={{
                      default: {
                        outline: "none",
                        stroke: "#000000",
                        strokeWidth: "0.5"
                      },
                      hover: {
                        // fill: "#F53",
                        outline: "none",
                        stroke: "#000000",
                        strokeWidth: "2"
                      },
                      pressed: {
                        outline: "none"
                      }
                    }}
                  />
                ))
              }
            </Geographies>
        </ComposableMap>
      </div>
    )};

    const Region = () => 
      <div>
        <Button color='primary' onClick={() => { toggleDisplayRegional({display: false}); setSecondaryTable({ ...secondaryTable, display: false }); }}>BACK</Button>
        <RegionalMap fileName={Regional.fileName} regionCases={Regional.regionCases} regionName={Regional.regionName} setTooltipContent={setTooltipContent} setGraphData={setGraphData} localCases={localCases} />
      </div>

  return (
    <div style={{height: '600px'}} >
{Regional.display ? <Region /> : <UK />
        }
    </div>

  )
}

export default React.memo(UKMap);