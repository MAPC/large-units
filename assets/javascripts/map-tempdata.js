d3.csv('/large-units/assets/data/temp-data.csv').then((response) => {
  console.log(response)
  let map = new mapboxgl.Map({
    container: 'map',
    zoom: 8,
    minZoom: 8,
    maxZoom: 13,
    center: [-71.116, 42.364],
    maxBounds: [
      [-71.665, 41.95], // Southwest bound
      [-70.567, 42.87] // Northeast bound
    ],
    style: "mapbox://styles/ihill/ck5sc5wql2ezb1imqyu8a1miu/draft",
    accessToken: "pk.eyJ1IjoiaWhpbGwiLCJhIjoiY2plZzUwMTRzMW45NjJxb2R2Z2thOWF1YiJ9.szIAeMS4c9YTgNsJeG36gg",
    hash: true
  });

  const percentagesObj = {};
  response.forEach((row) => {
    percentagesObj[row.TractIDt] = row.pct3bd_est
  })

  map.on('load', function() {    
    const colors = d3.scaleSequential()
    .interpolator(d3.interpolateYlOrRd)
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
    const value = percentagesObj[tractId] <= 1 ? percentagesObj[tractId] : "NA"
  
    const tooltipText = `<p><span class='tooltip__text'>Tract ${tractId}</span>`
    + `<span class='tooltip__text'> (${municipality})</span></p>`
    + `<span class='tooltip__text'> (${value} (percentages))</span></p>`
    new mapboxgl.Popup()
      .setLngLat(e.lngLat)
      .setHTML(tooltipText)
      .addTo(map);
  })
})
