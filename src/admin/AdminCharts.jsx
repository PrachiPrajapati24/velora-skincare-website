import React, { useState, useEffect } from 'react';
import { useAdmin } from './AdminContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut, Pie } from 'react-chartjs-2';
import './AdminCharts.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const AdminCharts = () => {
  const { API } = useAdmin();
  const [days, setDays] = useState(30);

  // States for stats
  const [registrations, setRegistrations] = useState([]);
  const [traffic, setTraffic] = useState([]);
  const [devices, setDevices] = useState([]);
  const [browsers, setBrowsers] = useState([]);
  const [revenue, setRevenue] = useState([]);
  const [categories, setCategories] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChartData = async () => {
      setLoading(true);
      try {
        const [regRes, trafRes, devRes, revRes, catRes, prodRes] = await Promise.all([
          API.get(`/registrations?days=${days}`),
          API.get(`/traffic?days=${days}`),
          API.get('/devices'),
          API.get(`/revenue?days=${days}`),
          API.get('/categories'),
          API.get('/top-products')
        ]);

        if (regRes.data.success) setRegistrations(regRes.data.data);
        if (trafRes.data.success) setTraffic(trafRes.data.data);
        if (devRes.data.success) {
          setDevices(devRes.data.devices);
          setBrowsers(devRes.data.browsers);
        }
        if (revRes.data.success) setRevenue(revRes.data.data);
        if (catRes.data.success) setCategories(catRes.data.data);
        if (prodRes.data.success) setTopProducts(prodRes.data.data);
      } catch (err) {
        console.error('Error fetching analytics chart data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [API, days]);

  if (loading) {
    return (
      <div className="ad-loading">
        <div className="ad-spinner"></div>
        <span>Loading interactive analytics charts...</span>
      </div>
    );
  }

  // 1. Registrations Line Chart
  const regChartData = {
    labels: registrations.map(item => item.label),
    datasets: [{
      label: 'New Registrations',
      data: registrations.map(item => item.count),
      borderColor: '#56876D',
      backgroundColor: 'rgba(86, 135, 109, 0.15)',
      tension: 0.3,
      fill: true,
      pointBackgroundColor: '#56876D',
      pointBorderColor: '#fff',
    }]
  };

  // 2. Website Traffic Bar Chart
  const trafficChartData = {
    labels: traffic.map(item => item.label),
    datasets: [{
      label: 'Visits',
      data: traffic.map(item => item.visits),
      backgroundColor: 'rgba(6, 182, 212, 0.75)',
      borderRadius: 6,
    }]
  };

  // 3. Revenue Trend Area Chart
  const revenueChartData = {
    labels: revenue.map(item => item.label),
    datasets: [{
      label: 'Revenue (₹)',
      data: revenue.map(item => item.revenue),
      borderColor: '#26796e',
      backgroundColor: 'rgba(38, 121, 110, 0.1)',
      tension: 0.35,
      fill: true,
      pointBackgroundColor: '#26796e',
    }]
  };

  // 4. Device Analytics Pie Chart
  const deviceLabels = devices.map(d => d._id || 'unknown');
  const deviceCounts = devices.map(d => d.count);
  const deviceColors = {
    desktop: '#3b82f6',
    mobile: '#ec4899',
    tablet: '#f59e0b',
    unknown: '#9ca3af'
  };
  const deviceChartData = {
    labels: deviceLabels.map(l => l.charAt(0).toUpperCase() + l.slice(1)),
    datasets: [{
      data: deviceCounts,
      backgroundColor: deviceLabels.map(l => deviceColors[l] || '#9ca3af'),
      borderWidth: 1,
    }]
  };

  // 5. Browser Analytics Horizontal Bar Chart
  const browserLabels = browsers.map(b => b._id || 'other');
  const browserCounts = browsers.map(b => b.count);
  const browserColors = {
    chrome: '#ea4335',
    edge: '#0078d7',
    firefox: '#ff7139',
    safari: '#00ffff',
    other: '#9ca3af'
  };
  const browserChartData = {
    labels: browserLabels.map(l => l.charAt(0).toUpperCase() + l.slice(1)),
    datasets: [{
      label: 'Visits by Browser',
      data: browserCounts,
      backgroundColor: browserLabels.map(l => browserColors[l] || '#9ca3af'),
      borderRadius: 4,
    }]
  };

  // 6. Personality / Category Distribution Chart
  const catChartData = {
    labels: categories.map(c => (c._id || 'Other').toUpperCase()),
    datasets: [{
      data: categories.map(c => c.count),
      backgroundColor: ['#56876D', '#26796e', '#7c3aed', '#ec4899', '#f59e0b', '#3b82f6'],
      borderWidth: 1,
    }]
  };

  // 7. Top Selling Products
  const prodChartData = {
    labels: topProducts.map(p => p._id.length > 20 ? p._id.substring(0, 18) + '...' : p._id),
    datasets: [{
      label: 'Units Sold',
      data: topProducts.map(p => p.totalSold),
      backgroundColor: '#7c3aed',
      borderRadius: 6,
    }]
  };

  // Shared Options
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { grid: { color: '#f3f4f6' } },
      x: { grid: { display: false } }
    }
  };

  return (
    <div className="ad-charts-page">
      <div className="ad-charts-header">
        <h1 className="ad-section-title">Analytics &amp; Interactive Reports</h1>
        <div className="ad-time-filters">
          <button className={days === 7 ? 'active' : ''} onClick={() => setDays(7)}>7 Days</button>
          <button className={days === 30 ? 'active' : ''} onClick={() => setDays(30)}>30 Days</button>
          <button className={days === 90 ? 'active' : ''} onClick={() => setDays(90)}>90 Days</button>
        </div>
      </div>

      <div className="ad-charts-grid">
        {/* Chart 1: Registrations */}
        <div className="ad-chart-card ad-card">
          <h3 className="ad-chart-title">User Registrations</h3>
          <div className="ad-chart-container">
            <Line
              data={regChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { grid: { color: '#f3f4f6' } }, x: { grid: { display: false } } }
              }}
            />
          </div>
        </div>

        {/* Chart 2: Traffic */}
        <div className="ad-chart-card ad-card">
          <h3 className="ad-chart-title">Website Traffic</h3>
          <div className="ad-chart-container">
            <Bar data={trafficChartData} options={barOptions} />
          </div>
        </div>

        {/* Chart 3: Revenue */}
        <div className="ad-chart-card ad-card">
          <h3 className="ad-chart-title">Revenue Trend (₹)</h3>
          <div className="ad-chart-container">
            <Line
              data={revenueChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { grid: { color: '#f3f4f6' } }, x: { grid: { display: false } } }
              }}
            />
          </div>
        </div>

        {/* Chart 4: Device Breakdown */}
        <div className="ad-chart-card ad-card">
          <h3 className="ad-chart-title">Device Analytics</h3>
          <div className="ad-chart-container doughnut-wrapper">
            <Pie
              data={deviceChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'right', labels: { boxWidth: 12 } } }
              }}
            />
          </div>
        </div>

        {/* Chart 5: Browser Breakdown */}
        <div className="ad-chart-card ad-card">
          <h3 className="ad-chart-title">Browser Distribution</h3>
          <div className="ad-chart-container">
            <Bar
              data={browserChartData}
              options={{
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { x: { grid: { color: '#f3f4f6' } }, y: { grid: { display: false } } }
              }}
            />
          </div>
        </div>

        {/* Chart 6: Product Category */}
        <div className="ad-chart-card ad-card">
          <h3 className="ad-chart-title">Category Inventory</h3>
          <div className="ad-chart-container doughnut-wrapper">
            <Doughnut
              data={catChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'right', labels: { boxWidth: 12 } } }
              }}
            />
          </div>
        </div>

        {/* Chart 7: Top Selling Products */}
        <div className="ad-chart-card ad-card full-width-chart">
          <h3 className="ad-chart-title">Most Ordered Products</h3>
          <div className="ad-chart-container">
            <Bar data={prodChartData} options={barOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCharts;
