import csv
import json

def parse_csv_and_dump_json(input_csv, output_json):
    try:
        with open(input_csv, mode='r') as csv_file:
            csv_reader = csv.DictReader(csv_file)
            
            data = []
            for row in csv_reader:
                data.append({
                    "region_name": row["region_name"],
                    "icao": row["icao"]
                })
        
        with open(output_json, mode='w') as json_file:
            json.dump(data, json_file, indent=4)
        
        print(f"Successfully saved {len(data)} records to {output_json}")
    
    except Exception as e:
        print(f"Error occurred: {e}")

if __name__ == "__main__":
    input_csv = "../data/airports.csv"
    output_json = "../data/airport_region_icao.json"
    parse_csv_and_dump_json(input_csv, output_json)
