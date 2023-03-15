var listenForCoOrd = false;
var selectedLong = "";
var selectedLat = "";
var loadedMarkers = null;
var map;
function openForm() {
    document.getElementById("myForm").style.display = "block";
  }
  function closeForm() {
    document.getElementById("myForm").style.display = "none";
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
          loadedMarkers.push(geojson);
          console.log(loadedMarkers);
          console.log(geojson);
          // this is where it should add it to the map
          var popup = new mapboxgl.Popup({ offset: 25 }).setText(desc);
          // create DOM element for the marker
          var el = document.createElement('div');
          if(type == "1"){
            el.id = "markerFood";
          }
          if(type == "2"){
            el.id = "markerTraffic";
          }
          if(type == "3"){
            el.id = 'markerCrime';
          }
          var coords = [selectedLong, selectedLat];
          // create the marker
          
          new mapboxgl.Marker(el)
            .setLngLat(coords)
            .setPopup(popup)
            .addTo(map);
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
        mapBounds = [
          [lon - 0.0816020798784502, lat - 0.036346035512274], // SouthWest 
          [lon + 0.0754066900138359, lat + 0.039394074799906], // NorthEast
        ];
        //console.log(mapBounds);
        map.setMaxBounds(mapBounds);

        populateDataPoints(mapBounds[0][0], mapBounds[0][1], mapBounds[1][0], mapBounds[1][1]);
        let SWX = mapBounds[0][0];
        let SWY = mapBounds[0][1];
        let NEX = mapBounds[1][0];
        let NEY = mapBounds[1][1];
      });
    } catch (e) {
      console.log(e);
    }
    
    
  
    map.on("load", () => {
      map.setFog({});
    });
      
        

            
  }

  function populateDataPoints(SWX, SWY, NEX, NEY){
    fetch('https://raw.githubusercontent.com/DedicatedRam/WebAppDis/main/dataPoints.geojson')
        .then(response => response.json())
        .then(data => {
          loadedMarkers = data.features;
          loadedMarkers.forEach(e => {
            var coords = e.geometry.coordinates;

            // console.log("NE " + mapBounds[1]);
            // console.log("SW " + mapBounds[0]);
            // console.log(coords);
            console.log(SWX + " > " + coords[0] + " > " + NEX);
            // console.log(SWY + " < " + coords[1] + " < " + NEY);
            console.log((coords[0] > NEX));
            console.log((coords[0] < SWX));
            if (((coords[0] > SWX) && (coords[0] < NEX)) && ((coords[1] > SWY) && (coords[1] < NEY))){
            // create the popup
            const popup = new mapboxgl.Popup({ offset: 25 }).setText(e.properties.description);
            console.log("if met");
            let event = e.properties.type;
            // create DOM element for the marker
            const el = document.createElement('div');
            console.log(event);
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
            new mapboxgl.Marker(el)
            .setLngLat(coords)
            .setPopup(popup) // sets a popup on this marker
            .addTo(map);
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