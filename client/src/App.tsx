import 'react-datepicker/dist/react-datepicker.css';
import './App.css';
import React, { useContext, useEffect, useState } from 'react';

import * as libFd from './libraries/flightData.service';
import { postLocaleInfoRequest } from './services/api.service';
import FlightsDashboard from './components/flightsDashboard.component';
import Footer from './components/footer.component';
import Header from './components/header.component';

const defaultLocaleInfo: libFd.LocaleInfo = {
  marketCode: '',
  locationName: '',
  currencyCode: '',
  localeCode: '',
};
export const LocaleContext: React.Context<libFd.LocaleInfo> =
  React.createContext(defaultLocaleInfo);

function App() {
  const [localeInfo, setLocaleInfo] = useState(defaultLocaleInfo);
  const [selectedCurrency, selectCurrency] = useState(
    useContext(LocaleContext).currencyCode
  );

  useEffect(() => {
    postLocaleInfoRequest().then(data => {
      setLocaleInfo(data);
      selectCurrency(data.currencyCode);
    });
  }, []);
  useEffect(() => {
    setLocaleInfo({ ...localeInfo, currencyCode: selectedCurrency });
  }, [selectedCurrency]);

  return (
    <>
      <LocaleContext.Provider value={localeInfo}>
        <div id="app">
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
