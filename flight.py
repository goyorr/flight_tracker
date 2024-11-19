from flask import Flask, request, jsonify
import requests
import airportsdata
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

api_key = 'gWKvad4goOUHnLERuC98ZBZ3fQ31G4ZU'
headers = {'x-apikey': api_key}

def get_enroute_flights(json_data):
    enroute_flights = []
    airports = airportsdata.load()
    for key in ["arrivals", "departures", "scheduled_arrivals", "scheduled_departures"]:
        for flight in json_data.get(key, []):
            if "En Route" in flight.get("status", ""):
                # print(flight)
                try:
                    enroute_flights.append({
                        "origin_name": flight["origin"]["city"],
                        "destination_name": flight["destination"]["city"],
                        "origin": flight["origin"]["code"],
                        "destination": flight["destination"]["code"],
                        "origin_lat": airports[flight["origin"]["code"]]["lat"],
                        "origin_lon": airports[flight["origin"]["code"]]["lon"],
                        "dest_lat": airports[flight["destination"]["code"]]["lat"],
                        "dest_lon": airports[flight["destination"]["code"]]["lon"],
                        "time_out": flight["actual_off"],
                        "time_in": flight["estimated_in"],
                        "progress_precent": flight["progress_percent"],
                        "estimated_in": flight["estimated_in"]
                    })
                except:
                    print("Error fetching a flight!")
    return enroute_flights

@app.route('/fetch_and_update', methods=['POST', 'OPTIONS'])
def fetch_and_update():
    if request.method == 'OPTIONS':
        return '', 200

    airport_code = request.json.get('airport_code', 'GAMD')
    endpoint = f'https://aeroapi.flightaware.com/aeroapi/airports/{airport_code}/flights'
    response = requests.get(endpoint, headers=headers)
    
    if response.status_code == 200:
        data = response.json()
        enroute_flights = get_enroute_flights(data)
        
        return jsonify({"status": "success", "message": "Data fetched successfully!", "data": enroute_flights})
    else:
        return jsonify({"status": "error", "message": response.text}), response.status_code

if __name__ == '__main__':
    app.run(debug=True)
