import { useEffect, useState } from 'react';

import * as libFd from '../libraries/flightData.service';
import { getAirports, postFlightInfoRequest } from '../services/api.service';

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
  const [flightData, setFlightData] = useState<libFd.FlightInfo>();
  const [airports, setAirports] = useState<libFd.Airports>();

  useEffect(() => {
    getAirports().then(data => {
      setAirports(data);
    });
  }, []);

  if (!airports) return;
  const destination = airports.find(
    airport => airport.value === flightInfo.destinationPlaceId
  );
  if (!destination) return;

  const getFlightDetail = () => {
    const newRequest: libFd.FlightInfoRequest = {
      currencyCode: requestBody.currencyCode,
      localeCode: requestBody.localeCode,
      marketCode: requestBody.marketCode,
      originPlaceId: requestBody.originPlaceId,
      destinationPlaceId: flightInfo.destinationPlaceId,
      travelDate: flightDate,
    };
    if (returnDate) {
      newRequest.returnDate = returnDate;
    }
    postFlightInfoRequest(newRequest).then(data => setFlightData(data));
  };

  // console.log(flightData);

  return (
    <>
      <div className="cheap-flight" onClick={getFlightDetail}>
        <div>{destination.label}</div>
        <div className="cheap-flight-info">
          {/* Vendors */}
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
      </div>
      <div className="cheap-flight-detail"></div>
    </>
  );
}

export default FlightInfo;
