/**
 * @version 1.0.0
 */

//  External dependencies
import { useContext, useEffect, useState } from 'react';
import Select from 'react-select';

// new feature : adding the current city to form & and header

// if (navigator.geolocation) {
//   navigator.geolocation.getCurrentPosition(
//     (position) => console.log(position),
//     (error) => console.log(error)
//   );
// }

//  Internal dependencies
import { LocaleContext } from '../../App';
import * as libFd from '../../libraries/flightData.service';
import { getCurrencies } from '../../services/flightData.service';
import { MdMyLocation } from 'react-icons/md';
import classes from './header.module.css';
import { error } from 'console';

/**
 * @module
 * Top part of page. Shows logo and provides currency selection.
 * Market selector is listed as disabled:
 * it was meant as bonus feature where page would show in local language.
 * This might be possible via translation API call.
 * @param selectedCurrency auto-selected from Locale info
 * @param selectCurrency state hook updated when user makes own selection
 */
function Header({
  selectedCurrency,
  selectCurrency,
}: {
  selectedCurrency: string;
  selectCurrency: (currency: string) => void;
}) {
  //  State hooks
  const [currencies, setCurrencies] = useState<libFd.Currencies>();
  const locationClickHandler = () => {
    console.log('Location clicked!');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log(position);
          const api_url = 'https://api.opencagedata.com/geocode/v1/json';
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          const query = latitude + ',' + longitude;
          const request_url =
            api_url +
            '?' +
            'key=' +
            'cd70480a70474d74bcc5394f063c2246' +
            '&q=' +
            encodeURIComponent(query) +
            '&pretty=1' +
            '&no_annotations=1';
          console.log(request_url);
          fetch(request_url, {
            method: 'GET',
          })
            .then((res) => res.json())
            .then((data) => {
              console.log(data);
              console.log(data.results[0].formatted);
            });
        },

        (error) => console.log(error)
      );
    } else {
      console.log('Geolocation is not supported by this browser!');
    }
  };
  //  Data load hooks
  useEffect(() => {
    getCurrencies().then((response) => {
      if (!response) {
        alert(
          `We couldn't load the currency list. ` +
            `The app will not function properly. Please try again later.`
        );
        return;
      }
      setCurrencies(response);
    });
  }, []);
  const localeInfo = useContext(LocaleContext);
  console.log(localeInfo);

  return (
    <div className={classes.header}>
      <header id='header' role='header'>
        <div id={classes.logo} role='logo'>
          <h1>Weekend Traveller</h1>
        </div>
        {/* Locale form */}
        <form action='submit' id='locale-options' role='locale-options'>
          {/* Market selector # Disabled */}
          <div className='option-wrapper-disabled'>
            <label className='option-label'>Your location:</label>
            <span className='option-value'>
              {useContext(LocaleContext).locationName}-{' '}
              {useContext(LocaleContext).city}
            </span>
          </div>
          {/* Currency selector */}
          <div className='option-wrapper'>
            <label className='option-label'>Currency:</label>
            <Select
              id='flight-options-currency'
              className='option-dropdown'
              classNamePrefix='option-dropdown'
              value={{
                value: selectedCurrency,
                label: selectedCurrency,
              }}
              onChange={(selected) =>
                selected && selectCurrency(selected.value)
              }
              options={currencies}
            />
          </div>
          <button
            className='geolocation'
            onClick={locationClickHandler}
            type='button'
          >
            <MdMyLocation className='geolocation-icon' />
          </button>
        </form>
        {/* Site logo */}
      </header>
    </div>
  );
}

export default Header;
