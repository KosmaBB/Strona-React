import React, { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import citiesData from './cities.json';
import './MapaPolski.css';

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
  10: { scale: 1.2, center: [17.8, 54.2] }, // Pomorskie
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

  // Efekt śledzący zmiany hoveredCity
  useEffect(() => {
    if (hoveredCity !== null) {
      console.log("Rozpoczęto animację dla miasta:", cityNames[hoveredCity]); // Logowanie rozpoczęcia animacji
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
    console.log("Najechano na marker miasta:", cityNames[zoomedVoivodeship]); // Logowanie nazwy miasta
    setHoveredCity(zoomedVoivodeship); // Ustaw stan hoveredCity na aktualne województwo
  };

  const handleMouseLeave = () => {
    console.log("Opuszczono marker miasta:", cityNames[zoomedVoivodeship]); // Logowanie nazwy miasta
    setHoveredCity(null); // Resetuj stan hoveredCity
    setAnimationStep(0); // Resetuj animację
    console.log("Zresetowano stan hoveredCity i animację."); // Logowanie resetu stanu
  };

  const startAnimation = () => {
    setAnimationStep(1); // Rozpocznij animację

    setTimeout(() => {
      if (hoveredCity !== null) { // Tylko jeśli kursor nadal jest na markerze
        console.log("Animacja krok 2 dla miasta:", cityNames[hoveredCity]); // Logowanie kroku animacji
        setAnimationStep(2);
      }
    }, 500);

    setTimeout(() => {
      if (hoveredCity !== null) { // Tylko jeśli kursor nadal jest na markerze
        console.log("Animacja krok 3 dla miasta:", cityNames[hoveredCity]); // Logowanie kroku animacji
        setAnimationStep(3);

        // Pętla animacji: po zakończeniu kroku 3 wracamy do kroku 2
        setTimeout(() => {
          if (hoveredCity !== null) { // Tylko jeśli kursor nadal jest na markerze
            console.log("Powrót do kroku 2 dla miasta:", cityNames[hoveredCity]); // Logowanie powrotu do kroku 2
            setAnimationStep(2);
          }
        }, 500); // Czas trwania kroku 3 przed powrotem do kroku 2
      }
    }, 1000);
  };

  return (
    <div style={{ 
      width: "100%", 
      height: "100vh", 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center", 
      flexDirection: "column",
      fontFamily: "'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif",
      position: "relative",
    }}>
      {/* Tytuł strony */}
      <h1 style={{ 
        marginBottom: "20px", 
        fontSize: "2em", 
        color: "#333",
        animation: "fadeIn 1s ease-in-out",
      }}>
        Mapa Polski z Województwami
      </h1>

      {/* Nazwa województwa po najechaniu */}
      {hoveredVoivodeship !== null && (
        <h2 style={{ 
          marginBottom: "10px", 
          fontSize: "1.5em", 
          color: "#555",
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
          color: "#555",
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
                        fill: "#EEE",
                        stroke: "#8000",
                        strokeWidth: "1px",
                        outline: "none",
                        opacity: isZoomed ? 1 : isHovered ? 1 : 0.7,
                        transform: isZoomed ? `scale(${voivodeshipScale})` : "scale(1)",
                        transition: "all 0.5s ease",
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
            backgroundColor: "rgba(255, 255, 255, 0.9)",
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

              // W renderowaniu markera:
              <Marker coordinates={cityCoordinates[zoomedVoivodeship]}>
              {/* Kropka (interaktywna) */}
              <circle
                r={8}
                fill="#800080"
                stroke="#FFD700" // Zmieniono kolor obramowania na żółty
                strokeWidth={2}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className={`circle-animation circle-step-${animationStep}`} // Dodano klasę CSS
                style={{ cursor: "pointer" }}
              />

              {/* Prostokąt z nazwą miasta (nieinteraktywny) */}
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
        {loading && <p>Ładowanie...</p>}
        {cities.length > 0 && (
          <div style={{ 
            padding: "20px", 
            backgroundColor: "#FFF", 
            borderRadius: "10px", 
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", 
            textAlign: "center",
            animation: "slideIn 0.5s ease-in-out",
          }}>
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
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  transition: "all 0.3s ease",
                  animation: "fadeIn 0.5s ease-in-out",
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = "#ddd"}
                onMouseLeave={(e) => e.target.style.backgroundColor = "#f0f0f0"}
                >
                  {city}
                </div>
              ))}
            </div>
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
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          color: "#FFF",
          padding: "10px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 1000,
          animation: "slideUp 0.5s ease-in-out",
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
          }}
        >
          Otwórz pasek
        </button>
      )}
    </div>
  );
};

export default MapaPolski;