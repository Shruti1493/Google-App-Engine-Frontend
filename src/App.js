
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const App = () => {
  const [query, setQuery] = useState('python');
  const [date, setDate] = useState('today 1-m');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const fetchGoogleTrendsData = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/google-api/', {
        params: {
          query: query,
          date: date,
        },
      });

      if (response.data) {
        setData(response.data); // Store the data in state
        setError(null); // Reset error if data is fetched successfully
      }
    } catch (err) {
      setError('Failed to fetch data. Please try again later.');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchGoogleTrendsData();
  }, [query, date]);

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
  };

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  // Prepare the data for Chart.js
  const prepareChartData = () => {
    if (data && data.interest_over_time) {
      const dates = data.interest_over_time.timeline_data.map(item => item.date);
      const values = data.interest_over_time.timeline_data.map(item => item.values[0].extracted_value);

      return {
        labels: dates,
        datasets: [
          {
            label: `Interest Over Time for "${query}"`,
            data: values,
            fill: false,
            borderColor: 'rgba(75, 192, 192, 1)',
            tension: 0.1,
          },
        ],
      };
    }
    return {};
  };

  return (
    <div>
      <h1>Google Trend Search</h1>

      {/* Input fields for query and date */}
      <div>
        <input
          type="text"
          value={query}
          onChange={handleQueryChange}
          placeholder="Enter search query"
        />
        <input
          type="text"
          value={date}
          onChange={handleDateChange}
          placeholder="Enter date (e.g., today 1-m)"
        />
      </div>

      {/* Button to fetch data */}
      <button onClick={fetchGoogleTrendsData}>Fetch Trends</button>

      {/* Error message */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Display chart */}
      {data ? (
        <div>
          <h2>Google Trends Data for "{query}"</h2>
          <div className='max-h-100'>
          <Line data={prepareChartData()} />
          </div>
        </div>
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
};

export default App;
