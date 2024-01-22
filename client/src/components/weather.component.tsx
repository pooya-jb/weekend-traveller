import * as libWd from '../libraries/weatherData.service';
import { useState, useEffect } from 'react';

export default function Weather ({
  weather,
  arrivalTimestamp,
  departureTimestamp }: {
  weather: libWd.WeatherResponse,
  arrivalTimestamp: number,
  departureTimestamp: number
}) {
  const [dailyWeather, setDailyWeather] = useState<number[]>([]);

  useEffect(() => {
    const departureDate = new Date(departureTimestamp);
    const departureYear = departureDate.getFullYear();
    const departureMonth = departureDate.getMonth() + 1;
    const departureDay = departureDate.getDate();

    const dailyWeatherData: number[] = [];

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(departureYear, departureMonth - 1, departureDay + i);
      const dateString = currentDate.toISOString().split('T')[0] + 'T12:00';

      const weatherIndex = weather.hourly.time.indexOf(dateString);
      const temperature = weather.hourly.temperature_2m[weatherIndex];

      dailyWeatherData.push(temperature);
    }
    // for monday: why is setDailyWeather all undefined
    setDailyWeather(dailyWeatherData);
  }, [weather, departureTimestamp]);


  return (
    <>
    <h1>{arrivalTimestamp}</h1>
    <h1>{departureTimestamp}</h1>
    </>
  )
}