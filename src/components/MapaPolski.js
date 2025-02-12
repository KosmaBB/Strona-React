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
    <div style={{ width: "100%", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
      <h1>Mapa Polski</h1>
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 2500,
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
                      stroke: "#000",
                      strokeWidth: "1px",
                      outline: "none",
                      opacity: isHovered ? 1 : 0.5,
                      transition: "all 0.3s ease",
                    },
                    hover: {
                      fill: "#EEE",
                      stroke: "#800080",
                      strokeWidth: "4px",
                      outline: "none",
                      filter: "drop-shadow(0 0 8px rgba(142, 7, 195, 0.8))",
                      transform: "scale(1.05) translateY(-5px)",
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

      {loading && <p>Ładowanie...</p>}
      {cities.length > 0 && (
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <h2>Miasta w wybranym województwie:</h2>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {cities.map((city, index) => (
              <li key={index}>{city}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MapaPolski;