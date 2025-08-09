import json
from queue import Queue
from threading import Lock

from flask import Flask, Response, jsonify, request, send_from_directory
from flask_cors import CORS

app = Flask(__name__, static_folder='public', static_url_path='')
CORS(app)

vehicles = []
clients = []
clients_lock = Lock()


def broadcast(event: str, data):
    with clients_lock:
        for q in list(clients):
            q.put((event, data))


@app.route('/api/events')
def sse():
    q = Queue()
    with clients_lock:
        clients.append(q)

    def generate():
        try:
            while True:
                event, data = q.get()
                yield f"event: {event}\n"
                yield f"data: {json.dumps(data)}\n\n"
        finally:
            with clients_lock:
                clients.remove(q)

    return Response(generate(), mimetype='text/event-stream')


@app.route('/api/vehicles', methods=['GET', 'POST'])
def api_vehicles():
    global vehicles
    if request.method == 'GET':
        return jsonify(vehicles)
    vehicles = request.get_json() or []
    broadcast('vehicles', vehicles)
    return jsonify({'status': 'ok'})


@app.route('/api/alert', methods=['POST'])
def api_alert():
    alert = request.get_json() or {}
    broadcast('alert', alert)
    return jsonify({'status': 'ok'})


@app.route('/')
def root():
    return send_from_directory(app.static_folder, 'index.html')


if __name__ == '__main__':
    app.run(port=3000, threaded=True)
