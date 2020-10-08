import { useState, useEffect, useCallback } from "react";

const fetchCurrentWeather = (locationName) => {
  let url =
    "https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=CWB-CC73FFAF-4A5D-497D-B891-7CBD7AD5671C&locationName=" +
    locationName;

  return fetch(url)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      const locationData = data.records.location[0];

      const weatherElements = locationData.weatherElement.reduce(
        (neededElements, item) => {
          if (["WDSD", "TEMP", "HUMD"].includes(item.elementName)) {
            neededElements[item.elementName] = item.elementValue;
          }

          return neededElements;
        },
        {}
      );

      return {
        observationTime: locationData.time.obsTime,
        locationName: locationData.locationName,
        temperature: weatherElements.TEMP,
        windSpeed: weatherElements.WDSD,
        humid: weatherElements.HUMD
      };
    });
};

const fetchWeatherForecast = (cityName) => {
  let url =
    "https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWB-CC73FFAF-4A5D-497D-B891-7CBD7AD5671C&locationName=" +
    cityName;

  return fetch(url)
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
        comfortability: weatherElements.CI.parameterName
      };
    });
};

const useWeatherApi = (currentLocation) => {
  const [weatherElement, setWeatherElement] = useState({
    observationTime: new Date(),
    locationName: "",
    humid: 0,
    temperature: 0,
    windSpeed: 0,
    description: "",
    weatherCode: 0,
    rainPossibility: 0,
    comfortability: "",
    isLoading: true
  });

  const { locationName, cityName } = currentLocation;

  const fetchData = useCallback(() => {
    const fetchingData = async () => {
      const [currentWeather, weatherForecast] = await Promise.all([
        fetchCurrentWeather(locationName),
        fetchWeatherForecast(cityName)
      ]);

      setWeatherElement({
        ...currentWeather,
        ...weatherForecast,
        isLoading: false
      });
    };

    setWeatherElement((prevState) => {
      return {
        ...prevState,
        isLoading: true
      };
    });

    fetchingData();
  }, [locationName, cityName]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return [weatherElement, fetchData];
};

export default useWeatherApi;
