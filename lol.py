import requests
import json


api_key = 'gWKvad4goOUHnLERuC98ZBZ3fQ31G4ZU'
headers = {'x-apikey': api_key}

endpoint = 'https://aeroapi.flightaware.com/aeroapi/airports'

all_data = []  # List to store data from all pages
next_url = endpoint  # Start with the base endpoint

while next_url:
    response = requests.get(next_url, headers=headers)
    print(f"Fetching: {next_url}, Status: {response.status_code}")  # Debug
    
    if response.status_code == 200:
        data = response.json()
        print(json.dumps(data, indent=4))  # Debug: Inspect the JSON response
        all_data.extend(data.get('airports', []))  # Append current page data

        # Get the "next" URL
        next_cursor = data.get('links', {}).get('next')
        print(f"Next cursor: {next_cursor}")  # Debug
        
        if next_cursor:
            next_url = f'https://aeroapi.flightaware.com/aeroapi{next_cursor}'  # Construct the full URL
            print(f"Constructed next URL: {next_url}")  # Debug
        else:
            next_url = None  # No more pages
    else:
        print(f"Error: Unable to fetch data. Status code: {response.status_code}")
        print(response.text)  # Print error details
        break

# Save all data to a JSON file
with open('all_data.json', 'w') as file:
    json.dump(all_data, file, indent=4)

print("Data successfully fetched and saved!")