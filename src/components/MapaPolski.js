import React, { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import citiesData from './cities.json';
import { FaGithub } from 'react-icons/fa';
import { MdOutlineDarkMode } from 'react-icons/md';
import './MapaPolski.css';
import { BiWindowOpen } from 'react-icons/bi';

const geoUrl = "https://raw.githubusercontent.com/ppatrzyk/polska-geojson/master/wojewodztwa/wojewodztwa-medium.geojson";

const voivodeshipNames = {
  0: "Śląskie",
  1: "Opolskie",
  2: "Wielkopolskie",
  3: "Zachodnio-pomorskie",
  4: "Świętokrzyskie",
  5: "Kujawsko-pomorskie",
  6: "Podlaskie",
  7: "Dolnośląskie",
  8: "Podkarpackie",
  9: "Małopolskie",
  10: "Pomorskie",
  11: "Warmińsko-mazurskie",
  12: "Łódzkie",
  13: "Mazowieckie",
  14: "Lubelskie",
  15: "Lubuskie",
};

const voivodeshipSettings = {
  0: { scale: 1.05, center: [18.5, 50.2] }, // Śląskie
  1: { scale: 1.3, center: [17.9, 50.7] }, // Opolskie
  2: { scale: 0.7, center: [16.9, 52.4] }, // Wielkopolskie
  3: { scale: 0.7, center: [15.2, 53.4] }, // Zachodnio-pomorskie
  4: { scale: 1.6, center: [20.6, 50.8] }, // Świętokrzyskie
  5: { scale: 1.2, center: [18.3, 53.1] }, // Kujawsko-pomorskie
  6: { scale: 0.7, center: [22.7, 53.5] }, // Podlaskie
  7: { scale: 1.0, center: [16.3, 50.9] }, // Dolnośląskie
  8: { scale: 1.0, center: [22.0, 50.0] }, // Podkarpackie
  9: { scale: 1.4, center: [19.9, 49.8] }, // Małopolskie
  10: { scale: 1.0, center: [17.8, 54.2] }, // Pomorskie
  11: { scale: 1.1, center: [20.6, 53.7] }, // Warmińsko-mazurskie
  12: { scale: 1.2, center: [19.4, 51.6] }, // Łódzkie
  13: { scale: 0.7, center: [21.0, 52.3] }, // Mazowieckie
  14: { scale: 0.9, center: [22.5, 51.2] }, // Lubelskie
  15: { scale: 1.0, center: [15.2, 52.3] }, // Lubuskie
};

const cityCoordinates = {
  0: [19.0, 50.25], // Katowice (Śląskie)
  1: [17.95, 50.67], // Opole (Opolskie)
  2: [16.93, 52.41], // Poznań (Wielkopolskie)
  3: [14.55, 53.43], // Szczecin (Zachodnio-pomorskie)
  4: [20.63, 50.87], // Kielce (Świętokrzyskie)
  5: [18.0, 53.12], // Bydgoszcz/Toruń (Kujawsko-pomorskie)
  6: [23.15, 53.13], // Białystok (Podlaskie)
  7: [17.03, 51.11], // Wrocław (Dolnośląskie)
  8: [22.0, 50.04], // Rzeszów (Podkarpackie)
  9: [19.94, 50.06], // Kraków (Małopolskie)
  10: [18.64, 54.35], // Gdańsk (Pomorskie)
  11: [20.48, 53.78], // Olsztyn (Warmińsko-mazurskie)
  12: [19.46, 51.76], // Łódź (Łódzkie)
  13: [21.0, 52.23], // Warszawa (Mazowieckie)
  14: [22.57, 51.25], // Lublin (Lubelskie)
  15: [15.24, 52.73], // Gorzów Wielkopolski/Zielona Góra (Lubuskie)
};

const cityNames = {
  0: "Katowice",
  1: "Opole",
  2: "Poznań",
  3: "Szczecin",
  4: "Kielce",
  5: "Toruń",
  6: "Białystok",
  7: "Wrocław",
  8: "Rzeszów",
  9: "Kraków",
  10: "Gdańsk",
  11: "Olsztyn",
  12: "Łódź",
  13: "Warszawa",
  14: "Lublin",
  15: "Gorzów Wielkopolski",
};

const MapaPolski = () => {
  const [hoveredVoivodeship, setHoveredVoivodeship] = useState(null);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [zoomedVoivodeship, setZoomedVoivodeship] = useState(null);
  const [voivodeshipCenter, setVoivodeshipCenter] = useState([19, 52]);
  const [voivodeshipScale, setVoivodeshipScale] = useState(1);
  const [isInfoBarVisible, setIsInfoBarVisible] = useState(true);
  const [hoveredCity, setHoveredCity] = useState(null);
  const [animationStep, setAnimationStep] = useState(0);
  const [searchQuery, setSearchQuery] = useState(""); 
  const [isdarkMode, setIsDarkMode] = useState(false);
  const [mapType, setMapType] = useState('standard');

  useEffect(() => {
    if (hoveredCity !== null) {
      console.log("Rozpoczęto animację dla miasta:", cityNames[hoveredCity]);
      startAnimation();
    }
  }, [hoveredCity]);

  const fetchCities = (voivodeshipId) => {
    setLoading(true);
    setTimeout(() => {
      const cities = citiesData[voivodeshipId] || [];
      setCities(cities);
      setLoading(false);
    }, 500);
  };

  const handleZoom = (voivodeshipId) => {
    const settings = voivodeshipSettings[voivodeshipId];
    if (settings) {
      setVoivodeshipCenter(settings.center);
      setVoivodeshipScale(settings.scale);
      setZoomedVoivodeship(voivodeshipId);
    }
  };

  const handleBackToMap = () => {
    setCities([]);
    setZoomedVoivodeship(null);
    setVoivodeshipCenter([19, 52]);
    setVoivodeshipScale(1);
    setAnimationStep(0);
  };

  const toggleInfoBar = () => {
    setIsInfoBarVisible(!isInfoBarVisible);
  };



  const handleMouseMove = (e) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    button.style.setProperty('--x', `${x}px`);
    button.style.setProperty('--y', `${y}px`);
  };

  const handleMouseEnter = () => {
    setHoveredCity(zoomedVoivodeship);
  };

  const handleMouseLeave = () => {
    setHoveredCity(null);
    setAnimationStep(0);
  };

  const startAnimation = () => {
    setAnimationStep(1); 

    setTimeout(() => {
      if (hoveredCity !== null) {
        setAnimationStep(2);
      }
    }, 500);

    setTimeout(() => {
      if (hoveredCity !== null) {
        setAnimationStep(3);

        setTimeout(() => {
          if (hoveredCity !== null) {
            setAnimationStep(2);
          }
        }, 500);
      }
    }, 1000);
  };
  const GithubOpen = () => {
    const handleGithubClick = () => {
      window.open('https://github.com/kosmabb')
    }
    handleGithubClick();
    
  }

  return (
    <div style={{ 
      width: "fixed", 
      height: "100vh", 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center", 
      flexDirection: "column",
      fontFamily: "'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif",
      position: "relative",
      backgroundColor: isdarkMode ? "#141414" : "#FFF",
      color: isdarkMode ? "#FFF" : "#333",
    }}>
      {}
      <h1 style={{ 
        marginBottom: "20px", 
        fontSize: "2em", 
        animation: "fadeIn 1s ease-in-out",
        color: isdarkMode ? "#FFF" : "#333",
      }}>
        Mapa Polski z Województwami
      </h1>
        <button
          onClick={() => setIsDarkMode(!isdarkMode)}
          onMouseMove={handleMouseMove}
          className="button"
          style={{
            position: "fixed",
            top: "20px",
            left: "20px",
            padding: "10px",
            backgroundColor: isdarkMode ? "#121212" : "#FFF",
            color: isdarkMode ? "#FFF" : "#333",
            border: "2px solid #800080",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          {isdarkMode ? "Jasny" : "Ciemny"}
        </button>
        <button
          onClick={() => setMapType(mapType === 'standard' ? 'satellite' : 'standard')}
          style={{
            position: "fixed",
            top: "65px",
            left: "20.2px",
            padding: "10px",
            backgroundColor: isdarkMode ? "#121212" : "#FFF",
            color: isdarkMode ? "#FFF" : "#333",
            border: "1px solid #ccc",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          {mapType === 'standard' ? 'Mapa Satelitarna' : 'Mapa standardowa'}
        </button>
      {/* Nazwa województwa po najechaniu */}
      {hoveredVoivodeship !== null && (
        <h2 style={{ 
          marginBottom: "10px", 
          fontSize: "1.5em", 
          color: isdarkMode ? "#FFF" : "#333",
          animation: "slideIn 0.5s ease-in-out",
        }}>
          {voivodeshipNames[hoveredVoivodeship]}
        </h2>
      )}

      {/* Nazwa województwa po kliknięciu */}
      {zoomedVoivodeship !== null && (
        <h2 style={{ 
          marginBottom: "10px", 
          fontSize: "1.5em", 
          color: isdarkMode ? "#FFF" : "#333",
          animation: "slideIn 0.5s ease-in-out",
        }}>
          {voivodeshipNames[zoomedVoivodeship]}
        </h2>
      )}

      <div style={{ width: "100%", maxWidth: "800px", margin: "20px 0" }}></div>
      <div style={{ width: "80%", height: "auto", position: "relative", overflow: "hidden" }}>
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 2500,
            center: [19, 51.5],
          }}
          style={{
            width: "100%",
            height: "auto",
            transition: "opacity 0.5s ease, transform 0.5s ease",
            opacity: zoomedVoivodeship !== null ? 0 : 1,
            backgroundColor: isdarkMode ? "#121212" : "#FFF",
          }}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const isHovered = hoveredVoivodeship === geo.rsmKey;
                const isZoomed = zoomedVoivodeship === geo.id;

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={() => setHoveredVoivodeship(geo.id)}
                    onMouseLeave={() => setHoveredVoivodeship(null)}
                    onClick={() => {
                      const voivodeshipId = geo.id;
                      fetchCities(voivodeshipId);
                      handleZoom(voivodeshipId);
                    }}
                    style={{
                      default: {
                        fill: isdarkMode ? "#333" : "#121212",
                        stroke: isdarkMode ? "#555" : "#8000",
                        strokeWidth: "1px",
                        outline: "none",
                        opacity: isZoomed ? 1 : isHovered ? 1 : 0.7,
                        transform: isZoomed ? `scale(${voivodeshipScale})` : "scale(1)",
                        transition: "all 0.5s ease",
                      },
                      hover: {
                        fill: isdarkMode ? "#444" : "#121212",
                        stroke: isdarkMode ? "#777" : "#800080",
                        strokeWidth: "4px",
                        outline: "none",
                        filter: "drop-shadow(0 0 8px rgba(142, 7, 195, 0.8))",
                        transform: "scale(1.05)",
                        opacity: 1,
                        transition: "all 0.3s ease",
                      },
                      pressed: {
                        fill: isdarkMode ? "#444" : "#121212",
                        stroke: isdarkMode ? "#999" : "#000",
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
        {zoomedVoivodeship !== null && (
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: isdarkMode ? "#121212" : "#FFF",
            transition: "opacity 0.5s ease",
            animation: "zoomIn 0.5s ease-in-out",
          }}>
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{
                scale: 5500 * voivodeshipScale,
                center: voivodeshipCenter,
              }}
              style={{
                width: "100%",
                height: "auto",
                transition: "transform 0.5s ease",
              }}
            >
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies
                    .filter((geo) => geo.id === zoomedVoivodeship)
                    .map((geo) => (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        style={{
                          default: {
                            fill: "#EEE",
                            stroke: "#8000",
                            strokeWidth: "1px",
                            outline: "none",
                            opacity: 1,
                            transition: "all 0.5s ease",
                          },
                        }}
                      />
                    ))
                }
              </Geographies>

              {/* Marker miasta wojewódzkiego */}
              <Marker coordinates={cityCoordinates[zoomedVoivodeship]}>
                {}
                <circle
                  r={8}
                  fill="#800080"
                  stroke="#FFD700"
                  strokeWidth={2}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  className={`circle-animation circle-step-${animationStep}`}
                  style={{ cursor: "pointer" }}
                />

                {/* Prostokąt z nazwą miasta */}
                {hoveredCity === zoomedVoivodeship && (
                  <g>
                    <rect
                      x={50}
                      y={-70}
                      width={cityNames[zoomedVoivodeship].length * 8}
                      height={30}
                      fill="#800080"
                      rx={5}
                      ry={5}
                      className={`rectangle-animation rectangle-step-${animationStep}`}
                      style={{ pointerEvents: "none" }}
                    />
                    <text
                      x={50 + (cityNames[zoomedVoivodeship].length * 8) / 2}
                      y={-55}
                      textAnchor="middle"
                      className={`text-animation text-step-${animationStep}`}
                      style={{
                        fill: "#FFF",
                        fontSize: "12px",
                        fontWeight: "bold",
                        fontFamily: "'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif",
                        pointerEvents: "none",
                      }}
                    >
                      {cityNames[zoomedVoivodeship]}
                    </text>
                  </g>
                )}
              </Marker>
            </ComposableMap>

            {/* Przycisk powrotu do mapy */}
            <button
              onClick={handleBackToMap}
              onMouseMove={handleMouseMove}
              className="button"
              style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                border: "2px solid rgb(255, 255, 255)",
                backgroundColor: isdarkMode ? "#333" : "#FFF",
                color: isdarkMode ? "#FFF" : "#333",
              }}
            >
              Powrót do mapy
            </button>
          </div>
        )}
      </div>

      <div style={{ 
        width: "100%", 
        maxWidth: "800px", 
        maxHeight: "40vh", 
        overflowY: "auto", 
        padding: "0 20px" 
      }}>
        {}
        {zoomedVoivodeship !== null && (
          <input
            type="text"
            placeholder="Wyszukaj miasto..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "20px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              fontSize: "16px",
            }}
          />
        )}

        {loading && <p>Ładowanie...</p>}
        {cities.length > 0 && ( 
          <div style={{ 
            padding: "20px", 
            backgroundColor: isdarkMode ? "#121212" : "#FFF",
            borderRadius: "10px", 
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", 
            textAlign: "center",
            animation: "slideIn 0.5s ease-in-out",
          }}>
            <h2 style ={{ color: isdarkMode ? "#FFF" : "#333" }}>Miasta w wybranym województwie:</h2>
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", 
              gap: "10px", 
              padding: "10px" 
            }}>
              {cities
                .filter((city) =>
                  city.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((city, index) => (
                  <div key={index} style={{ 
                    padding: "10px", 
                    backgroundColor: isdarkMode ? "#333" : "#FFF",
                    borderRadius: "5px", 
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    transition: "all 0.3s ease",
                    animation: "fadeIn 0.5s ease-in-out",
                  }}
                  >
                    {city}
                  </div>
                ))}
            </div>
            {}
            {cities.filter((city) =>
              city.toLowerCase().includes(searchQuery.toLowerCase())
            ).length === 0 && (
              <p style={{  
                color: isdarkMode ? "#FFF" : "#333",
                backgroundColor: isdarkMode ? "395" : "395",
                marginTop: "10px" 
                }}
                >Brak wyników dla "{searchQuery}" w tym województwie 
                </p>
            )}
          </div>
        )}
      </div>

      {/* Pasek informacyjny */}
      {isInfoBarVisible && (
        <div style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          backgroundColor: isdarkMode ? "#333" : "#121212",
          color: isdarkMode ? "#FFF" : "#FFF",
          opacity: "80%",
          padding: "10px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 1000,
          animation: "slideUp 0.5s ease-in-out, slide",       
        }}>
          <div style={{ 
            flex: 1,
            textAlign: "left",
            marginLeft: "20px",
          }}>
            Specjalne podziękowania dla Piotra Patrzyka za stworzenie i udostępnienie GeoJson
          </div>

          <div style={{ 
            flex: 1,
            textAlign: "center",
          }}>
            Strona stworzona przez Kosme Brzeżawskiego
          </div>

          <div style={{ 
            flex: 1,
            textAlign: "right",
            marginRight: "20px",
          }}>
            <button
              onClick={toggleInfoBar}
              onMouseMove={handleMouseMove}
              className="button"
              style={{
                border: "2px solid #800080",
                backgroundColor: isdarkMode ? "#121212" : "#FFF",
                color: isdarkMode ? "#FFF" : "#333",
              }}
            >
              Zamknij
            </button>
          </div>
        </div>
      )}

      {/* Przycisk otwierający pasek informacyjny */}
      {!isInfoBarVisible && (
        <button
          onClick={toggleInfoBar}
          onMouseMove={handleMouseMove}
          className="button"
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            backgroundColor: isdarkMode ? "#121212" : "#FFF",
            color: isdarkMode ? "#FFF" : "#333",
          }}
        >
          Otwórz pasek
        </button>
      )}
      <button
        onClick={GithubOpen}
        onMouseMove={handleMouseMove}
        className="button"
              style={{
                display: 'fixed',
                alignItems: 'center',
                position: 'fixed',
                top: '20px',
                right: '20px',
                gap: '8px',
                padding: '10px 15px',
                backgroundColor: '#333',
                color: 'white',
                outline: 'none',
                fontSize: '16px',
                fontWeight: 'bold',
                textDecoration: 'none',
                textAlign: 'center',
                border: '2px solid #800080',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                transition: 'background-color 0.3s ease',
                '&:hover': {
                  backgroundColor: '#800080',
                },
                '&:active': {
                  transform: 'scale(0.98)',
                },
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              <FaGithub size={19} />
              Po więcej moich prac zapraszam na Githuba
        </button>
    </div>
  );
};

export default MapaPolski;