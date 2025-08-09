# Einsatzmonitor

Ein einfacher Einsatzmonitor mit freier API und Weboberfläche. Der Server basiert auf Node.js und stellt eine Website bereit, die die Fahrzeugpositionen auf einer OpenStreetMap-Karte darstellt und Alarmierungen visualisiert.

## Installation

### Node.js

```bash
npm install
npm start
```

### Python

```bash
pip install -r requirements.txt
python server.py
```

Lege eine Audiodatei `public/alert.mp3` ab, um den Alarmgong zu definieren.

## API

### `GET /api/vehicles`

Gibt die aktuelle Fahrzeugliste zurück.

### `POST /api/vehicles`

Ersetzt die Fahrzeugliste. Beispiel:

```json
[
  {
    "id": 1,
    "name": "LF 10",
    "callSign": "Florian 1/42",
    "crew": ["Max", "Anna"],
    "status": 1,
    "address": "Marktplatz 1, Musterstadt"
  }
]
```

Status 1 und 2 werden grün dargestellt, alle anderen rot.

### `POST /api/alert`

Löst eine Alarmierung aus. Beispiel:

```json
{
  "callSign": "Florian 1/42",
  "keyword": "Brandmeldeanlage",
  "address": "Musterstraße 1, Musterstadt"
}
```

### `GET /api/events`

Server-Sent-Events-Endpunkt. Sendeereignisse:

- `vehicles`: enthält die komplette Fahrzeugliste
- `alert`: enthält die Alarmierungsdaten

## Client

Die Weboberfläche zeigt eine Karte, eine Fahrzeugliste sowie Datum und Uhrzeit an. Ein Vollbild-Button blendet sich im Vollbildmodus aus. Bei einer Alarmierung erscheint ein Overlay mit Gong und Sprachausgabe.

Unter iOS muss die Sprachausgabe über den Button „Audio aktivieren“ zunächst freigegeben werden.

## Lizenz

ISC
