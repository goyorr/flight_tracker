document.addEventListener('DOMContentLoaded', () => {
    fetchAndDisplayFlights();

    setInterval(() => {
        fetchAndDisplayFlights();
    }, 3600 * 1000);
});

function fetchAndDisplayFlights() {
    fetch('../../backend/data/live_feed.json')
      .then(response => response.json())
      .then(flights => {
        const randomFlights = getRandomFlights(flights, 18);
        const flightListContainer = document.getElementById('flight-list');
    
        if (flightListContainer) {
          flightListContainer.innerHTML = '';
          
          randomFlights.forEach(flight => {
            const flightElement = createFlightElement(flight);
            flightListContainer.appendChild(flightElement);
          });
  
          animateBoxes();
        } else {
          console.error('Flight list container not found in the DOM');
        }
      })
      .catch(error => {
        console.error('Error fetching flight data:', error);
      });
}

function getRandomFlights(flights, count) {
  const randomFlights = [];
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * flights.length);
    randomFlights.push(flights[randomIndex]);
  }
  return randomFlights;
}
  
function formatTime(dateString) {
  const date = new Date(dateString);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

function createFlightElement(flight) {
    const flightElement = document.createElement('div');
    flightElement.classList.add('box');
  
    const flightInfo = document.createElement('div');
    flightInfo.classList.add('flight-info', 'font-mono');
    flightInfo.innerHTML = `${flight.origin} <span class="text-gray-500 text-xl" style="font-size: 12px;">to</span> <span class="text-violet-700">${flight.destination}</span>`;
  
    const flightInfo1 = document.createElement('div');
    flightInfo1.classList.add('flight-info1', 'text-gray-500', 'font-mono');
    flightInfo1.innerHTML = `Out time: <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>${formatTime(flight.scheduled_out)}`;

    const flightInfo2 = document.createElement('div');
    flightInfo2.classList.add('flight-info2', 'text-gray-500', 'font-mono');
    flightInfo2.innerHTML = `Estimated off: ${formatTime(flight.estimated_off)}`;
    flightElement.appendChild(flightInfo);
    flightElement.appendChild(flightInfo1);
    flightElement.appendChild(flightInfo2);
  
    return flightElement;
}
  
function animateBoxes() {
  gsap.set(".box", {
    y: (i) => i * 110
  });

  gsap.to(".box", {
    duration: 12,
    ease: "none",
    y: "-=2000",
    modifiers: {
      y: gsap.utils.unitize(y => (1100 + parseFloat(y)) % 2000)
    },
    repeat: -1
  });
}
  
const overflow = document.querySelector("#overflow");
  
function applyOverflow() {
  if (overflow.checked) {
    gsap.set(".wrapper", { overflow: "visible" });
  } else {
    gsap.set(".wrapper", { overflow: "hidden" });
  }
}
