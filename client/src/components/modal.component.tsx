import * as libFd from '../libraries/flightData.service';

export default function Modal ({ flightData }: libFd.FlightData ) {
  console.log(flightData.vendorLink);
  return (
    <div className="modal-overlay">
      <div className="flight-data-modal">
        <h3>{flightData.price}</h3>
        <a className="buy-now-button" href={flightData.vendorLink} target="_blank">Buy now!</a>
      </div>
    </div>
  )
}