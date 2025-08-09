const map = L.map('map').setView([51.0, 10.0], 6);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap-Mitwirkende'
}).addTo(map);

const markers = {};

function updateClock() {
  const now = new Date();
  document.getElementById('clock').textContent = now.toLocaleString('de-DE');
}
setInterval(updateClock, 1000);
updateClock();

async function geocode(address) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data[0]) {
    return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
  }
  return null;
}

async function renderVehicles(list) {
  const container = document.getElementById('vehicles');
  container.innerHTML = '';
  for (const v of list) {
    const div = document.createElement('div');
    div.className = `vehicle status${v.status}`;
    div.textContent = `${v.name} (${v.callSign}) Status ${v.status}`;
    container.appendChild(div);
    if (!v.lat || !v.lng) {
      const coords = await geocode(v.address);
      if (coords) {
        v.lat = coords.lat;
        v.lng = coords.lng;
      }
    }
    if (v.lat && v.lng) {
      if (!markers[v.id]) {
        markers[v.id] = L.marker([v.lat, v.lng]).addTo(map).bindPopup(v.name);
      } else {
        markers[v.id].setLatLng([v.lat, v.lng]);
      }
    }
  }
  fitMap();
}

function fitMap() {
  const ms = Object.values(markers);
  if (ms.length === 0) return;
  const group = L.featureGroup(ms);
  map.fitBounds(group.getBounds().pad(0.2));
}

function handleAlert(a) {
  const alertEl = document.getElementById('alert');
  document.getElementById('alert-content').textContent = `${a.callSign} - ${a.keyword} - ${a.address}`;
  alertEl.classList.remove('hidden');
  const gong = document.getElementById('gong');
  gong.currentTime = 0;
  gong.play().catch(() => {});
  const utter = new SpeechSynthesisUtterance(`Einsatz für ${a.callSign} ${a.keyword} ${a.address}`);
  speechSynthesis.speak(utter);
  setTimeout(() => alertEl.classList.add('hidden'), 10000);
}

const evtSource = new EventSource('/api/events');
evtSource.addEventListener('vehicles', e => {
  const data = JSON.parse(e.data);
  renderVehicles(data);
});
evtSource.addEventListener('alert', e => {
  handleAlert(JSON.parse(e.data));
});

document.getElementById('fullscreen-btn').addEventListener('click', () => {
  document.documentElement.requestFullscreen();
});

document.addEventListener('fullscreenchange', () => {
  document.getElementById('fullscreen-btn').classList.toggle('hidden', !!document.fullscreenElement);
});

document.getElementById('audio-btn').addEventListener('click', () => {
  const dummy = new SpeechSynthesisUtterance('');
  speechSynthesis.speak(dummy);
  document.getElementById('audio-btn').style.display = 'none';
});
