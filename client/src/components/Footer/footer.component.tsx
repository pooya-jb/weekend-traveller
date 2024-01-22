/**
 * @version 1.0.0
 */

/**
 * @module
 * Bottom part of page.
 * Static module crediting contributors.
 */
function Footer() {
  return (
    <>
      <footer id="footer" role="footer">
        <div id="footer-notes">
          {/* API credit # mandatory */}
          <div className="footer-note">
            <a href="http://www.skyscanner.net/">
              <img src="src/assets/inline--black.svg"></img>
            </a>
          </div>
          {/* The benevolent creator */}
          <div className="footer-note">Application by Daniel Maczak</div>
          {/* Background image credit # mandatory */}
          <div className="footer-note">
            <a href="https://www.freepik.com/free-photo/beautiful-paradise-island-with-beach-sea_3531645.htm">
              Image by lifeforstock
            </a>{' '}
            on Freepik
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
