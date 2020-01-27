fetch("https://prql.mapc.org/?query=%20select%20*%20from%20tabular.b25031_median_rent_by_bedrooms_acs_ct%20WHERE%20acs_year=%272012-16%27%20order%20by%20acs_year%20DESC%20LIMIT%2015000;%20&token=16a2637ee33572e46f5609a578b035dc").then((response) => response.json())
.then((response) => {
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
  
  map.on('load', function() {
    let expression = ['match', ['get', 'ct10_id']]
    response.rows.forEach((row) => {
      expression.push(row['ct10_id'], `rgba(255,255,${Math.round((row.rent3br / 3501) * 255)},1)`)
    })

    expression.push('red')
    map.addLayer({
      'id': 'tracts-choropleth',
      'type': 'fill',
      'source': 'composite',
      'source-layer': 'Tracts-2jsl06',
      'paint': {
        'fill-color': expression
      }
    })
    console.log(map.getStyle().layers)
    map.moveLayer("tracts-choropleth", "muni-polygons")
  })
})



// // map.setLayoutProperty('Census Municipalities', 'visibility', 'none');
// map.on('click', 'Blocks', function(e) {
//   if (map.getLayoutProperty('Blocks', 'visibility') === 'visible') {
//     const population = d3.format(",")(e.features[0].properties.pop_copy)
//     const tooltipText = `<h3 class='tooltip__title'>Block ID ${e.features[0].properties.GEOID10}</h3><p class='tooltip__body'>Population: ${population}</p>`
//     new mapboxgl.Popup()
//     .setLngLat(e.lngLat)
//     .setHTML(tooltipText)
//     .addTo(map);
//   }
// })



function createLegend() {
  const legendSvg = d3.select('.legend__scale')
  const defs = legendSvg.append("defs");
  const linearGradient = defs.append("linearGradient")
  .attr("id", "linear-gradient");
  
  linearGradient
  .attr("x1", "0%")
  .attr("y1", "0%")
  .attr("x2", "100%")
  .attr("y2", "0%");

  linearGradient.append("stop")
  .attr("offset", "0%")
  .attr("stop-color", "#9ffea2");
  
  linearGradient.append("stop")
  .attr("offset", "100%")
  .attr("stop-color", "#058009");
  
  legendSvg.append("rect")
  .attr("width", 300)
  .attr("height", 32)
  .attr("transform", "translate(0, 24)")
  .style("fill", "url(#linear-gradient)")
  
  legendSvg.append('text')
  .attr("class", "legend__min")
  .text(0)
  .attr("transform", "translate(0,16)")

  legendSvg.append('text')
  .attr("class", "legend__max")
}