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

import RegionalMap from "./RegionalMap";

const width = 20;
const height = 20;

const UKMap = ({ setTooltipContent, areaCases, Regional, toggleDisplayRegional, secondaryTable, setSecondaryTable }) => {
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

  const handleCountryClick = countryIndex => {
    const regionName = geographies[countryIndex].properties.EER13NM
    const fileName = regionName.replace(/ /g, '_')

    toggleDisplayRegional({ display: true, fileName, regionCases: areaCases[regionName].regional });
    setSecondaryTable({ display: true, areaName: regionName })
  }

  const projection = geoMercator().fitSize([width, height], {type:"FeatureCollection", features: geographies})
    
  var colorScale = scaleThreshold()
    .domain([1000, 1500, 2000, 2500, 5000, 15000])
    .range(schemeReds[7]);


    const UK = () => {
      return (
      <div style={{width: "700px", height: "700px"}} >
        <ComposableMap width={ width } height={ height } projection={projection} >
            <Geographies geography={geographies}>
              {({ geographies }) =>
                geographies.map((geo, idx) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={() => {
                      setTooltipContent(`${geo.properties.EER13NM}: ${areaCases[geo.properties.EER13NM].total} Cases`);
                    }}
                    onMouseLeave={() => {
                      setTooltipContent("");
                    }}
                    fill={geo.properties.EER13NM in areaCases ? colorScale(areaCases[geo.properties.EER13NM].total) : colorScale(0)}
                    onClick={() => handleCountryClick(idx)}
                    style={{
                      default: {
                        outline: "none",
                        stroke: "#000000",
                        strokeWidth: "0.01"
                      },
                      hover: {
                        // fill: "#F53",
                        outline: "none",
                        stroke: "#000000",
                        strokeWidth: "0.05"
                      },
                      pressed: {
                        outline: "none"
                      }
                    }}
                  />
                ))
              }
            </Geographies>
            {/* <Annotation
              subject={[ 1.4360, 52.3781]}
              dx={-90}
              dy={-30}
              // connectorProps={{
              //   stroke: "#FF5533",
              //   strokeWidth: 3,
              //   strokeLinecap: "round"
              // }}
            >
              <text>
                {"Paris"}
              </text>
            </Annotation> */}
        </ComposableMap>
      </div>
    )};

    const Region = () => 
      <div>
        <Button color='primary' onClick={() => { toggleDisplayRegional({display: false}); setSecondaryTable({ ...secondaryTable, display: false }); }}>BACK</Button>
        <RegionalMap fileName={Regional.fileName} regionCases={Regional.regionCases} setTooltipContent={setTooltipContent}/>
      </div>

  return (
    <div>
{Regional.display ? <Region /> : <UK />
        }
    </div>

  )
}

export default React.memo(UKMap);