let cords = [];
let globe; 
let existingArcs = [];

// Airport codes mapping
const airportCodes = {
  'Agadir': 'GMAD',
  'Paris': 'LFPG',
  'NewYork': 'KJFK',
  'London': 'EGLL'
};

// Function to handle the radio button change
function handleAirportSelection(event) {
  const selectedAirport = event.target.id;  // Get the ID of the selected radio button
  const airportCode = airportCodes[selectedAirport];  // Get the airport code from the mapping

  console.log(`Selected airport: ${selectedAirport} (Code: ${airportCode})`);

  fetchAndUpdateData(airportCode);
}

// Function to fetch and update data based on the selected airport code
function fetchAndUpdateData(airportCode) {
  console.log("Fetching new data...");

  // Send the airport code to the Flask backend
  fetch('http://127.0.0.1:5000/fetch_and_update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ airport_code: airportCode }) // Pass the airport code to Flask
  })
    .then(response => response.json())
    .then(data => {
      if (data.status === "success") {
        console.log("Data fetched successfully:", data.data);

        // Clear old arcs
        existingArcs = [];

        // Map the new flight data
        cords = data.data.map(flight => ({
          origin: flight.origin,
          origin_lat: flight.origin_lat,
          origin_lon: flight.origin_lon,
          des_lat: flight.dest_lat,
          des_lon: flight.dest_lon,
          progress_precent: flight.progress_precent
        }));

        // Generate new arcs data
        const newArcsData = cords.map(cord => ({
          startLat: cord.origin_lat,
          startLng: cord.origin_lon,
          endLat: cord.des_lat,
          endLng: cord.des_lon,
          color: [
            cord.origin === airportCode ? 'red' : 'blue',
            cord.origin === airportCode ? 'red' : 'blue'
          ]
        }));

        console.log("New Arcs Data:", newArcsData);

        // Add new arcs to the existing arcs array
        existingArcs = updateArcs(existingArcs, newArcsData);

        // Update the globe with the new arcs
        if (globe) {
          globe.arcsData(existingArcs);
        }
      } else {
        console.error("Error fetching data:", data.message);
      }
    })
    .catch(error => console.error('Error:', error));
}


// Function to update arcs data
function updateArcs(existingArcs, newArcsData) {
  const updatedArcs = [...existingArcs];

  newArcsData.forEach(newArc => {
    const existingArcIndex = updatedArcs.findIndex(arc =>
      arc.startLat === newArc.startLat &&
      arc.startLng === newArc.startLng &&
      arc.endLat === newArc.endLat &&
      arc.endLng === newArc.endLng
    );

    if (existingArcIndex === -1) {
      updatedArcs.push(newArc);
    } else {
      updatedArcs[existingArcIndex] = newArc;
    }
  });

  return updatedArcs;
}

// Initialize globe (your existing globe setup code)
function initializeGlobe() {
  globe = Globe()
    .globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
    .arcColor('color')
    .arcDashLength(() => 4)
    .arcDashGap(() => 2)
    .arcDashAnimateTime(() => Math.random() * 4000 + 500)
    .arcStroke('3')
    (document.getElementById('globeViz'));
}

initializeGlobe();

// Attach event listeners to radio buttons
const radioButtons = document.querySelectorAll('input[name="option"]');
radioButtons.forEach(button => {
  button.addEventListener('change', handleAirportSelection);  // Trigger fetch when radio button is selected
});

// Fetch initial data on page load (optional)
fetchAndUpdateData('GMAD'); // Default to Agadir (GMAD)

// Resize globe on window resize
window.addEventListener('resize', () => {
  if (globe) {
    globe.width(window.innerWidth).height(window.innerHeight);  
  }
});
