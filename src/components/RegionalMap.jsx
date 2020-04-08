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
    fetch("/maps/" + fileName + ".json")
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

  const handleCountryClick = countryIndex => {
    console.log(geographies[countryIndex].properties.lad19nm);
  }

  const projection = geoMercator()
                .fitSize([width, height], {type:"FeatureCollection", features: geographies})
    
  var colorScale = scaleThreshold()
    .domain([50, 100, 200, 500, 1000, 5000])
    .range(schemeReds[7]);

  return (
    <div style={{width: "100%"}} >
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
                onClick={() => handleCountryClick(idx)}
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

    // <svg width={ width } height={ height }>
    //   <g className="countries">
    //     {
    //       geographies.map((d,i) => {
    //         geoPath().projection(projection)(d)
    //         return(
            
    //         <path
    //           key={ `path-${ i }` }
    //           d={ geoPath().projection(projection)(d) }
    //           className="country"
    //           fill={d.properties.lad19nm in regionCases ? colorScale(regionCases[d.properties.lad19nm]) : colorScale(0)}
    //           stroke="#000000"
    //           onClick={ () => handleCountryClick(i) }
    //         />
    //       )})
    //     }
    //   </g>
    // </svg>
  )
}

export default RegionalMap;