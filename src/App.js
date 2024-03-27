import styled from "@emotion/styled";
import { ThemeProvider } from "@emotion/react";
import { useState, useEffect, useMemo } from "react";
import WeatherCard from "./views/WeatherCard";
import useWeatherAPI from "./hooks/useWeatherAPI";
import WeatherSetting from "./views/WeatherSetting";
import { getMoment, findLocation } from "./utils/helpers";

function App() {
  const [currentTheme, setCurrentTheme] = useState("light");
  const AUTHORIZATION_KEY = "CWA-61B1A2A6-520F-4233-9501-9097E55AE4F1";
  const [currentPage, setCurrentPage] = useState("WeatherCard");
  const storageCity = localStorage.getItem("cityName") || "臺北市";
  const [currentCity, setCurrentCity] = useState(storageCity);
  const currentLocation = useMemo(
    () => findLocation(currentCity),
    [currentCity]
  );
  const { locationName, stationName, sunriseCityName } = currentLocation;

  const moment = useMemo(() => getMoment(sunriseCityName), [sunriseCityName]);

  const [weatherElement, fetchData] = useWeatherAPI({
    locationName,
    stationName,
    authorizationKey: AUTHORIZATION_KEY,
  });

  const handleCurrentPageChange = (currentPage) => {
    setCurrentPage(currentPage);
  };

  const handleCurrentCityChange = (currentCity) => {
    setCurrentCity(currentCity);
  };

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
            handleCurrentPageChange={handleCurrentPageChange}
            locationName={locationName}
          />
        )}
        {currentPage === "WeatherSetting" && (
          <WeatherSetting
            locationName={locationName}
            handleCurrentPageChange={handleCurrentPageChange}
            handleCurrentCityChange={handleCurrentCityChange}
          />
        )}
      </Container>
    </ThemeProvider>
  );
}

export default App;
