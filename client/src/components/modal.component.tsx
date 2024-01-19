import * as libFd from '../libraries/flightData.service';
import { IoCloseSharp } from "react-icons/io5";
import * as weatherData from '../services/weatherData.service';
import { useState } from 'react';

export default function Modal ({ flightData, setIsModalOpen }: libFd.FlightData ) {
  const [weatherData, setWeatherData] = useState([]);

  function handleClose () {
    setIsModalOpen(false);
  }

  function getWeatherData ()

  function convertUnixTimestamp(timestamp: string) {
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