import { useState, useEffect, useCallback } from "react";

const useWeatherAPI = ({ locationName, stationName, authorizationKey }) => {
  const [weatherElement, setWeatherElement] = useState({
    stationName: "",
    description: "",
    windSpeed: 0,
    temperature: 0,
    rainPossibility: 0,
    observationTime: new Date(),
    comfortability: "",
    weatherCode: 0,
    isLoading: true,
  });

  const fetchCurrentWeather = () => {
    return fetch(
      `https://opendata.cwa.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=${authorizationKey}&StationName=${stationName}`
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        const stationData = data.records.Station[0];
        return {
          observationTime: stationData.ObsTime.DateTime,
          stationName: stationData.StationName,
          temperature: stationData.WeatherElement.AirTemperature,
          windSpeed: stationData.WeatherElement.WindSpeed,
        };
      });
  };

  const fetchWeatherForecast = () => {
    return fetch(
      `https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${authorizationKey}&locationName=${locationName}`
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        const locationData = data.records.location[0];
        const weatherElements = locationData.weatherElement.reduce(
          (neededElements, item) => {
            if (["Wx", "PoP", "CI"].includes(item.elementName)) {
              neededElements[item.elementName] = item.time[0].parameter;
            }
            return neededElements;
          },
          {}
        );
        return {
          description: weatherElements.Wx.parameterName,
          weatherCode: weatherElements.Wx.parameterValue,
          rainPossibility: weatherElements.PoP.parameterName,
          comfortability: weatherElements.CI.parameterName,
        };
      });
  };

  const fetchData = useCallback(async () => {
    setWeatherElement({ ...weatherElement, isLoading: true });
    const [currentWeather, weatherForecast] = await Promise.all([
      fetchCurrentWeather({ authorizationKey, stationName }),
      fetchWeatherForecast({ authorizationKey, locationName }),
    ]);
    setWeatherElement({
      ...currentWeather,
      ...weatherForecast,
      isLoading: false,
    });
  }, [authorizationKey, stationName, locationName]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return [weatherElement, fetchData];
};

export default useWeatherAPI;
