import { useContext, useEffect, useState } from 'react';
import Select from 'react-select';

import { LocaleContext } from '../App';
import * as libFd from '../libraries/flightData.service';
import { getCurrencies } from '../services/api.service';

function Header({
  selectedCurrency,
  selectCurrency,
}: {
  selectedCurrency: string;
  selectCurrency: (currency: string) => void;
}) {
  const [currencies, setCurrencies] = useState<libFd.Currencies>([]);

  useEffect(() => {
    getCurrencies().then(response => {
      setCurrencies(response);
    });
  }, []);

  return (
    <>
      <div id="header" role="header">
        {/* Locale form */}
        <form action="submit" id="locale-options" role="locale-options">
          {/* Market selector # Disabled */}
          <div className="option-wrapper-disabled">
            <label className="option-label">Your location:</label>
            <span className="option-value">
              {useContext(LocaleContext).locationName}
            </span>
          </div>
          {/* Currency selector */}
          <div className="option-wrapper">
            <label htmlFor="locale-options-currency" className="option-label">
              Currency:
            </label>
            <Select
              id="flight-options-currency"
              className="option-dropdown"
              classNamePrefix="option-dropdown"
              value={
                // currencies.find(currency => currency.value === selectedCurrency)
                {
                  value: selectedCurrency,
                  label: selectedCurrency,
                }
              }
              onChange={selected => selected && selectCurrency(selected.value)}
              options={currencies}
            />
          </div>
        </form>
        {/* Site logo */}
        <div id="header-logo" role="logo">
          <h1>Weekend Traveller</h1>
        </div>
      </div>
    </>
  );
}

export default Header;
