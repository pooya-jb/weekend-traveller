// External dependencies
import { useState } from 'react';
import { IoCloseSharp } from "react-icons/io5";

// Internal dependencies
import * as libFd from '../libraries/flightData.service';
import * as weatherDataService from '../services/weatherData.service';

export default function Modal ({
  flightData,
  setIsModalOpen,
  destination
}: {
  flightData: libFd.FlightData,
  setIsModalOpen: (value: boolean) => void,
  destination: libFd.Option
} ) {
  // State hooks
  const [weather, setWeather] = useState([]);

  async function handleClose () {
    setIsModalOpen(false);
    getWeatherData(destination.label)
  }

  async function getWeatherData (destination: string) {
    // get city name without any other info
    const cleanedDest = destination.match(/^(\S+)/);
    let lat: number | undefined;
    let long: number | undefined;
    try {
      if (cleanedDest !== null) {
        // get lat & long from city name
        const latLongResponse = await weatherDataService.getLatLong(cleanedDest[0]);
        lat = latLongResponse.results[0].latitude;
        long = latLongResponse.results[0].longitude;
      }
      try {
        // get weather by using lat & long
        const weatherResponse = await weatherDataService.getWeather(lat, long);
        console.log(weatherResponse)
        setWeather(weatherResponse)
      } catch (error) {
        console.error(error)
      }
    } catch (error) {
      console.error(error)
    }
  }

  function convertUnixTimestamp(timestamp: number) {
    const date = new Date(timestamp);
    const options = {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'UTC',
    };
    const readableDate = date.toLocaleDateString('en-US', options);
    return readableDate;
  }

  return (
    <div className="modal-overlay">
      <div className="flight-data-modal">
        <h2>Your Flight Details:</h2>
        <hr />
        <IoCloseSharp id="close-modal" onClick={handleClose} />
        <h3>{convertUnixTimestamp(flightData.segments[0].arrival)}</h3>
        {flightData.segments[1] && <h3>{convertUnixTimestamp(flightData.segments[1].departure)}</h3>}
        <h3>{flightData.segments[0].destinationPlaceId}</h3>
        <h3>{flightData.segments[0].originPlaceId}</h3>
        <div className="weather">
          <h4>Weather for your trip: </h4>
        </div>
        <h3 id="flight-price">Total price: {flightData.price}</h3>
        <a className="buy-now-button" href={flightData.vendorLink} target="_blank">Buy now!</a>
      </div>
    </div>
  )
}