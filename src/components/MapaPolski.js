import React, { useState } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import citiesData from './cities.json';

const geoUrl = "https://raw.githubusercontent.com/ppatrzyk/polska-geojson/master/wojewodztwa/wojewodztwa-medium.geojson";

const MapaPolski = () => {
  const [hoveredVoivodeship, setHoveredVoivodeship] = useState(null);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCities = (voivodeshipId) => {
    setLoading(true);
    setTimeout(() => { 
      const cities = citiesData[voivodeshipId] || [];
      console.log("Znalezione miasta:", cities);
      setCities(cities);
      setLoading(false);
    }, 500);
  };

  return (
    <div style={{ width: "100%", 
    height: "100vh", 
    display: "flex", 
    justifyContent: "center", 
    alignItems: "center", 
    flexDirection: "column" 
    }}>
    <div style={{
      width: "100%",
      maxWidth: "800px",
      margin: "20px 0"
    }}
    ></div>
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 3000,
          center: [19, 52],
        }}
        style={{
          width: "80%",
          height: "auto",
        }}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const isHovered = hoveredVoivodeship === geo.rsmKey;

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onMouseEnter={() => {
                    setHoveredVoivodeship(geo.rsmKey);
                  }}
                  onMouseLeave={() => {
                    setHoveredVoivodeship(null);
                  }}
                  onClick={() => {
                    const voivodeshipId = geo.id;
                    console.log("Kliknięto województwo o id:", voivodeshipId);
                    fetchCities(voivodeshipId);
                  }}
                  style={{
                    default: {
                      fill: "#EEE",
                      stroke: "#8000",
                      strokeWidth: "1px",
                      outline: "none",
                      opacity: isHovered ? 1 : 0.7,
                      transition: "all 0.3s ease",
                    },
                    hover: {
                      fill: "#EEE",
                      stroke: "#800080",
                      strokeWidth: "4px",
                      outline: "none",
                      filter: "drop-shadow(0 0 8px rgba(142, 7, 195, 0.8))",
                      transform: "scale(1.05)",
                      opacity: 1,
                      transition: "all 0.3s ease",
                    },
                    pressed: {
                      fill: "#EEE",
                      stroke: "#000",
                      strokeWidth: "4px",
                      outline: "none",
                    },
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>

      <div style={{ 
        width: "100%", 
        maxWidth: "800px", 
        maxHeight: "40vh", 
        overflowY: "auto", 
        padding: "0 20px" 
      }}>
        {loading && <p>Ładowanie...</p>}
        {cities.length > 0 && (
          <div style={{ 
            padding: "20px", 
            backgroundColor: "#FFF", 
            borderRadius: "10px", 
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", 
            textAlign: "center" 
          }}>
            <button
              onClick={() => setCities([])}
              style={{
                marginBottom: "20px",
                padding: "10px 20px",
                backgroundColor: "#800080",
                color: "#FFF",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "1em",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                transition: "background-color 0.3s ease",
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = "#4B0082"}
              onMouseLeave={(e) => e.target.style.backgroundColor = "#800080"}
            >
              Powrót do mapy
            </button>

            <h2>Miasta w wybranym województwie:</h2>
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", 
              gap: "10px", 
              padding: "10px" 
            }}>
              {cities.map((city, index) => (
                <div key={index} style={{ 
                  padding: "10px", 
                  backgroundColor: "#f0f0f0", 
                  borderRadius: "5px", 
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" 
                }}>
                  {city}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


export default MapaPolski;