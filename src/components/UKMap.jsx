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

const UKMap = ({ setTooltipContent }) => {
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
  }, []);

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


    const UK = () => {
      console.log('rendering');
      return (
      <div style={{width: "40%"}} >
        <ComposableMap width={ width } height={ height } projection={projection} >
            <Geographies geography={geographies}>
              {({ geographies }) =>
                geographies.map((geo, idx) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={() => {
                      setTooltipContent(geo.properties.EER13NM);
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
                        fill: "#F53",
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
        </ComposableMap>
      </div>
    )};

  return (
    <div>
{Regional.display ? <RegionalMap fileName={Regional.fileName} regionCases={Regional.regionCases} setTooltipContent={setTooltipContent}/> : <UK />
        // <UKsvg geographies={geographies} projection={projection} areaCases={areaCases} colorScale={colorScale} handleCountryClick={handleCountryClick}/>
        }
    </div>

  )
}

export default React.memo(UKMap);