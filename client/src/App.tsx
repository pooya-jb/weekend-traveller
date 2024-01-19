/**
 * @author Daniel Maczak / where not specified otherwise
 * @version 1.0.0
 */

//  External dependencies
import 'react-datepicker/dist/react-datepicker.css';
import './App.css';
import React, { useContext, useEffect, useState } from 'react';

//  Internal dependencies
import * as libFd from './libraries/flightData.service';
import * as c from './services/const.service';
import { postLocaleInfoRequest } from './services/flightData.service';
import Header from './components/header.component';
import FlightsDashboard from './components/flightsDashboard.component';
import Footer from './components/footer.component';

//  Locale info is present in majority of API requests anywhere in app
// add New York as default city to pass the type check
const defaultLocaleInfo: libFd.LocaleInfo = {
  // Fallback values
  marketCode: 'US',
  locationName: 'United states',
  currencyCode: 'USD',
  localeCode: 'en-US',
  city: 'New York',
};
export const LocaleContext: React.Context<libFd.LocaleInfo> =
  React.createContext(defaultLocaleInfo);

/**
 * @module
 * Top-level app component.
 * Keeps accurate locale info at all times.
 */
function App() {
  //  State hooks
  const [localeInfo, setLocaleInfo] =
    useState<libFd.LocaleInfo>(defaultLocaleInfo);
  const [selectedCurrency, selectCurrency] = useState<string>(
    useContext(LocaleContext).currencyCode
  );

  //  Data update hooks
  useEffect(() => {
    postLocaleInfoRequest().then((data) => {
      if (!data) return; // will use fallback values
      setLocaleInfo({ ...data, localeCode: c.GLOBAL_LOCALE });
      selectCurrency(data.currencyCode); // autoselect currency for user
    });
  }, []);
  useEffect(() => {
    setLocaleInfo({ ...localeInfo, currencyCode: selectedCurrency });
  }, [selectedCurrency]);

  return (
    <>
      <LocaleContext.Provider value={localeInfo}>
        <div id='app'>
          <Header
            selectedCurrency={selectedCurrency}
            selectCurrency={selectCurrency}
          />
          <FlightsDashboard />
          <Footer />
        </div>
      </LocaleContext.Provider>
    </>
  );
}

export default App;
