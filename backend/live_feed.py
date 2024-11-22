import requests
import random
import json
import time
import os

api_key = os.getenv('FLIGHT_AWARE_API_KEY')

airport_codes = ['KJFK', 'KATL', 'OMDB', 'KDFW', 'EGLL', 'RJTT', 'LTFM', 'ZGGG']

file_path = './data/most_pop.json'

with open(file_path, 'w') as file:
    json.dump([], file, indent=4)

def fetch_data():
    for airport_code in airport_codes:
        endpoint = f'https://aeroapi.flightaware.com/aeroapi/airports/{airport_code}/flights'
        
        headers = {'x-apikey': api_key}
        
        response = requests.get(endpoint, headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            print(f"Fetched data for {airport_code}")
            
            parsed_data = []
            for key in ["arrivals", "departures", "scheduled_arrivals", "scheduled_departures"]:
                for flight in data.get(key, []):
                    parsed_flight = {
                        'origin': flight.get('origin', {}).get('city', 'Unknown'),
                        'destination': flight.get('destination', {}).get('city', 'Unknown'),
                        'scheduled_out': flight.get('scheduled_out', 'Unknown'),
                        'estimated_off': flight.get('estimated_off', 'Unknown')
                    }
                    parsed_data.append(parsed_flight)
            
            with open(file_path, 'r+') as file:
                existing_data = json.load(file)
                existing_data.extend(parsed_data)
                file.seek(0)
                json.dump(existing_data, file, indent=4)
        else:
            print(f"Failed to fetch data for {airport_code}. Status Code: {response.status_code}")
        
        time.sleep(30)

while True:
    fetch_data()
    print("Data collection complete. Sleeping for 2 hours.")
    time.sleep(7200)