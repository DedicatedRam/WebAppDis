function myFunction() {
    var x = document.getElementById("myLinks");
    if (x.style.display === "block") {
      x.style.display = "none";
    } else {
      x.style.display = "block";
    }
  }

  function initMap(){
    
    mapboxgl.accessToken = 'pk.eyJ1IjoiaWRsZWdhbWVyIiwiYSI6ImNsNnc0MTNpaDA0dnUzY28xM2NpbWo5NGYifQ.2znpvwwQuZbRG9-uY5Nvhg';
    const map = new mapboxgl.Map({
      container: 'map', 
      style: 'mapbox://styles/idlegamer/cl3itqajn008k14rzzjfzcgrk',
      minZoom:10,
      center: [0, 0],
      projection: 'globe'
    });

    var geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
      enableHighAccuracy: true},
      trackUserLocation: true,
      showUserHeading: true
    });

    map.on('click', (e) => {// gets current mouse pointer co ordinates for testing purposes
      console.log(e.lngLat.wrap());
    });

    map.addControl(geolocate);
    mapBounds = [[0,0],
                [0.0]
    ];

    try{
        geolocate.on('geolocate', function(e) {
        var lon = e.coords.longitude;
        var lat = e.coords.latitude;
        var position = [lon, lat];
        mapBounds = [[(lon-0.0816020798784502) , (lat-0.036346035512274)],[(lon +0.0754066900138359), (lat + 0.039394074799906)]];
        map.setMaxBounds(mapBounds);
    });


    }catch(e){
      console.log(e);
    }
    
    map.on('load', () => {
    map.setFog({});
    });

  }