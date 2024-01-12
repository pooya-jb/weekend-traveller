function FlightOptions() {
  return (
    <>
      <form action="submit" id="flight-options" role="flight-options">
        {/* Origin selector */}
        <div className="option-wrapper">
          <label htmlFor="flight-options-from" className="option-label">
            From:
          </label>
          <select id="flight-options-from" className="option-dropdown">
            ####
          </select>
        </div>
        {/* Start date selector */}
        <div className="option-wrapper">
          <label htmlFor="flight-options-start-date" className="option-label">
            Search from:
          </label>
          <select id="flight-options-start-date" className="option-dropdown">
            ####
          </select>
        </div>
        {/* Trip length selector */}
        <div className="option-wrapper">
          <label htmlFor="flight-options-return" className="option-label">
            Return:
          </label>
          <select id="flight-options-return" className="option-dropdown">
            ####
          </select>
        </div>
        {/* Weeks to show selector */}
        <div className="option-wrapper">
          <label htmlFor="flight-options-show-x-weeks" className="option-label">
            Show:
          </label>
          <select id="flight-options-show-x-weeks" className="option-dropdown">
            ####
          </select>
        </div>
        {/* Search button */}
        <div className="option-wrapper">
          <button id="flight-options-search" className="option-button">
            &#x1F50E;&#xFE0E;
          </button>
        </div>
      </form>
    </>
  );
}

export default FlightOptions;
