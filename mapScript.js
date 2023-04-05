var listenForCoOrd = false;
var selectedLong = "";
var selectedLat = "";
var loadedMarkers = null;
var currentMarkers = [];
var map;
var dayDataPointLimiter = false;
var geoLocateRun = false;
var mapBounds = [[0, 0], [0.0]];


function showForm() {
  var form = document.getElementById("myForm");
  form.style.animationName = "slideUp";
}

function hideForm() {
  var form = document.getElementById("myForm");
  form.style.animationName = "slideDown";
  form.style.bottom = "-100%"; // hide the form off screen
}



function openForm() {
  document.getElementById("myForm").style.display = "block";
}
function closeForm() {
  document.getElementById("myForm").style.display = "none";
}
function devToolsOpen() {
  document.getElementById("devForm").style.display = "block";
}
function devToolsClose() {
  document.getElementById("devForm").style.display = "none";
}


function menuOnClick() {
  document.getElementById("menu-bar").classList.toggle("change");
  document.getElementById("nav").classList.toggle("change");
  document.getElementById("menu-bg").classList.toggle("change-bg");
}


function submitUserInputDataPoint() {
  var title = document.getElementById("userInpTitle").value;
  var desc = document.getElementById("userInpDesc").value;
  var type = document.getElementById("eventsType").value;
  if (
    title == "" ||
    desc == "" ||
    selectedLat == "" ||
    selectedLong == "" ||
    type == "dft"
  ) {
    alert("You must enter values to be submitted");
  }
  if (
    title != "" &&
    desc != "" &&
    selectedLat != "" &&
    selectedLong != "" &&
    type != "dft"
  ) {
    var geojson = {
      type: "Feature",
      properties: {
        name: title,
        description: desc,
        timeCreated: Date.now(),
        type: type,
      },
      geometry: {
        type: "Point",
        coordinates: [selectedLong, selectedLat],
      },
    };

    postJSON(JSON.stringify(geojson));
    loadedMarkers.push(geojson);
  }
}

async function postJSON(data) {
  try {
    const response = await fetch("https://cas-4d0.pages.dev/putDataPoint", {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.text();
    if (response.status == 201) {
      populateDataPoints(
        mapBounds[0][0],
        mapBounds[0][1],
        mapBounds[1][0],
        mapBounds[1][1]
      );
      document.getElementById("userInpTitle").value = "";
      document.getElementById("userInpDesc").value = "";
      document.getElementById("eventsType").value = "dft";
      document.getElementById("latLabel").innerHTML = "Latitude: ";
      document.getElementById("longLabel").innerHTML = "Longitude: ";
      alert("Added Successfully");
    } else {
      new Error(response);
      console.log(response);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

function errorHandler(error) {
  console.error(error);
}
function coOrdListener() {
  listenForCoOrd = !listenForCoOrd;
}

function initMap() {
  mapboxgl.accessToken =
    "pk.eyJ1IjoiaWRsZWdhbWVyIiwiYSI6ImNsNnc0MTNpaDA0dnUzY28xM2NpbWo5NGYifQ.2znpvwwQuZbRG9-uY5Nvhg";
  map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/idlegamer/cl3itqajn008k14rzzjfzcgrk",
    minZoom: 10,
    center: [-1.4707048546857777, 53.38165168818108],
    projection: "globe",
  });
  mapBounds = [
    [-1.4707048546857777 - 0.0816020798784502, 53.38165168818108 - 0.036346035512274], // SouthWest
    [-1.4707048546857777 + 0.0754066900138359, 53.38165168818108 + 0.039394074799906], // NorthEast
  ];
  map.setMaxBounds(mapBounds);


  map.on('style.load', () => {
    const layers = map.getStyle().layers;
    const labelLayerId = layers.find(
    (layer) => layer.type === 'symbol' && layer.layout['text-field']
    ).id;
     
    map.addLayer(
    {
    'id': 'add-3d-buildings',
    'source': 'composite',
    'source-layer': 'building',
    'filter': ['==', 'extrude', 'true'],
    'type': 'fill-extrusion',
    'minzoom': 10,
    'paint': {
    'fill-extrusion-color': '#840032',
     
    'fill-extrusion-height': [
    'interpolate',
    ['linear'],
    ['zoom'],
    15,
    0,
    15.05,
    ['get', 'height']
    ],
    'fill-extrusion-base': [
    'interpolate',
    ['linear'],
    ['zoom'],
    15,
    0,
    15.05,
    ['get', 'min_height']
    ],
    'fill-extrusion-opacity': 1
    }
    },
    labelLayerId
    );
    });

  var geolocate = new mapboxgl.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: false,
    },
    trackUserLocation: true,
    showUserHeading: true,
  });

  map.addControl(geolocate);

  map.on("click", (e) => {
    // gets current mouse pointer co ordinates for testing purposes

    if (listenForCoOrd == false) {
      console.log(e.lngLat.wrap());
    }
    if (listenForCoOrd == true) {
      selectedLat = e.lngLat.lat;
      selectedLong = e.lngLat.lng;
      document.getElementById("longLabel").innerHTML =
        "Longitude: " + selectedLong;
      document.getElementById("latLabel").innerHTML =
        "Latitude: " + selectedLat;
    }
  });
  try {
    geolocate.on("geolocate", function (e) {
      geoLocateRun = true;
      var lon = e.coords.longitude;
      var lat = e.coords.latitude;
      mapBounds = [
        [lon - 0.0816020798784502, lat - 0.036346035512274], // SouthWest
        [lon + 0.0754066900138359, lat + 0.039394074799906], // NorthEast
      ];
      map.setMaxBounds(mapBounds);

      populateDataPoints(
        mapBounds[0][0],
        mapBounds[0][1],
        mapBounds[1][0],
        mapBounds[1][1]
      );
    });
  } catch (e) {
    console.log(e);
  }
}

function show24HrPoints(){
  if(geoLocateRun){
  if(dayDataPointLimiter == false){dayDataPointLimiter = true}
  else if(dayDataPointLimiter == true){dayDataPointLimiter = false};
  populateDataPoints(
    mapBounds[0][0],
    mapBounds[0][1],
    mapBounds[1][0],
    mapBounds[1][1]
  );
  }
  else{
    alert("You must first allow the geolocater to access your location.")
  }
}

function populateDataPoints(SWX, SWY, NEX, NEY) {
  populated = true;
  if (currentMarkers != null) {
    for (let index = 0; index < currentMarkers.length; index++) {
      currentMarkers[index].remove();
    }
  }
  fetch("https://cas-4d0.pages.dev/getDataPoints", {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
    "Access-Control-Max-Age": "86400",
  })
    .then((response) => response.json())
    .then((data) => {
      loadedMarkers = data;
      loadedMarkers.forEach((e) => {
        var elapsedMinutes = Math.round(
          (Date.now() - e.properties.timeCreated) / (1000 * 60)
        );
        var elapsedHours = elapsedMinutes / 60;
        var hoursWhole = Math.floor(elapsedHours);
        var minDif = elapsedMinutes - hoursWhole * 60;
        var coords = e.geometry.coordinates;

        var skipCondition = (dayDataPointLimiter == true) && (hoursWhole > 24);
        if (!skipCondition) {
          if (
            coords[0] > SWX &&
            coords[0] < NEX &&
            coords[1] > SWY &&
            coords[1] < NEY
          ) {
            // create the popup
            const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
              "<b>" +
                e.properties.name +
                "</b>" +
                "<br>" +
                e.properties.description +
                "<br>" +
                hoursWhole +
                " hours and " +
                minDif +
                " minutes ago"
            );
            let event = e.properties.type;
            // create DOM element for the marker
            const el = document.createElement("div");
            if (event == "1") {
              el.id = "markerFood";
            }
            if (event == "2") {
              el.id = "markerTraffic";
            }
            if (event == "3") {
              el.id = "markerCrime";
            }
            if (event == "4") {
              el.id = "markerSocial";
            }
            if (event == "5") {
              el.id = "markerSport";
            }

            // create the marker
            let tempMarker = new mapboxgl.Marker(el)
              .setLngLat(coords)
              .setPopup(popup) // sets a popup on this marker
              .addTo(map);
            currentMarkers.push(tempMarker);
          }
        }
      });
    })
    .catch((error) => console.error(error));
}
