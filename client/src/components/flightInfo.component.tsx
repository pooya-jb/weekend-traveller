/**
 * @version 1.0.0
 */

//  External dependencies
import { useEffect, useState } from 'react';

//  Internal dependencies
import * as libFd from '../libraries/flightData.service';
import {
  getAirports,
  postFlightInfoRequest,
} from '../services/flightData.service';

/**
 * @module
 * Single flight tile with flight info.
 * On click it should query API for flight details.
 * The query code is in place on both ends but this feature
 * probably won't make it due to time constraints.
 * @param flightInfo destination, price etc.
 * @param requestBody request generating flightInfo with additional info
 * @param flightDate date of flight
 * @param returnDate date of return if not selected one way
 */
function FlightInfo({
  flightInfo,
  requestBody,
  flightDate,
  returnDate,
}: {
  flightInfo: libFd.CheapFlight;
  requestBody: libFd.CheapestFlightsRequest;
  flightDate: number;
  returnDate: number | undefined;
}) {
  //  State hooks
  const [flightData, setFlightData] = useState<libFd.FlightInfo>();
  const [destination, setDestination] = useState<libFd.Option>();

  //  Data load hooks
  useEffect(() => {
    getAirports().then(airports => {
      if (!airports) return; // already checked in flight options
      const foundAirport: libFd.Option | undefined = airports.find(
        airport => airport.value === flightInfo.destinationPlaceId
      );
      if (!foundAirport) return;
      setDestination(foundAirport);
    });
  }, []);

  /**
   * Composes body of individual flight info request.
   * Uses input for flight list search so no validation needed.
   */
  const getFlightDetail = () => {
    const flightInfoRequest: libFd.FlightInfoRequest = {
      currencyCode: requestBody.currencyCode,
      localeCode: requestBody.localeCode,
      marketCode: requestBody.marketCode,
      originPlaceId: requestBody.originPlaceId,
      destinationPlaceId: flightInfo.destinationPlaceId,
      travelDate: flightDate,
    };
    if (returnDate) {
      flightInfoRequest.returnDate = returnDate;
    }
    postFlightInfoRequest(flightInfoRequest).then(data => {
      if (!data) {
        alert(`Couldn't load data for this flight. Please try again later.`);
        return;
      }
      setFlightData(data);
    });
  };

  // console.log(flightData);

  return (
    <>
      {destination ? (
        <li className="cheap-flight" onClick={getFlightDetail}>
          <div>{destination.label}</div>
          <div className="cheap-flight-info">
            {/* Vendor pictures */}
            <div className="cheap-flight-info-vendors">
              <img src={flightInfo.vendorTherePic} alt="" />
              {flightInfo.vendorBackPic ? (
                <img src={flightInfo.vendorBackPic} alt="" />
              ) : (
                ''
              )}
            </div>
            {/* Transfer / Price */}
            <div className="cheap-flight-more-info">
              {flightInfo.hasTransfers && (
                <span className="transfer">Transfer</span>
              )}
              <span className="price">
                {flightInfo.price.toLocaleString(requestBody.localeCode, {
                  style: 'currency',
                  currency: requestBody.currencyCode,
                })}
              </span>
            </div>
          </div>
          <div className="cheap-flight-detail"></div>
        </li>
      ) : (
        ''
      )}
    </>
  );
}

export default FlightInfo;
