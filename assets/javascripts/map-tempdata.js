d3.csv('/large-units/assets/data/temp-data.csv').then((response) => {
  const map = new mapboxgl.Map({
    container: 'map',
    zoom: 8,
    minZoom: 8,
    maxZoom: 13,
    center: [-71.008, 42.376],
    maxBounds: [
      [-72, 41.5], // Southwest bound
      [-70, 43], // Northeast bound
    ],
    style: 'mapbox://styles/ihill/ck5sc5wql2ezb1imqyu8a1miu/draft',
    accessToken: 'pk.eyJ1IjoiaWhpbGwiLCJhIjoiY2plZzUwMTRzMW45NjJxb2R2Z2thOWF1YiJ9.szIAeMS4c9YTgNsJeG36gg',
    hash: true,
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
      patternExpression.push(row.TractIDt, +row.pct3bd_moe >= .3 ? 'thin-line3' : 'hatch')
    });
    colorExpression.push('#B57F00');
    patternExpression.push('hatch')
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
  });


  map.on('click', 'MAPC tracts', (e) => {
    const clickedData = map.queryRenderedFeatures(
      [e.point.x, e.point.y],
      { layers: ['MAPC tracts', 'MAPC municipalities', 'tracts-choropleth'] },
    );

    const tractId = clickedData[0].properties.ct10_id;
    const municipality = clickedData[2].properties.municipal;
    const value = percentagesObj[tractId] <= 1 ? `${d3.format('.1%')(percentagesObj[tractId])}` : 'Data unavailable';
    const marginOfError = percentagesObj[tractId] < 999 ? `(+/- ${d3.format('.1%')(moeObj[tractId])})` : '';

    const tooltipText = `<p class='tooltip__title'>Tract ${tractId} `
    + `(${municipality})</p>`
    + `<span class='tooltip__text'>${value} ${marginOfError}</p>`;
    new mapboxgl.Popup()
      .setLngLat(e.lngLat)
      .setHTML(tooltipText)
      .addTo(map);
  });
});

function addLegend() {
  document.querySelector('.mapboxgl-ctrl-top-right').innerHTML = "<aside class='legend'>"
    + "<svg height='124' width='136'>"
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
    + '</svg>'
    + '</aside>';

  document.querySelector('.mapboxgl-ctrl-top-left').innerHTML = "<h2 class='map__title'>Percent Family Sized Units</h2>";
}
