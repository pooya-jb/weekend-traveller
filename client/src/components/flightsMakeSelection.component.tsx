/**
 * @version 1.0.0
 */

/**
 * Home page before user makes selection.
 * Static module with app usage info.
 */
function FlightsMakeSelection() {
  return (
    <>
      <div className="welcome-container">
        <div>
          <h2>Welcome to Weekend Traveller</h2>
          <p>Please proceed to select:</p>
          <ul>
            <li>the currency of your choice</li>
            <li>from where you fly and when is the first fitting date</li>
            <li>if you want to return and when</li>
            <li>how many consecutive weeks do you wish to query</li>
          </ul>
          <p>
            Once all is ready, click the search icon 🔎︎ and get ready for your
            next travel!
          </p>
        </div>
      </div>
    </>
  );
}

export default FlightsMakeSelection;
