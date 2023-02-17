var listenForCoOrd = false;
var selectedLong = "";
var selectedLat = "";
function openForm() {
    document.getElementById("myForm").style.display = "block";
  }
  
  function closeForm() {
    document.getElementById("myForm").style.display = "none";
  }

  function submitUserInputDataPoint(){
    var title = document.getElementById("userInpTitle").value;
    var desc = document.getElementById("userInpDesc").value;
    if(title != "" && desc != "" && selectedLat != "" && selectedLong != ""){
        console.log("title entered");
        var geojson = {
            "type": "Feature",
            "properties": {
              "name": title,
              "description": desc,
              "timeCreated": Date.now()
            },
            "geometry": {
              "type": "Point",
              "coordinates": [selectedLong, selectedLat]
            }
          };
          console.log(geojson);
          //saveGeoJsonToFile(geojson);
          // The object is created here and is going to be saved to a local file for the time being.
    }
  }

  function saveGeoJsonToFile(obj){
    // Convert the GeoJSON data to a string
    let data = JSON.stringify(obj);

    // Request access to the file system
    window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;

    window.requestFileSystem(window.TEMPORARY, 1024 * 1024, function(fs) {
    // Create a new file
    fs.root.getFile("dataPoints.geojson", {create: true}, function(fileEntry) {
        // Create a FileWriter object
        fileEntry.createWriter(function(fileWriter) {
            // Write the data to the file
            let blob = new Blob([data], {type: 'application/json'});
            fileWriter.write(blob);
        }, errorHandler);
  }, errorHandler);
}, errorHandler);
}


  function errorHandler(error) {
    console.error(error);
  }
  function coOrdListener() { listenForCoOrd = !listenForCoOrd };
function initMap() {
    mapboxgl.accessToken =
      "pk.eyJ1IjoiaWRsZWdhbWVyIiwiYSI6ImNsNnc0MTNpaDA0dnUzY28xM2NpbWo5NGYifQ.2znpvwwQuZbRG9-uY5Nvhg";
        const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/idlegamer/cl3itqajn008k14rzzjfzcgrk",
      minZoom: 10,
      center: [0, 0],
      projection: "globe",
    });
  
    var geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
      showUserHeading: true,
    });

    
    map.addControl(geolocate);
    mapBounds = [[0, 0], [0.0]];
  
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
        var position = [lon, lat];
        mapBounds = [
          [lon - 0.0816020798784502, lat - 0.036346035512274],
          [lon + 0.0754066900138359, lat + 0.039394074799906],
        ];
        map.setMaxBounds(mapBounds);
      });
    } catch (e) {
      console.log(e);
    }
  
    map.on("load", () => {
      map.setFog({});
    });
    var url = 'dataPoints.geojson';
    map.on('load', () => {
        map.addSource('dataPoints', {
        type: 'geojson',
        data: url //"./dataPoints.json"
        });
         
        // map.addLayer({
        // 'id': 'dataPoint-layer',
        // 'type': 'circle',
        // 'source': 'dataPoints'
        // ,
        // 'paint': {
        // 'circle-radius': 4,
        // 'circle-stroke-width': 2,
        // 'circle-color': 'red',
        // 'circle-stroke-color': 'white'
        // }
        // });
        });
  }



  function myFunction() {
    var x = document.getElementById("myLinks");
    if (x.style.display === "block") {
      x.style.display = "none";
    } else {
      x.style.display = "block";
    }
  }  