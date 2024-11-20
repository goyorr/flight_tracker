import json
import airportsdata

def enrich_airports_with_names(input_json, output_json):
    try:
        airports = airportsdata.load("ICAO")
        
        with open(input_json, mode='r') as json_file:
            data = json.load(json_file)
        
        enriched_data = []
        for entry in data:
            icao_code = entry["icao"]
            airport_name = airports.get(icao_code, {}).get("name", "Unknown")
            enriched_data.append({
                "icao": icao_code,
                "airport_name": airport_name
            })
        
        with open(output_json, mode='w') as output_file:
            json.dump(enriched_data, output_file, indent=4)
        
        print(f"Successfully saved {len(enriched_data)} records to {output_json}")
    
    except Exception as e:
        print(f"Error occurred: {e}")

if __name__ == "__main__":
    input_json = "airport_region_icao.json"
    output_json = "airport_city_icao.json"
    enrich_airports_with_names(input_json, output_json)
