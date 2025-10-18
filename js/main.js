// Telemetry client with Chart.js visualization and polling fallback
document.addEventListener('DOMContentLoaded', () => {
  const rawEl = document.getElementById('telemetry');
  const refreshBtn = document.getElementById('refresh');
  const simulateBtn = document.getElementById('simulate');
  const ctx = document.getElementById('telemetryChart').getContext('2d');

  // Setup Chart.js line chart if available
  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [
        { label: 'Temperature', data: [], borderColor: '#ff6384', tension: 0.2 },
        { label: 'RPM', data: [], borderColor: '#36a2eb', tension: 0.2 },
        { label: 'Battery', data: [], borderColor: '#ffcd56', tension: 0.2 }
      ]
    },
    options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } } }
  });

  function renderRaw(data){
    rawEl.textContent = JSON.stringify(data, null, 2);
  }

  async function fetchTelemetry(){
    try{
      const res = await fetch('/api/telemetry', { cache: 'no-store' });
      if(!res.ok) throw new Error(res.status + ' ' + res.statusText);
      const data = await res.json();
      renderRaw(data);
      addPointToChart(data);
    }catch(err){
      rawEl.textContent = 'Error fetching telemetry: ' + err.message;
      console.error(err);
    }
  }

  function addPointToChart(data){
    const t = new Date(data.timestamp).toLocaleTimeString();
    // push labels and values, keep last 30 points
    chart.data.labels.push(t);
    chart.data.datasets[0].data.push(data.sensors.temperature);
    chart.data.datasets[1].data.push(data.sensors.rpm);
    chart.data.datasets[2].data.push(data.sensors.battery);
    if(chart.data.labels.length > 30){
      chart.data.labels.shift();
      chart.data.datasets.forEach(ds => ds.data.shift());
    }
    chart.update('quiet');
  }

  const POLL_MS = 3000;
  let pollId = setInterval(fetchTelemetry, POLL_MS);
  refreshBtn.addEventListener('click', fetchTelemetry);
  simulateBtn.addEventListener('click', async () => {
    // call local function to get one simulated point if backend not present
    try{
      const res = await fetch('/api/telemetry');
      const d = await res.json();
      renderRaw(d);
      addPointToChart(d);
    }catch(e){
      // generate simulated data client-side
      const simulated = { timestamp: Date.now(), sensors: { temperature: (20 + Math.random()*10).toFixed(2), rpm: Math.floor(1000 + Math.random()*2000), battery: Math.round(60 + Math.random()*40) } };
      renderRaw(simulated);
      addPointToChart({ timestamp: simulated.timestamp, sensors: { temperature: Number(simulated.sensors.temperature), rpm: simulated.sensors.rpm, battery: simulated.sensors.battery } });
    }
  });

  // initial load
  fetchTelemetry();

  // expose controls for debugging
  window.__flux = { start: () => { if(!pollId) pollId = setInterval(fetchTelemetry, POLL_MS); }, stop: () => { clearInterval(pollId); pollId = null; } }
});
