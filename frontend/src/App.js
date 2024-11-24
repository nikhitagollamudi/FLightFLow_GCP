import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import './App.css';

function App() {
  const [airports, setAirports] = useState([]); // List of airports
  const [carriers, setCarriers] = useState([]); // List of carriers
  const [years, setYears] = useState([]); // List of years
  const [selectedAirport, setSelectedAirport] = useState('');
  const [selectedCarrier, setSelectedCarrier] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [delayData, setDelayData] = useState([]);
  const [redditData, setRedditData] = useState([]);

  // Fetch available airports, carriers, and years
  useEffect(() => {
    axios.get('https://fa24-i535-hkonjeti-finalprj.uc.r.appspot.com/api/airports')
      .then((response) => setAirports(response.data))
      .catch((error) => console.error("Error fetching airports: ", error));

    axios.get('https://fa24-i535-hkonjeti-finalprj.uc.r.appspot.com/api/carriers')
      .then((response) => setCarriers(response.data))
      .catch((error) => console.error("Error fetching carriers: ", error));

    axios.get('https://fa24-i535-hkonjeti-finalprj.uc.r.appspot.com/api/years')
      .then((response) => setYears(response.data))
      .catch((error) => console.error("Error fetching years: ", error));
  }, []);

  // Fetch delay comparison data when selections change
  useEffect(() => {
    if (selectedAirport && selectedCarrier && selectedYear) {
      axios.get(`https://fa24-i535-hkonjeti-finalprj.uc.r.appspot.com/api/delay_comparison?airport=${selectedAirport}&carrier=${selectedCarrier}&year=${selectedYear}`)
        .then((response) => setDelayData(response.data))
        .catch((error) => console.error("Error fetching delay comparison data: ", error));

      axios.get(`https://fa24-i535-hkonjeti-finalprj.uc.r.appspot.com/api/reddit?airport=${selectedAirport}&carrier=${selectedCarrier}&year=${selectedYear}&delay_reason=carrier_delay`)
        .then((response) => setRedditData(response.data))
        .catch((error) => console.error("Error fetching Reddit data: ", error));
    }
  }, [selectedAirport, selectedCarrier, selectedYear]);

  // Prepare data for monthly delay comparison chart
  const generateChartData = () => {
    const labels = delayData.map((item) => `Month ${item.month}`);
    const carrierDelay = delayData.map((item) => item.carrier_delay);
    const weatherDelay = delayData.map((item) => item.weather_delay);
    const nasDelay = delayData.map((item) => item.nas_delay);
    const securityDelay = delayData.map((item) => item.security_delay);
    const lateAircraftDelay = delayData.map((item) => item.late_aircraft_delay);

    return {
      labels: labels,
      datasets: [
        { label: 'Carrier Delay', data: carrierDelay, fill: false, borderColor: 'rgba(75,192,192,1)', tension: 0.1 },
        { label: 'Weather Delay', data: weatherDelay, fill: false, borderColor: 'rgba(255,99,132,1)', tension: 0.1 },
        { label: 'NAS Delay', data: nasDelay, fill: false, borderColor: 'rgba(54,162,235,1)', tension: 0.1 },
        { label: 'Security Delay', data: securityDelay, fill: false, borderColor: 'rgba(153,102,255,1)', tension: 0.1 },
        { label: 'Late Aircraft Delay', data: lateAircraftDelay, fill: false, borderColor: 'rgba(255,159,64,1)', tension: 0.1 }
      ]
    };
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Airline Delay Data & Reddit Opinions</h1>
      </header>

      <div className="controls">
        <label htmlFor="airport-select">Select Airport: </label>
        <select id="airport-select" onChange={(e) => setSelectedAirport(e.target.value)}>
          <option value="">Select an airport</option>
          {airports.map((airport, index) => (
            <option key={index} value={airport}>{airport}</option>
          ))}
        </select>

        <label htmlFor="carrier-select">Select Carrier: </label>
        <select id="carrier-select" onChange={(e) => setSelectedCarrier(e.target.value)}>
          <option value="">Select a carrier</option>
          {carriers.map((carrier, index) => (
            <option key={index} value={carrier}>{carrier}</option>
          ))}
        </select>

        <label htmlFor="year-select">Select Year: </label>
        <select id="year-select" onChange={(e) => setSelectedYear(e.target.value)}>
          <option value="">Select a year</option>
          {years.map((year, index) => (
            <option key={index} value={year}>{year}</option>
          ))}
        </select>
      </div>

      {/* Delay Comparison Chart */}
      {delayData.length > 0 && (
        <div className="visualizations">
          <h2>Monthly Delay Comparison</h2>
          <div className="chart">
            <Line data={generateChartData()} />
          </div>
        </div>
      )}

      {/* Reddit Opinions Section */}
      {redditData.length > 0 && (
        <div className="reddit-section">
          <h2>Reddit Opinions on {selectedAirport} {selectedCarrier} Delays</h2>
          <div className="reddit-posts">
            {redditData.map((post, index) => (
              <div className="reddit-post" key={index}>
                <h3>{post.title}</h3>
                <p>{post.score} points</p>
                <a href={post.url} target="_blank" rel="noopener noreferrer">Read More</a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;