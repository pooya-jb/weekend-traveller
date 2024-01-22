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
  const [arrivalWeather, setArrivalWeather] = useState<number>();
  let currentDate: Date = '';

  useEffect(() => {
    const arrivalDate = new Date(arrivalTimestamp);
    const arrivalYear = arrivalDate.getFullYear();
    const arrivalMonth = arrivalDate.getMonth();
    const arrivalDay = arrivalDate.getDate();

    // for (let i = 0; i < 7; i++) {
    //   const currentDate = new Date(arrivalYear, arrivalMonth, arrivalDay + i);
    //   const dateString = currentDate.toISOString().split('T')[0] + 'T12:00';

    //   const weatherIndex = weather.hourly.time.indexOf(dateString);
    //   const temperature = weather.hourly.temperature_2m[weatherIndex];

    //   dailyWeatherData.push(temperature);
    // }
    currentDate = new Date(arrivalYear, arrivalMonth, arrivalDay + 1);
    const dateString = currentDate.toISOString().split('T')[0] + 'T12:00';
    const weatherIndex = weather.hourly.time.indexOf(dateString);
    const temperature = weather.hourly.temperature_2m[weatherIndex];
    setArrivalWeather(temperature);
    console.log({currentDate});
    console.log({dateString});
    console.log({weatherIndex});
    console.log({temperature});
  }, [weather, departureTimestamp]);


  return (
    <div className='weather'>
      {arrivalWeather && (
        <>
          <h4>Weather for your trip: </h4>
          {arrivalWeather}°C
        </>
      )}
    </div>
  )
}