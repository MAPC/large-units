d3.csv("/large-units/assets/data/estimate_expected.csv").then((formattedData) => {
  const margin = {top: 80, right: 0, bottom: 25, left: 50}
  , width = 900
  , canvasHeight = 420
  , graphHeight = canvasHeight - margin.top - margin.bottom;

  const svg = d3.select(".estimate_expected-frame")
    .attr("width", width)
    .attr("height", canvasHeight)

  const titles = svg.append("g")
    .attr("class", "header")

  titles.append("text")
    .attr('x', '50%')
    .attr('y', '24')
    .attr('text-anchor', 'middle')
    .attr("class", "graph__title")
    .text("3+ Bedroom Units by Age of Householder")

  titles.append("text")
    .attr('x', '50%')
    .attr('y', '44')
    .attr('text-anchor', 'middle')
    .attr("class", "graph__subtitle")
    .text("2016 Estimate vs. Expect")

  const graph = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .attr("class", "graph")
    .attr("height", graphHeight)

  const xScale = d3.scaleBand()
    .range([0, width - margin.left])
    .domain(formattedData.map((d) => d.type ))
    .round(true)
    .padding(.75);

  const yScale = d3.scaleLinear()
    .range([graphHeight - margin.bottom, 0])
    .domain([0, 25000])

  const xAxis = d3.axisBottom(xScale)
  const yAxis = d3.axisLeft(yScale)
  .ticks(5)

  graph.append("g")
  .call(xAxis)
  .attr("transform", "translate(0," + (graphHeight - margin.bottom) + ")")


  graph.selectAll("text")
  .attr("class", "xaxis__label")

  graph.append("g")
  .call(yAxis)
  .selectAll("g")
  .attr("class", "yaxis__label")

  graph.selectAll("bar")
    .data(formattedData)
    .enter().append("rect")
    .style("fill", "#44aD89")
    .attr("x", function(d) { return xScale(d.type) - 5; })
    .attr("width", xScale.bandwidth() / 2 + 10)
    .attr("y", function(d) { return yScale(d.acs); })
    .attr("height", function(d) { return graphHeight - yScale(d.acs)  - margin.bottom; })
    .on("mousemove", function(d) {
      tooltip.html(displayToolTip(d))
      tooltip.attr("width", "200")
      tooltip.attr("height", "200")
      tooltip.style("display", null)
      .style("left", tooltipLeft(d3.event, document.querySelector('.tooltip')))
      .style("top", tooltipTop(d3.event,  document.querySelector('.tooltip')))
    })
    .on("mouseleave", function(d) { tooltip.style("display", "none") });


    graph.selectAll("bar")
    .data(formattedData)
    .enter().append("rect")
    .style("fill", "rgba(255,255,255,.5)")
    .style("stroke", "black")
    .attr("x", function(d) { return (xScale(d.type) + xScale.bandwidth() / 2) - 5; })
    .attr("width", xScale.bandwidth() / 2 + 10)
    .attr("y", function(d) { return yScale(d.expected); })
    .attr("height", function(d) { return graphHeight - yScale(d.expected) - margin.bottom; })
    .on("mousemove", function(d) {
      tooltip.html(displayToolTip(d))
      tooltip.attr("width", "200")
      tooltip.attr("height", "200")
      tooltip.style("display", null)
      .style("left", tooltipLeft(d3.event, document.querySelector('.tooltip')))
      .style("top", tooltipTop(d3.event,  document.querySelector('.tooltip')))
    })
    .on("mouseleave", function(d) { tooltip.style("display", "none") });

    const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("display", "none");
        
    tooltip.append("rect")
    .attr("width", 50)
    .attr("height", 50)
    .attr("fill", "white")
    .style("opacity", 0.5);

    tooltip.append("text")
    .attr("x", 15)
    .attr("dy", "1.2em")
    .style("text-anchor", "middle")
    .attr("font-size", "12px")
    .attr("font-weight", "bold");

    addLegend(canvasHeight);
})

function tooltipLeft(event, tooltip) {
  if (event.pageX > 350) {
    return event.pageX - tooltip.offsetWidth - 10 + "px"
  } else {
    return event.pageX + 10 + "px"
  }
}

function tooltipTop(event, tooltip) {
  if (event.pageY > 275) {
    return event.pageY - tooltip.offsetHeight - 10 + "px"
  } else {
    return event.pageY + 10 + "px"
  }
}

function displayToolTip(data) {
  return "<h4 class='tooltip__title'>Age range: " + data.type + "</h4>"
  + "<p class='tooltip__text'>"
  + "<svg width='16' height='10'><circle cx='5' cy='5' r='5' fill='#44aD89'/></svg>"
  + d3.format(",")(data.acs) + " estimated</p>"
  + "<p class='tooltip__text'>"
  + "<svg width='16' height='10'><circle cx='5' cy='5' r='4' stroke='black' fill='white'/></svg>"
  + d3.format(",")(data.expected) + " expected</p>"
}

function addLegend(canvasHeight) {
  const legend = d3.select('svg')
  .append('g')
  .attr('class', 'legend')
  .style('transform', 'translate(170px, 0)')

  const legendItemOne = legend.append('g')
  .attr('class', 'legend__item')
  .style('transform', 'translate(200, 10)')

  legendItemOne.append('rect')
  .attr('x', 0)
  .attr('y', canvasHeight - 12)
  .attr('width', 10)
  .attr('height', 10)
  .attr('fill', '#44aD89')

  legendItemOne.append("text")
  .attr('x', 20)
  .attr('y', canvasHeight - 3)
  .text("2012–2016 ACS Estimate")

  const legendItemTwo = legend.append('g')
  .attr('class', 'legend__item')
  .style('transform', 'translate(300, 10)')

  legendItemTwo.append('rect')
  .attr('x', 200)
  .attr('y', canvasHeight - 12)
  .attr('width', 10)
  .attr('height', 10)
  .attr('stroke', 'black')
  .attr('stroke-width', 1)
  .attr('fill', 'white')

  legendItemTwo.append("text")
  .attr('x', 220)
  .attr('y', canvasHeight - 3)
  .text("Expected 2012–2016 based on 2000 Census Rates by Age")
}