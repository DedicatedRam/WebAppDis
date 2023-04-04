var listenForCoOrd = false;
var selectedLong = "";
var selectedLat = "";
var loadedMarkers = null;
var currentMarkers = [];
var map;
var dayDataPointLimiter = false;
var mapBounds = [[0, 0], [0.0]];
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



  function submitUserInputDataPoint(){
    var title = document.getElementById("userInpTitle").value;
    var desc = document.getElementById("userInpDesc").value;
    var type = document.getElementById("eventsType").value;
    if(title == "" || desc == "" || selectedLat == "" || selectedLong == "" || type == "dft"){
      alert("You must enter values to be submitted");
    }
    if(title != "" && desc != "" && selectedLat != "" && selectedLong != "" && type != "dft"){
        var geojson = {
            "type": "Feature",
            "properties": {
              "name": title,
              "description": desc,
              "timeCreated": Date.now(),
              "type": type
            },
            "geometry": {
              "type": "Point",
              "coordinates": [selectedLong, selectedLat]
            }
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

    const result = await response.json();
    if(response.status == 201){
      console.log("Success:", result);
      populateDataPoints(mapBounds[0][0], mapBounds[0][1], mapBounds[1][0], mapBounds[1][1]);
      document.getElementById("userInpTitle").value = "";
      document.getElementById("userInpDesc").value = "";
      document.getElementById("eventsType").value = "dft";
      console.log("suc hit");
    }
    else{
      new Error(response);
      console.log(response);
    }
    console.log(response);
    
  } catch (error) {
    console.error("Error:", error);
  }
}



  function errorHandler(error) {
    console.error(error);
  }
  function coOrdListener() { listenForCoOrd = !listenForCoOrd };


function initMap() {
    mapboxgl.accessToken =
      "pk.eyJ1IjoiaWRsZWdhbWVyIiwiYSI6ImNsNnc0MTNpaDA0dnUzY28xM2NpbWo5NGYifQ.2znpvwwQuZbRG9-uY5Nvhg";
        map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/idlegamer/cl3itqajn008k14rzzjfzcgrk",
      minZoom: 10,
      center: [0, 0],
      projection: "globe",
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
        
        if(listenForCoOrd == false){
            console.log(e.lngLat.wrap());
        }
        if(listenForCoOrd == true){
           selectedLat = e.lngLat.lat;
           selectedLong = e.lngLat.lng;
           document.getElementById("longLabel").innerHTML = 'Longitude: ' + selectedLong;
           document.getElementById("latLabel").innerHTML = 'Latitude: ' + selectedLat;
        }
      });
    try {
      geolocate.on("geolocate", function (e) {
        
        var lon = e.coords.longitude;
        var lat = e.coords.latitude;
        mapBounds = [
          [lon - 0.0816020798784502, lat - 0.036346035512274], // SouthWest 
          [lon + 0.0754066900138359, lat + 0.039394074799906], // NorthEast
        ];
        map.setMaxBounds(mapBounds);
        
        populateDataPoints(mapBounds[0][0], mapBounds[0][1], mapBounds[1][0], mapBounds[1][1]);
      });
    } catch (e) {
      console.log(e);
    }
    
    
  
    map.on("load", () => {
      map.setFog({});
    });
      
        

            
  }

  function populateDataPoints(SWX, SWY, NEX, NEY){
    populated = true;
    if (currentMarkers !=null){
      for (let index = 0; index < currentMarkers.length; index++) {
        currentMarkers[index].remove();
      }
    }
    fetch('https://cas-4d0.pages.dev/getDataPoints', 
    {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
      "Access-Control-Max-Age": "86400",
    })
        .then(response => response.json())
        .then(data => {
          loadedMarkers = data;
          loadedMarkers.forEach(e => {
            var elapsedMinutes = Math.round((Date.now() - e.properties.timeCreated)/(1000*60));
            var elapsedHours = elapsedMinutes/60;
            var hoursWhole = Math.floor(elapsedHours);
            var minDif = elapsedMinutes - (hoursWhole *60);
            
            var coords = e.geometry.coordinates;
            if (((coords[0] > SWX) && (coords[0] < NEX)) && ((coords[1] > SWY) && (coords[1] < NEY))){
            // create the popup
            const popup = new mapboxgl.Popup({ offset: 25 })
            .setHTML('<b>' + e.properties.name+ '</b>' +
             '<br>' + 
             e.properties.description +
             '<br>' +
             hoursWhole + " hours and " + minDif + " minutes ago");
            let event = e.properties.type;
            // create DOM element for the marker
            const el = document.createElement('div');
            if (event =="1"){
              el.id = "markerFood";
            }
            if(event == "2"){
              el.id = "markerTraffic";
            }
            if(event == "3"){
              el.id = "markerCrime";
            }
    
            // create the marker
            let tempMarker = new mapboxgl.Marker(el).setLngLat(coords).setPopup(popup) // sets a popup on this marker
            .addTo(map);
            currentMarkers.push(tempMarker);
          
          }

        });

        })
        .catch(error => console.error(error));
      
  }

  function myFunction() {
    var x = document.getElementById("myLinks");
    if (x.style.display === "block") {
      x.style.display = "none";
    } else {
      x.style.display = "block";
    }
  }  