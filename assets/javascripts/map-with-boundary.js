d3.csv('/large-units/assets/data/temp-data.csv').then((response) => {
  console.log(response)
  let map = new mapboxgl.Map({
    container: 'map',
    zoom: 6,
    minZoom: 6,
    maxZoom: 13,
    center: [-71.116, 42.364],
    maxBounds: [
      [-71.7, 41.99], // Southwest bound
      [-70.58, 42.76] // Northeast bound
    ],
    style: "mapbox://styles/ihill/ck5wsypg60h5s1iog6tobsy0z/draft",
    accessToken: "pk.eyJ1IjoiaWhpbGwiLCJhIjoiY2plZzUwMTRzMW45NjJxb2R2Z2thOWF1YiJ9.szIAeMS4c9YTgNsJeG36gg",
    hash: true
  });

  const percentagesObj = {};
  const moeObj = {};
  response.forEach((row) => {
    percentagesObj[row.TractIDt] = row.pct3bd_est
    moeObj[row.TractIDt] = row.pct3bd_moe
  })

  map.on('load', function() {    
    const colors = d3.scaleSequential()
    .interpolator(d3.interpolateBlues)
    .domain([0,1]);

    const colorExpression = ['match', ['get', 'ct10_id']]
    response.forEach((row) => { 
      return colorExpression.push(row['TractIDt'], +row.pct3bd_est <= 1 ? colors(+row.pct3bd_est) : "rgba(0,0,0,1)")
    })
    
    colorExpression.push('rgba(0,0,0,0)')
    map.addLayer({
      'id': 'tracts-choropleth',
      'type': 'fill',
      'source': 'composite',
      'source-layer': 'Tracts-2jsl06',
      'paint': {
        'fill-color': colorExpression
      }
    })
    map.moveLayer("tracts-choropleth", "muni-polygons")
    })

  
  map.on('click', function(e) {
    const clickedData = map.queryRenderedFeatures(
      [e.point.x,e.point.y],
      { layers: ['muni-polygons', 'tracts', 'tracts-choropleth'] }
    )
    const tractId = clickedData[0].properties.ct10_id;
    const municipality = clickedData[1].properties.municipal
    const value = percentagesObj[tractId] <= 1 ? `${d3.format(".1%")(percentagesObj[tractId])} family-sized units` : "Data unavailable"
    const marginOfError = moeObj[tractId]
  
    const tooltipText = `<p class='tooltip__title'>Tract ${tractId} `
    + `(${municipality})</p>`
    + `<span class='tooltip__text'>${value} (+/- ${marginOfError})</p>`
    new mapboxgl.Popup()
      .setLngLat(e.lngLat)
      .setHTML(tooltipText)
      .addTo(map);
  })
})