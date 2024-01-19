import * as libFd from '../libraries/flightData.service';

export default function Modal ({ flightData }: libFd.FlightData ) {
  console.log('flight data from modal' + flightData);
  return (
    <h1>hello from modal</h1>
  )
}