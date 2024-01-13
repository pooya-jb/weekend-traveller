import 'react-datepicker/dist/react-datepicker.css';
import './App.css';
import FlightsDashboard from './components/flightsDashboard.component';
import Footer from './components/footer.component';
import Header from './components/header.component';

function App() {
  return (
    <>
      <div id="app">
        <Header />
        <FlightsDashboard />
        <Footer />
      </div>
    </>
  );
}

export default App;
