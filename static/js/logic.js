// URL to earthquake json data
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson";

// preview data on console.
//d3.json(queryUrl, data => console.log(data))

// Create function that determines marker size, magnitude * 3
function markerSize(magnitude) {
    return magnitude * 2;
}

//Create function that determines colour according to the size of magnitude
function markerColor(magnitude) {
  if (magnitude > 6) {
    return 'red'
  } else if (magnitude > 5) {
    return 'orange'
  } else {
    return 'yellow'
  }
}

//Create function that determines the Opacity according to the magnitude
function markerOpacity(magnitude) {
  if (magnitude > 6) {
    return .80
  } else if (magnitude > 5) {
    return .60
  } else {
    return .40
  }
}

// GET request, and function to handle returned JSON data
d3.json(queryUrl, function(data) {
  
  var earthquakes = L.geoJSON(data.features, {
    onEachFeature : addPopup,
    pointToLayer: addMarker
  });

// call function to create map
  createMap(earthquakes);

});
// reference markerSize, markerOpacity, and markerColor
function addMarker(feature, location) {
  var markerCharacteristics = {
    fill: markerOpacity(feature.properties.mag),
    color: markerColor(feature.properties.mag),
    fillColor: markerColor(feature.properties.mag),
    radius: markerSize(feature.properties.mag)
  }
  return L.circleMarker(location, markerCharacteristics);
}

//Create and Define function for each array in features
function addPopup(feature, layer) {
  // Create a popup of earthquake time and placefor each feature.
  return layer.bindPopup(`<h3> ${feature.properties.place} </h3> <hr> <h4>Magnitude: ${feature.properties.mag} </h4> <p> ${Date(feature.properties.time)} </p>`);
}

// Create function for marker's layer and plot them on a map.

function createMap(earthquakes) {
  // Define streetmap
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  })
  
  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [38.9637, 35.2433],
    zoom: 2,
    layers: [streetmap, earthquakes]
  });

  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  // creating the legend
  var legend = L.control({position: 'bottomright'});

  // add legend to map
  legend.onAdd = function () {
      
      var div = L.DomUtil.create('div', 'info legend')    
      div.innerHTML = "<h3>Earthquakes over 4.5 Magnitude during the past 7 days.</h3><table><tr><th>> 6</th><td>Red</td></tr><tr><th>> 5</th><td>Orange</td></tr><tr><th>>= 4.5</th><td>Yellow</td></tr><tr><th>"

      return div;
  };
      
  legend.addTo(myMap);
}