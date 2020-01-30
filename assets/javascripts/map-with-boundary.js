d3.csv('/large-units/assets/data/temp-data.csv').then((response) => {
  let map = new mapboxgl.Map({
    container: 'map',
    zoom: 8,
    minZoom: 8,
    maxZoom: 13,
    center: [-70.986, 42.413],
    maxBounds: [
      [-72, 41.5], // Southwest bound
      [-70, 43], // Northeast bound
    ],
    style: "mapbox://styles/ihill/ck60ulxcv03621itc7x60pa9b/draft",
    accessToken: "pk.eyJ1IjoiaWhpbGwiLCJhIjoiY2plZzUwMTRzMW45NjJxb2R2Z2thOWF1YiJ9.szIAeMS4c9YTgNsJeG36gg",
    hash: true
  });

  const percentagesObj = {};
  const moeObj = {};
  response.forEach((row) => {
    percentagesObj[row.TractIDt] = row.pct3bd_est;
    moeObj[row.TractIDt] = row.pct3bd_moe;
  });

  map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

  map.on('load', () => {
    addLegend();
    const colors = d3.scaleQuantize()
      .domain([0,1])
      .range(['#111436', '#233069', '#3b66b0', '#0097c4']);
    const colorExpression = ['match', ['get', 'ct10_id']];
    const patternExpression = ['match', ['get', 'ct10_id']];
    response.forEach((row) => {
      colorExpression.push(row.TractIDt, +row.pct3bd_est <= 1 ? colors(+row.pct3bd_est) : '#B57F00')
      patternExpression.push(row.TractIDt, +row.pct3bd_moe >= .3 ? 'thin-line3' : 'blank')
    });
    colorExpression.push('#B57F00');
    patternExpression.push('blank')
    map.addLayer({
      id: 'tracts-choropleth',
      type: 'fill',
      source: 'composite',
      'source-layer': 'Tracts-2jsl06',
      paint: {
        'fill-color': colorExpression,
      },
    });

    map.addLayer({
      id: 'tracts-pattern',
      type: 'fill',
      source: 'composite',
      'source-layer': 'Tracts-2jsl06',
      paint: {
        'fill-pattern': patternExpression,
      },
    });
    map.moveLayer('tracts-choropleth', 'MAPC municipal borders');
    map.moveLayer('tracts-pattern', 'MAPC municipal borders');
    map.moveLayer('tracts-choropleth', 'Study Boundary')
  });


  map.on('click', 'MAPC tracts', (e) => {
    const clickedData = map.queryRenderedFeatures(
      [e.point.x, e.point.y],
      { layers: ['MAPC tracts', 'MAPC municipalities', 'tracts-choropleth'] },
    );
    const tractId = clickedData[0].properties.ct10_id;
    const percentageUnits = percentagesObj[tractId] <= 1 ? `${d3.format('.1%')(percentagesObj[tractId])}` : 'Data unavailable';
    
    const tooltipText = `<p class='tooltip__title'>Tract ${tractId} `
    + `(${clickedData[2].properties.municipal})</p>`
    + `<p class='tooltip__text'>${percentageUnits}</p>`;
    new mapboxgl.Popup()
      .setLngLat(e.lngLat)
      .setHTML(tooltipText)
      .addTo(map);
  });
});

function addLegend() {
  document.querySelector('.mapboxgl-ctrl-top-right').innerHTML = "<aside class='legend'>"
    + "<svg height='146' width='160'>"
    + "<rect width='16' height='16' x='8' y='8' style='fill:#111436; stroke: black; stroke-width: 1px;'></rect>"
    + "<text x='32' y='20' class='legend__label'>0%-25%</text>"
    + "<rect width='16' height='16' x='8' y='32' style='fill:#233069; stroke: black; stroke-width: 1px;'></rect>"
    + "<text x='32' y='44' class='legend__label'>26%-50%</text>"
    + "<rect width='16' height='16' x='8' y='56' style='fill:#3B66B0; stroke: black; stroke-width: 1px;'></rect>"
    + "<text x='32' y='70' class='legend__label'>51%-75%</text>"
    + "<rect width='16' height='16' x='8' y='80' style='fill:#0097C4; stroke: black; stroke-width: 1px;'></rect>"
    + "<text x='32' y='92' class='legend__label'>76%-100%</text>"
    + "<rect width='16' height='16' x='8' y='104' style='fill:#B57F00; stroke: black; stroke-width: 1px;'></rect>"
    + "<text x='32' y='116' class='legend__label'>Data unavailable</text>"
    + "<rect width='16' height='16' x='8' y='128' style='fill:#FFFFFF; stroke: black; stroke-width: 1px;'></rect>"
    + "<line x1='15' y1='144' x2='24' y2='135' style='stroke: black;'></line>"
    + "<line x1='8' y1='144' x2='24' y2='128' style='stroke: black;'></line>"
    + "<line x1='8' y1='137' x2='17' y2='128' style='stroke: black;'></line>"
    + "<text x='32' y='140' class='legend__label'>High margin of error</text>"
    + '</svg>'
    + '</aside>';

  document.querySelector('.mapboxgl-ctrl-top-left').innerHTML = "<h2 class='map__title'>Percent Family Sized Units</h2>";
}
