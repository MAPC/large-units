d3.csv('/large-units/assets/data/largeunits-hhtype.csv').then((rawData) => {
  const headers = Object.keys(rawData[0]).slice(1);
  const totals = rawData.map((item) => Object.values(item).slice(1)
    .reduce((accumulator, currentValue) => parseInt(accumulator) + parseInt(currentValue)));
  const seriesGen = d3.stack().keys(headers);
  const formattedData = seriesGen(rawData.map((item, i) => ({
    type: item.type,
    onePerson: +item.onePerson / totals[i],
    twoPeopleNc: +item.twoPeopleNc / totals[i],
    threePeopleNc: +item.threePeopleNc / totals[i],
    householdWc: +item.householdWc / totals[i],
  })));

  const colors = ['#D59C29', '#3B66B0', '#233069', '#111436'];

  const margin = {
    top: 80, right: 0, bottom: 20, left: 40,
  };
  const width = 700;
  const canvasHeight = 420;
  const graphHeight = canvasHeight - margin.top - margin.bottom;

  const svg = d3.select('.largeunits_hhtype-frame')
    .attr('width', width)
    .attr('height', canvasHeight);

  const titles = svg.append('g')
    .attr('class', 'header');

  titles.append('text')
    .attr('x', '50%')
    .attr('y', '24')
    .attr('text-anchor', 'middle')
    .attr('class', 'graph__title')
    .text('Large Units by Household Type');

  titles.append('text')
    .attr('x', '50%')
    .attr('y', '44')
    .attr('text-anchor', 'middle')
    .attr('class', 'graph__subtitle')
    .text('Study Area, 2012–2016');

  const graph = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`)
    .attr('class', 'graph')
    .attr('height', graphHeight);

  const xScale = d3.scaleBand()
    .range([0, width - margin.right])
    .domain(rawData.map((d) => d.type))
    .round(true)
    .padding(0.5);

  const yScale = d3.scaleLinear()
    .range([graphHeight - margin.bottom, 0])
    .domain([0, 1]);

  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale)
    .ticks(10, '~%');

  graph.append('g')
    .call(xAxis)
    .attr('transform', `translate(0,${graphHeight - margin.bottom})`);


  graph.selectAll('text')
    .attr('class', 'xaxis__label');

  graph.append('g')
    .call(yAxis)
    .selectAll('g')
    .attr('class', 'yaxis__label');

  graph.selectAll('g.household-type')
    .data(formattedData)
    .enter().append('g')
    .attr('class', 'household-type')
    .style('fill', (d, i) => colors[i])
    .selectAll('rect')
    .data((d) => d)
    .enter()
    .append('rect')
    .attr('x', (d) => xScale(d.data.type))
    .attr('y', (d) => yScale(d[1]))
    .attr('height', (d) => Math.abs(yScale(d[1]) - yScale(d[0])))
    .attr('width', xScale.bandwidth())
    .on('mousemove', (d) => {
      tooltip.html(displayToolTip(d.data, colors));
      tooltip.attr('width', '200');
      tooltip.attr('height', '200');
      tooltip.style('display', null)
        .style('left', tooltipLeft(d3.event, document.getElementsByClassName('tooltip')[0]))
        .style('top', tooltipTop(d3.event, document.getElementsByClassName('tooltip')[0]));
    })
    .on('mouseleave', (d) => { tooltip.style('display', 'none'); });

  const tooltip = d3.select('body').append('div')
    .attr('class', 'tooltip')
    .style('display', 'none');

  tooltip.append('rect')
    .attr('width', 50)
    .attr('height', 50)
    .attr('fill', 'white')
    .style('opacity', 0.5);

  tooltip.append('text')
    .attr('x', 15)
    .attr('dy', '1.2em')
    .style('text-anchor', 'middle')
    .attr('font-size', '12px')
    .attr('font-weight', 'bold');

  addLegend(canvasHeight, colors);
});

function tooltipLeft(event, tooltip) {
  if (event.pageX > 450) {
    return `${event.pageX - tooltip.offsetWidth - 10}px`;
  }
  return `${event.pageX + 10}px`;
}

function tooltipTop(event, tooltip) {
  if (event.pageY > 250) {
    return `${event.pageY - tooltip.offsetHeight - 10}px`;
  }
  return `${event.pageY + 10}px`;
}

function displayToolTip(data, colors) {
  return `<h4 class='tooltip__title'>${data.type}</h4>`
  + '<p class=\'tooltip__text\'>'
  + `<svg width='16' height='10'><circle cx='5' cy='5' r='5' fill='${colors[3]}'/></svg>${
    d3.format('.0%')(data.onePerson)} 1 Person</p>`
  + '<p class=\'tooltip__text\'>'
  + `<svg width='16' height='10'><circle cx='5' cy='5' r='5' fill='${colors[2]}'/></svg>${
    d3.format('.0%')(data.twoPeopleNc)} 2 People, No Children</p>`
  + '<p class=\'tooltip__text\'>'
  + `<svg width='16' height='10'><circle cx='5' cy='5' r='5' fill='${colors[1]}'/></svg>${
    d3.format('.0%')(data.threePeopleNc)} 3+ People, No Children</p>`
  + '<p class=\'tooltip__text\'>'
  + `<svg width='16' height='10'><circle cx='5' cy='5' r='5' fill='${colors[0]}'/></svg>${
    d3.format('.0%')(data.householdWc)} Household with Child Under 18</p>`;
}

function addLegend(canvasHeight, colors) {
  const legend = d3.select('svg')
    .append('g')
    .attr('class', 'legend')
    .style('transform', 'translate(5%, 0)');

  const legendItemOne = legend.append('g')
    .attr('class', 'legend__item');

  legendItemOne.append('rect')
    .attr('x', 0)
    .attr('y', canvasHeight - 12)
    .attr('width', 10)
    .attr('height', 10)
    .attr('fill', colors[3]);

  legendItemOne.append('text')
    .attr('x', 20)
    .attr('y', canvasHeight - 3)
    .text('1 Person');

  const legendItemTwo = legend.append('g')
    .attr('class', 'legend__item');

  legendItemTwo.append('rect')
    .attr('x', 90)
    .attr('y', canvasHeight - 12)
    .attr('width', 10)
    .attr('height', 10)
    .attr('fill', colors[2]);

  legendItemTwo.append('text')
    .attr('x', 110)
    .attr('y', canvasHeight - 3)
    .text('2 People, No Children');

  const legendItemThree = legend.append('g')
    .attr('class', 'legend__item');

  legendItemThree.append('rect')
    .attr('x', 260)
    .attr('y', canvasHeight - 12)
    .attr('width', 10)
    .attr('height', 10)
    .attr('fill', colors[1]);

  legendItemThree.append('text')
    .attr('x', 280)
    .attr('y', canvasHeight - 3)
    .text('3+ People, No Children');

  const legendItemFour = legend.append('g')
    .attr('class', 'legend__item');

  legendItemFour.append('rect')
    .attr('x', 435)
    .attr('y', canvasHeight - 12)
    .attr('width', 10)
    .attr('height', 10)
    .attr('fill', colors[0]);

  legendItemFour.append('text')
    .attr('x', 455)
    .attr('y', canvasHeight - 3)
    .text('Household with Child Under 18');
}
