import { useEffect, useState } from 'react';
import { getCurrencies, postLocaleInfoRequest } from '../services/api.service';

function Header() {
  const [currencies, setCurrencies] = useState<string[]>([]);
  const [userMarket, setUserMarket] = useState<string>('');
  const [userCurrency, setUserCurrency] = useState<string>('');

  useEffect(() => {
    getCurrencies().then(response => setCurrencies(response));
    postLocaleInfoRequest().then(response => {
      setUserMarket(response.locationName);
      setUserCurrency(response.currencyCode);
    });
  }, []);

  return (
    <>
      <div id="header" role="header">
        {/* Locale form */}
        <form action="submit" id="locale-options" role="locale-options">
          {/* Market selector # Disabled */}
          <div className="option-wrapper">
            <label className="option-label">Your location:</label>
            <span className="option-value">{userMarket}</span>
          </div>
          {/* Currency selector */}
          <div className="option-wrapper">
            <label htmlFor="locale-options-currency" className="option-label">
              Currency:
            </label>
            <select id="locale-options-currency" className="option-dropdown">
              {currencies.map(currency => (
                <option
                  key={currency}
                  value={currency}
                  className="option-item"
                  selected={currency === userCurrency}
                >
                  {currency}
                </option>
              ))}
            </select>
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
