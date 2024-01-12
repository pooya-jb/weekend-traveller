function Header() {
  return (
    <>
      <div id="header" role="header">
        {/* Site logo */}
        <div id="header-logo" role="logo">
          <h1>Weekend Traveller</h1>
        </div>
        {/* Locale form */}
        <form action="submit" id="locale-options" role="locale-options">
          {/* Market selector # Disabled */}
          <div className="option-wrapper">
            <label className="option-label">Your location:</label>
            <span className="option-value">####</span>
          </div>
          {/* Currency selector */}
          <div className="option-wrapper">
            <label htmlFor="locale-options-currency" className="option-label">
              Currency:
            </label>
            <select id="locale-options-currency" className="option-dropdown">
              ####
            </select>
          </div>
        </form>
      </div>
    </>
  );
}

export default Header;
