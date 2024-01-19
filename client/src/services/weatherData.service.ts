/**
 * @module
 * Global storage for public constants.
 * All objects must be frozen to ensure immutability.
 * Import module as 'c' (for convenience).
 * @version 1.0.0
 */

//  Internal dependencies
// import * as libFd from '../libraries/weatherData.service';

export async function getWeather (lat: number, long: number) {
  const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&hourly=temperature_2m,precipitation_probability&forecast_days=14`);
  const data = await response.json();
  return data;
}