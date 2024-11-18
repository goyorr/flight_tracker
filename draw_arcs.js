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

let airportCode

// Function to handle the radio button change
function handleAirportSelection(event) {
  const selectedAirport = event.target.id;  // Get the ID of the selected radio button
   airportCode = airportCodes[selectedAirport];  // Get the airport code from the mapping

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
          origin_name: flight.origin_name,
          destination_name: flight.destination_name,
          origin: flight.origin,
          destination: flight.destination,
          origin_lat: flight.origin_lat,
          origin_lon: flight.origin_lon,
          des_lat: flight.dest_lat,
          des_lon: flight.dest_lon,
          progress_precent: flight.progress_precent,
          estimated_in: flight.estimated_in
        }));

        // Generate new arcs data
        const newArcsData = cords.map(cord => ({
          startLat: cord.origin_lat,
          startLng: cord.origin_lon,
          endLat: cord.des_lat,
          endLng: cord.des_lon,
          color: 
            cord.origin === airportCode ? 'orange' : 'green'
            // cord.origin === airportCode ? 'red' : 'blue'
          // ]
        }));

        console.log("New Arcs Data:", newArcsData);

        updateFlightLog(cords);

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





// Function to update the flight log dynamically
function updateFlightLog(flightData) {
  const flightLog = document.getElementById('flightLog');

  console.log(flightData)
  
  // Clear existing log
  flightLog.innerHTML = '';

  // Populate log with new data
  flightData.forEach(flight => {
    // Determine the arrow SVG based on status
    const arrowSVG = airportCode === flight.destination
      ? `<svg xmlns="http://www.w3.org/2000/svg" height="40px" width="40px" viewBox="0 0 24 24"><path d="M17 12v4a1 1 0 0 1-1 1h-4a1 1 0 0 1 0-2h1.586L7.293 8.707a1 1 0 1 1 1.414-1.414L15 13.586V12a1 1 0 0 1 2 0z" style="fill:green" data-name="Down Right"/></svg>`
      : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M16.707 16.707a1 1 0 0 1-1.414 0L9 10.414V12a1 1 0 0 1-2 0V8a1 1 0 0 1 1-1h4a1 1 0 0 1 0 2h-1.586l6.293 6.293a1 1 0 0 1 0 1.414z" style="fill:#ff8e31" data-name="Up Left"/></svg>`;

    // Create a list item for each flight
    const listItem = `
      <li class="card__list_item">
        <span class="check">${arrowSVG}</span>
        <span class="list_text">${flight.origin_name} to ${flight.destination_name}</span>
        <span class="list_text progress">${flight.progress_precent}%</span>
      </li>
    `;

    // Append to the log
    flightLog.insertAdjacentHTML('beforeend', listItem);
  });
}

// Call this function with your flight data to populate the log
