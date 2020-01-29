d3.csv('/large-units/assets/data/temp-data.csv').then((response) => {
  console.log(response)
  let map = new mapboxgl.Map({
    container: 'map',
    zoom: 8,
    minZoom: 8,
    maxZoom: 13,
    center: [-71.008, 42.376],
    maxBounds: [
      [-72, 41.5], // Southwest bound
      [-70, 43] // Northeast bound
    ],
    style: "mapbox://styles/ihill/ck5sc5wql2ezb1imqyu8a1miu/draft",
    accessToken: "pk.eyJ1IjoiaWhpbGwiLCJhIjoiY2plZzUwMTRzMW45NjJxb2R2Z2thOWF1YiJ9.szIAeMS4c9YTgNsJeG36gg",
    hash: true
  });

  const percentagesObj = {};
  const moeObj = {};
  response.forEach((row) => {
    percentagesObj[row.TractIDt] = row.pct3bd_est
    moeObj[row.TractIDt] = row.pct3bd_moe
  })

  map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

  map.on('load', function() {  
    addLegend()  
    const colors = d3.scaleOrdinal()
      // .domain([0,1])
      .domain([[0,.11],[.12,.45],[.46,.78],[.79,1]])
      .range(['#8ACCFF', '#0063E6', '#00256E', '#000000'])


    const colorExpression = ['match', ['get', 'ct10_id']]
    response.forEach((row) => { 
      return colorExpression.push(row['TractIDt'], +row.pct3bd_est <= 1 ? colors(+row.pct3bd_est) : "#EFEFEF")
    })
    
    colorExpression.push('#EFEFEF')
    map.addLayer({
      'id': 'tracts-choropleth',
      'type': 'fill',
      'source': 'composite',
      'source-layer': 'Tracts-2jsl06',
      'paint': {
        'fill-color': colorExpression
      }
    })
    map.moveLayer("tracts-choropleth", "MAPC municipal borders")
    })

  
  map.on('click', 'MAPC tracts', function(e) {
    const clickedData = map.queryRenderedFeatures(
      [e.point.x,e.point.y],
      { layers: ['MAPC municipalities', 'MAPC tracts', 'tracts-choropleth'] }
    )
    const tractId = clickedData[0].properties.ct10_id;
    const municipality = clickedData[1].properties.municipal
    const value = percentagesObj[tractId] <= 1 ? `${d3.format(".1%")(percentagesObj[tractId])} family-sized units` : "Data unavailable"
    const marginOfError = percentagesObj[tractId] < 999 ? `(+/- ${d3.format(".1%")(moeObj[tractId])})` : ``
  
    const tooltipText = `<p class='tooltip__title'>Tract ${tractId} `
    + `(${municipality})</p>`
    + `<span class='tooltip__text'>${value} ${marginOfError}</p>`
    new mapboxgl.Popup()
      .setLngLat(e.lngLat)
      .setHTML(tooltipText)
      .addTo(map);
  })
})

function addLegend() {
  // ['#F2F5FF','#8ACCFF', '#0063E6', '#00256E', '#000000']
  document.querySelector(".mapboxgl-ctrl-top-right").innerHTML = "<aside class='legend'>"
    + "<svg height='124' width='136'>"
    + "<rect width='16' height='16' x='8' y='8' style='fill:#8ACCFF; stroke: black; stroke-width: 1px;'></rect>"
    + "<text x='32' y='20' class='legend__label'>00.0%-00.0%</text>"
    + "<rect width='16' height='16' x='8' y='32' style='fill:#0063E6; stroke: black; stroke-width: 1px;'></rect>"
    + "<text x='32' y='44' class='legend__label'>00.0%-00.0%</text>"
    + "<rect width='16' height='16' x='8' y='56' style='fill:#00256E; stroke: black; stroke-width: 1px;'></rect>"
    + "<text x='32' y='70' class='legend__label'>00.0%-00.0%</text>"
    + "<rect width='16' height='16' x='8' y='80' style='fill:#000000; stroke: black; stroke-width: 1px;'></rect>"
    + "<text x='32' y='92' class='legend__label'>00.0%-00.0%</text>"
    + "<rect width='16' height='16' x='8' y='104' style='fill:#EFEFEF; stroke: black; stroke-width: 1px;'></rect>"
    + "<text x='32' y='116' class='legend__label'>Data unavailable</text>"
    + "</svg>"
    + "</aside>";

  document.querySelector(".mapboxgl-ctrl-top-left").innerHTML = "<h2 class='map__title'>Percent Family Sized Units</h2>"
}