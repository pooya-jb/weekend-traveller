import * as libWd from '../libraries/weatherData.service';
import { useState } from 'react';

export default function Weather ({
  weather,
  arrivalTimestamp,
  departureTimestamp }: {
  weather: libWd.WeatherResponse,
  arrivalTimestamp: number,
  departureTimestamp: number
}) {
  const [firstWeather, setFirstWeather] = useState<number>();
  const departureDate = new Date(departureTimestamp);
  const departureYear = departureDate.getFullYear();
  const departureMonth = departureDate.getMonth() + 1;
  const departureDay = departureDate.getDate();

  const weekStartDate = new Date(departureYear, departureMonth - 1, departureDay + 1);
  const weekEndDate = new Date(departureYear, departureMonth - 1, departureDay + 7);
  // create string in format of weather api response
  const weekStartDateString = weekStartDate.toISOString().split('T')[0] + 'T12:00';
  const weekEndDateString = weekEndDate.toISOString().split('T')[0] + 'T12:00';

  const firstWeatherIndex = weather.hourly.time.indexOf(weekStartDateString);
  // setFirstWeather(weather.hourly.temperature_2m[firstWeatherIndex]);

  return (
    <>
    <h1>{arrivalTimestamp}</h1>
    <h1>{departureTimestamp}</h1>
    </>
  )
}