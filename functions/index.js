const functions = require('firebase-functions');
const express = require('express');
const app = express();

// Simple telemetry stub - returns simulated sensor data
app.get('/api/telemetry', (req, res) => {
  const now = Date.now();
  const payload = {
    timestamp: now,
    sensors: {
      temperature: Number((20 + Math.random()*15).toFixed(2)),
      rpm: Math.floor(800 + Math.random()*3000),
      battery: Math.round(40 + Math.random()*60)
    }
  };
  res.set('Cache-Control', 'no-store, max-age=0');
  res.json(payload);
});

exports.api = functions.https.onRequest(app);
