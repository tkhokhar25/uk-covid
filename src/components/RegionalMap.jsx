import React, { useState, useEffect } from "react";
import { geoMercator } from "d3-geo";
import { schemeReds } from "d3-scale-chromatic";
import { scaleThreshold } from "d3-scale";
import { feature } from "topojson-client";
import {
  ComposableMap,
  Geographies,
  Geography
} from "react-simple-maps";

const width = 800;
const height = 800;

const RegionalMap = ({ fileName, regionCases, setTooltipContent }) => {
  const [geographies, setGeographies] = useState([])

  useEffect(() => {
    fetch(process.env.PUBLIC_URL + "/maps/" + fileName + ".json")
      .then(response => {
        if (response.status !== 200) {
          console.log(`There was a problem: ${response.status}`)
          return
        }
        response.json().then(worlddata => {
          setGeographies(feature(worlddata, worlddata.objects.x).features)
        })
      })
  }, [fileName])

  const projection = geoMercator()
                .fitSize([width, height], {type:"FeatureCollection", features: geographies})
    
  var colorScale = scaleThreshold()
    .domain([50, 100, 200, 500, 1000, 5000])
    .range(schemeReds[7]);

  return (
    <div style={{width: "500px"}} >
    {/* <div> */}
    <ComposableMap width={ width } height={ height } projection={projection} >
        <Geographies geography={geographies}>
          {({ geographies }) =>
            geographies.map((geo, idx) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                onMouseEnter={() => {
                  const numCases = (geo.properties.lad19nm in regionCases ? regionCases[geo.properties.lad19nm] : '0');
                  setTooltipContent(`${geo.properties.lad19nm}: ${numCases} Cases`);
                }}
                onMouseLeave={() => {
                  setTooltipContent("");
                }}
                fill={geo.properties.lad19nm in regionCases ? colorScale(regionCases[geo.properties.lad19nm]) : colorScale(0)}
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
  )
}

export default RegionalMap;