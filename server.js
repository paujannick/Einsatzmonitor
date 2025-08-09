const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let vehicles = [];
let clients = [];

function sendEvent(res, event, data) {
  res.write(`event: ${event}\n`);
  res.write(`data: ${JSON.stringify(data)}\n\n`);
}

function broadcast(event, data) {
  clients.forEach(client => sendEvent(client.res, event, data));
}

app.get('/api/events', (req, res) => {
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive'
  });
  res.flushHeaders();
  const clientId = Date.now();
  clients.push({ id: clientId, res });

  req.on('close', () => {
    clients = clients.filter(c => c.id !== clientId);
  });
});

app.get('/api/vehicles', (req, res) => {
  res.json(vehicles);
});

app.post('/api/vehicles', (req, res) => {
  vehicles = req.body || [];
  broadcast('vehicles', vehicles);
  res.json({ status: 'ok' });
});

app.post('/api/alert', (req, res) => {
  const alert = req.body || {};
  broadcast('alert', alert);
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
