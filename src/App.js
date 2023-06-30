import { useEffect, useState } from 'react';
import './App.css';
import { createChart } from 'lightweight-charts';

function App() {
  const [chartData, setChartData] = useState([]);
  const apiKey = 'GEDZHAFMQCTPRQZN';

  const fetchData = async () => {
    try {
      const response = await fetch(
        `https://www.alphavantage.co/query?function=FX_DAILY&from_symbol=EUR&to_symbol=USD&apikey=${apiKey}`
      );
      const data = await response.json();
      console.log(data);

      const chartData = Object.entries(data['Time Series FX (Daily)']).map(([date, values]) => {
        const open = parseFloat(values['1. open']);
        const high = parseFloat(values['2. high']);
        const low = parseFloat(values['3. low']);
        const close = parseFloat(values['4. close']);

        return {
          date,
          open,
          high,
          low,
          close,
        };
      });

      setChartData(chartData);
      console.log(chartData);
    } catch (e) {
      console.error('Error fetching data:', e);
    }
  };

  useEffect(() => {
    const createAndSetChartData = () => {
      const chartContainer = document.getElementById('chart-container');

      // Remove the previous chart if it exists
      while (chartContainer.firstChild) {
        chartContainer.firstChild.remove();
      }

      const chart = createChart(chartContainer, { width: 800, height: 400 });

      const formattedData = chartData.map(({ date, open, high, low, close }) => ({
        time: new Date(date).getTime(),
        open,
        high,
        low,
        close,
      }));

      formattedData.sort((a, b) => a.time - b.time);

      const candlestickSeries = chart.addCandlestickSeries();

      candlestickSeries.setData(formattedData);
    };

    if (chartData.length > 0) {
      createAndSetChartData();
    }
  }, [chartData]);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Currency Exchange Rate Tracker</h1>
      </header>
      <main className="App-main">
        <div id="chart-container" style={{ width: '800px', height: '400px' }}></div>
      </main>
      <footer className="App-footer">
        <p>Powered by Alexander Yanthar</p>
      </footer>
    </div>
  );
}

export default App;
