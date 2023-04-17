var listenForCoOrd = false;
var selectedLong = "";
var selectedLat = "";
var loadedMarkers = null;
var currentMarkers = [];
var map;
var dayDataPointLimiter = false;
var geoLocateRun = false;
var mapBounds = [[0, 0], [0.0]];
var userLat;
var userLong;

function showForm() {
  if (geoLocateRun) {
    var form = document.getElementById("myForm");
    form.style.animationName = "slideUp";
  } else {
    alert(
      "You must allow the geolocator to run first. It is in the top right of the screen"
    );
  }
}

function hideForm() {
  var form = document.getElementById("myForm");
  form.style.animationName = "slideDown";
  form.style.bottom = "-100%"; // hide the form off screen
}

function showFAQForm() {
  var form = document.getElementById("faqForm");
  form.style.animationName = "slideUp";
}
function hideFAQForm() {
  var form = document.getElementById("faqForm");
  form.style.animationName = "slideDown";
  form.style.bottom = "-100%"; // hide the form off screen
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
  if (geoLocateRun) {
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
    }
  } else {
    alert("You must allow the geolocator access to use your location");
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
      data = JSON.parse(data);
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
        "<b>" +
          data.properties.name +
          "</b>" +
          "<br>" +
          data.properties.description +
          "<br>" +
          "Posted just now"
      );
      let event = data.properties.type;
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
      let tempMarker = new mapboxgl.Marker(el).setLngLat(data.geometry.coordinates).setPopup(popup).addTo(map);
      currentMarkers.push(tempMarker);
      console.log(tempMarker);
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
  hideForm();
}

const size = 200;

// This implements `StyleImageInterface`
// to draw a pulsing dot icon on the map.
const pulsingDot = {
  width: size,
  height: size,
  data: new Uint8Array(size * size * 4),

  // When the layer is added to the map,
  // get the rendering context for the map canvas.
  onAdd: function () {
    const canvas = document.createElement("canvas");
    canvas.width = this.width;
    canvas.height = this.height;
    this.context = canvas.getContext("2d");
  },

  // Call once before every frame where the icon will be used.
  render: function () {
    const duration = 1000;
    const t = (performance.now() % duration) / duration;

    const radius = (size / 2) * 0.3;
    const outerRadius = (size / 2) * 0.7 * t + radius;
    const context = this.context;

    // Draw the outer circle.
    context.clearRect(0, 0, this.width, this.height);
    context.beginPath();
    context.arc(this.width / 2, this.height / 2, outerRadius, 0, Math.PI * 2);
    context.fillStyle = `rgba(255, 200, 200, ${1 - t})`;
    context.fill();

    // Draw the inner circle.
    context.beginPath();
    context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2);
    context.fillStyle = "rgba(255, 100, 100, 1)";
    context.strokeStyle = "white";
    context.lineWidth = 2 + 4 * (1 - t);
    context.fill();
    context.stroke();

    // Update this image's data with data from the canvas.
    this.data = context.getImageData(0, 0, this.width, this.height).data;

    // Continuously repaint the map, resulting
    // in the smooth animation of the dot.
    map.triggerRepaint();

    // Return `true` to let the map know that the image was updated.
    return true;
  },
};

function addAnimatedLocToMap(la, lo) {
  map.addImage("pulsing-dot", pulsingDot, { pixelRatio: 2 });
  map.addSource("dot-point", {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [lo, la], // icon position [lng, lat]
          },
        },
      ],
    },
  });
  map.addLayer({
    id: "layer-with-pulsing-dot",
    type: "symbol",
    source: "dot-point",
    layout: {
      "icon-image": "pulsing-dot",
    },
  });
}

function initMap() {
  mapboxgl.accessToken =
    "pk.eyJ1IjoiaWRsZWdhbWVyIiwiYSI6ImNsNnc0MTNpaDA0dnUzY28xM2NpbWo5NGYifQ.2znpvwwQuZbRG9-uY5Nvhg";
  map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/idlegamer/cl3itqajn008k14rzzjfzcgrk",
    minZoom: 10,
    zoom: 12,
    center: [-1.4707048546857777, 53.38165168818108],
    projection: "globe",
  });
  mapBounds = [
    [
      -1.4707048546857777 - 0.0816020798784502,
      53.38165168818108 - 0.036346035512274,
    ], // SouthWest
    [
      -1.4707048546857777 + 0.0754066900138359,
      53.38165168818108 + 0.039394074799906,
    ], // NorthEast
  ];
  map.setMaxBounds(mapBounds);

  map.on("style.load", () => {
    const layers = map.getStyle().layers;
    const labelLayerId = layers.find(
      (layer) => layer.type === "symbol" && layer.layout["text-field"]
    ).id;

    navigator.geolocation.getCurrentPosition(
      function (position) {
        userLat = position.coords.latitude;
        userLong = position.coords.longitude;
        initSetUp(position.coords.latitude, position.coords.longitude);
      },
      function (error) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            console.log("User denied the request for Geolocation.");
            break;
          case error.POSITION_UNAVAILABLE:
            console.log("Location information is unavailable.");
            break;
          case error.TIMEOUT:
            console.log("The request to get user location timed out.");
            break;
          case error.UNKNOWN_ERROR:
            console.log("An unknown error occurred.");
            break;
        }
      }
    );

    map.addLayer(
      {
        id: "add-3d-buildings",
        source: "composite",
        "source-layer": "building",
        filter: ["==", "extrude", "true"],
        type: "fill-extrusion",
        minzoom: 10,
        paint: {
          "fill-extrusion-color": "#840032",

          "fill-extrusion-height": [
            "interpolate",
            ["linear"],
            ["zoom"],
            15,
            0,
            15.05,
            ["get", "height"],
          ],
          "fill-extrusion-base": [
            "interpolate",
            ["linear"],
            ["zoom"],
            15,
            0,
            15.05,
            ["get", "min_height"],
          ],
          "fill-extrusion-opacity": 1,
        },
      },
      labelLayerId
    );
  });


  

  map.on("click", (e) => {
    if (listenForCoOrd == true) {
      selectedLat = e.lngLat.lat;
      selectedLong = e.lngLat.lng;
      document.getElementById("longLabel").innerHTML =
        "Longitude: " + selectedLong;
      document.getElementById("latLabel").innerHTML =
        "Latitude: " + selectedLat;
      showForm();
      listenForCoOrd = false;
    }
  });
}

function initSetUp(lati, long) {
  try {
    addAnimatedLocToMap(lati, long);
    geoLocateRun = true;
    mapBounds = [
      [long - 0.0816020798784502, lati - 0.036346035512274], // SouthWest
      [long + 0.0754066900138359, lati + 0.039394074799906], // NorthEast
    ];
    map.setMaxBounds(mapBounds);

    setInterval(populateDataPoints(mapBounds[0][0],mapBounds[0][1],mapBounds[1][0],mapBounds[1][1]), 2000);
  } catch (e) {
    console.log(e);
  }
}

function show24HrPoints() {
  if (geoLocateRun) {
    if (dayDataPointLimiter == false) {
      dayDataPointLimiter = true;
    } else if (dayDataPointLimiter == true) {
      dayDataPointLimiter = false;
    }
    populateDataPoints(
      mapBounds[0][0],
      mapBounds[0][1],
      mapBounds[1][0],
      mapBounds[1][1]
    );
  } else {
    alert("You must first allow the geolocater to access your location.");
  }
}

function populateDataPoints(SWX, SWY, NEX, NEY) {
  populated = true;
  if (currentMarkers != null) {
    for (let index = 0; index < currentMarkers.length; index++) {
      currentMarkers[index].remove();
    }
    currentMarkers = [];
  }
  fetch("https://cas-4d0.pages.dev/getDataPoints", {
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

        var skipCondition = dayDataPointLimiter == true && hoursWhole > 24;
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
