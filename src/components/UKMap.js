import React, { useState, useEffect } from "react";
import { geoMercator, geoPath, geoProjection } from "d3-geo";
import { schemeReds } from "d3-scale-chromatic";
import { scaleThreshold } from "d3-scale";
import { feature } from "topojson-client";
import {
  ZoomableGroup,
  ComposableMap,
  Geographies,
  Geography
} from "react-simple-maps";

import RegionalMap from "./RegionalMap";

const width = 20;
const height = 20;

const UKMap = () => {
  const [geographies, setGeographies] = useState([]);
  const [areaCases, setAreaCases] = useState([]);
  const [location, setLocation] = useState({highlighted: ''})
  const [Regional, toggleDisplayRegional] = useState({ display: false, fileName: '', regionCases: '' });

  useEffect(() => {
    fetch("/maps/phe_regions.json")
      .then(response => {
        if (response.status !== 200) {
          console.log(`There was a problem: ${response.status}`)
          return
        }
        response.json().then(worlddata => {
          setGeographies(feature(worlddata, worlddata.objects.eer).features)
        })
      })
    
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

  const handleCountryClick = countryIndex => {
    const regionName = geographies[countryIndex].properties.EER13NM
    const fileName = regionName.replace(' ', '_')

    toggleDisplayRegional({ display: true, fileName, regionCases: areaCases[regionName].regional });
  }

  const handleMouseEnter = countryIndex => {
    console.log(geographies[countryIndex].properties.EER13NM)
    setLocation(geographies[countryIndex].properties.EER13NM);
  }

  const projection = geoMercator().fitSize([width, height], {type:"FeatureCollection", features: geographies})
    
  var colorScale = scaleThreshold()
    .domain([1000, 1500, 2000, 2500, 5000, 15000])
    .range(schemeReds[7]);


    return (
      <>
        {/* <ComposableMap width={ width } height={ height } projection={projection}  > */}
        <ComposableMap width={ width } height={ height } projection={projection}  >
            <Geographies geography={geographies}>
              {({ geographies }) =>
                geographies.map(geo => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    // onMouseEnter={() => {
                    //   const { NAME, POP_EST } = geo.properties;
                    //   setTooltipContent(`${NAME} — ${rounded(POP_EST)}`);
                    // }}
                    // onMouseLeave={() => {
                    //   setTooltipContent("");
                    // }}
                    fill={geo.properties.EER13NM in areaCases ? colorScale(areaCases[geo.properties.EER13NM].total) : colorScale(0)}
                    // stroke="#000000"
                    // strokeWidth="1"
                    style={{
                      default: {
                        outline: "none",
                        border: "1px solid black",
                        borderWidth: "thick"
                      },
                      hover: {
                        fill: "#F53",
                        outline: "none"
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
      </>
    );

  // return (
  //   <div>
  //     {Regional.display ? <RegionalMap fileName={Regional.fileName} regionCases={Regional.regionCases}/> : <UKsvg />
  //       // <UKsvg geographies={geographies} projection={projection} areaCases={areaCases} colorScale={colorScale} handleCountryClick={handleCountryClick}/>
  //       }
  //   </div>

  // )
}

export default UKMap;