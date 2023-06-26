import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [chartData, setChartData] = useState([]);
  const apiKey = 'GEDZHAFMQCTPRQZN';

  const fetchData = async () => {
    try {
      const response = await fetch(`https://www.alphavantage.co/query?function=FX_DAILY&from_symbol=EUR&to_symbol=USD&apikey=${apiKey}`);
      const data = await response.json();
      setChartData(data);
    } catch(e) {
    console.error('Error fetching data:', e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        <h1>Currency Exchange Rate Tracker</h1>
      </header>
      <main className='App-main'>

      </main>
      <footer className='App=footer'>
        <p>Powered by Alexander Yanthar</p>
      </footer>
    </div>
  );
}

export default App;
