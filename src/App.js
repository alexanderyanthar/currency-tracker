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

      createChartWithData(chartData);
    } catch (e) {
      console.error('Error fetching data:', e);
    }
  };

  const createChartWithData = (data) => {
    const chartContainer = document.getElementById('chart-container');
    chartContainer.innerHTML = ''; // Clear previous chart

    const chart = createChart(chartContainer, {
      autoSize: true,
      localizationOptions: {
        dateFormat: 'MMMM dd, yyyy',
      },
    });

    const formattedData = data.map(({ date, open, high, low, close }) => {
      const time = new Date(date).getTime();
      return {
        time: time / 1000, // Divide by 1000 to convert milliseconds to seconds
        open,
        high,
        low,
        close,
      };
    });

    formattedData.sort((a, b) => a.time - b.time);

    const candlestickSeries = chart.addCandlestickSeries();

    candlestickSeries.setData(formattedData);

    // Get the time scale API
    const timeScaleApi = chart.timeScale();

    // Customize the time scale
    timeScaleApi.applyOptions({
      timeVisible: true,
      secondsVisible: false,
    });

    timeScaleApi.subscribeVisibleTimeRangeChange(() => {
      // Format the dates on the time scale
      const visibleBars = timeScaleApi.getVisibleLogicalRange();
      const fromDate = formattedData[visibleBars.from]?.date;
      const toDate = formattedData[visibleBars.to]?.date;

      if (fromDate && toDate) {
        const formattedFromDate = new Date(fromDate).toLocaleDateString();
        const formattedToDate = new Date(toDate).toLocaleDateString();
        const formattedRange = `${formattedFromDate} - ${formattedToDate}`;

        timeScaleApi.options().timeVisibleRangeLabel = formattedRange;
      }
    });
  };



  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Currency Exchange Rate Tracker</h1>
      </header>
      <main className="App-main">
        <div id="chart-container"></div>
      </main>
      <footer className="App-footer">
        <p>Powered by Alexander Yanthar</p>
      </footer>
    </div>
  );
}

export default App;
