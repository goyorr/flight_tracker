let existingArcs = [];
let cords = [];
let globe; 

function fetchAndUpdateData(airportCode) {
  fetch('http://0.0.0.0:5000/api/fetch_and_update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ airport_code: airportCode })
  })
    .then(response => response.json())
    .then(data => {
      if (data.status === "success") {
        existingArcs = [];

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

        const newArcsData = cords.map(cord => ({
          startLat: cord.origin_lat,
          startLng: cord.origin_lon,
          endLat: cord.des_lat,
          endLng: cord.des_lon,
          color: 
            cord.origin === airportCode ? 'orange' : 'green'
        }));

        existingArcs = updateArcs(existingArcs, newArcsData);

        if (globe) {
          globe.arcsData(existingArcs);
        }
      } else {
        console.error("Error fetching data:", data.message);
      }
    })
    .catch(error => console.error('Error:', error));
}

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

fetchAndUpdateData('GMAD');

window.addEventListener('resize', () => {
  if (globe) {
    globe.width(window.innerWidth).height(window.innerHeight);  
  }
});

document.addEventListener('alpine:init', () => {
  Alpine.data('combobox', () => ({
      allOptions: [],
      options: [],
      isOpen: false,
      openedWithKeyboard: false,
      selectedOption: null,
      query: '',
      page: 1,
      perPage: 20,
      async init() {
          this.fetchData();
      },

      async fetchData() {
          const response = await fetch(`http://0.0.0.0:5000/api/search_airports?query=${this.query}&page=${this.page}&per_page=${this.perPage}`);
          const data = await response.json();
          this.options = data;
        },

        setSelectedOption(option) {
          this.selectedOption = option;
          this.isOpen = false;
          this.openedWithKeyboard = false;
          this.$refs.hiddenTextField.value = option;
          fetchAndUpdateData(option.icao);
      },
      

      getFilteredOptions(query) {
          this.query = query;
          this.page = 1;
          this.fetchData();
      },

      handleKeydownOnOptions(event) {
          if ((event.keyCode >= 65 && event.keyCode <= 90) || (event.keyCode >= 48 && event.keyCode <= 57) || event.keyCode === 8) {
              this.$refs.searchField.focus();
          }
      },
  }))
})
