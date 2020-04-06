import React, { useState, useEffect } from "react";
import { geoMercator, geoPath } from "d3-geo";
import { schemeReds } from "d3-scale-chromatic";
import { scaleThreshold } from "d3-scale";
import { feature } from "topojson-client";

const width = 800;
const height = 800;

const RegionalMap = ({ fileName, regionCases }) => {
  const [geographies, setGeographies] = useState([])
  // const [areaCases, setAreaCases] = useState([])
  // const [location, setLocation] = useState("")

  useEffect(() => {
    console.log(fileName)
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
  }, [])

  const handleCountryClick = countryIndex => {
    console.log(geographies[countryIndex].properties.lad19nm);
  }

  const projection = geoMercator()
                .fitSize([width, height], {type:"FeatureCollection", features: geographies})
    
  var colorScale = scaleThreshold()
    .domain([50, 100, 200, 500, 1000, 5000])
    .range(schemeReds[7]);

  return (
    <svg width={ width } height={ height }>
      <g className="countries">
        {
          geographies.map((d,i) => {
            geoPath().projection(projection)(d)
            return(
            
            <path
              key={ `path-${ i }` }
              d={ geoPath().projection(projection)(d) }
              className="country"
              fill={d.properties.lad19nm in regionCases ? colorScale(regionCases[d.properties.lad19nm]) : colorScale(0)}
              stroke="#000000"
              onClick={ () => handleCountryClick(i) }
            />
          )})
        }
      </g>
    </svg>
  )
}

export default RegionalMap;