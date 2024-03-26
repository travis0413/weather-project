import styled from "@emotion/styled";
import { ThemeProvider } from "@emotion/react";
import { useState, useEffect, useMemo } from "react";
import { getMoment } from "./utils/helpers";
import WeatherCard from "./views/WeatherCard";
import useWeatherAPI from "./hooks/useWeatherAPI";
import WeatherSetting from "./views/WeatherSetting";

function App() {
  const [currentTheme, setCurrentTheme] = useState("light");
  const AUTHORIZATION_KEY = "CWA-61B1A2A6-520F-4233-9501-9097E55AE4F1";
  const STATION_NAME = "宜蘭";
  const LOCATION_NAME = "宜蘭縣";
  const moment = useMemo(() => getMoment(LOCATION_NAME), []);
  const [weatherElement, fetchData] = useWeatherAPI({
    locationName: LOCATION_NAME,
    stationName: STATION_NAME,
    authorizationKey: AUTHORIZATION_KEY,
  });
  const [currentPage, setCurrentPage] = useState("WeatherCard");

  useEffect(() => {
    setCurrentTheme(moment === "day" ? "light" : "dark");
  }, [moment]);

  const theme = {
    light: {
      backgroundColor: "#ededed",
      foregroundColor: "#f9f9f9",
      boxShadow: "0 1px 3px 0 #999999",
      titleColor: "#212121",
      temperatureColor: "#757575",
      textColor: "#828282",
    },
    dark: {
      backgroundColor: "#1F2022",
      foregroundColor: "#121416",
      boxShadow:
        "0 1px 4px 0 rgba(12, 12, 13, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.15)",
      titleColor: "#f9f9fa",
      temperatureColor: "#dddddd",
      textColor: "#cccccc",
    },
  };

  const Container = styled.div`
    background-color: ${({ theme }) => theme.backgroundColor};
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  `;

  return (
    <ThemeProvider theme={theme[currentTheme]}>
      <Container>
        {currentPage === "WeatherCard" && (
          <WeatherCard
            weatherElement={weatherElement}
            moment={moment}
            fetchData={fetchData}
          />
        )}
        {currentPage === "WeatherSetting" && <WeatherSetting />}
      </Container>
    </ThemeProvider>
  );
}

export default App;
