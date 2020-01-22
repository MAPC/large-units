d3.csv("/assets/data/household_size.csv").then((rawData) => {
  const headers = Object.keys(rawData[0]).slice(1);
  const seriesGen = d3.stack().keys(headers);
  const formattedData = seriesGen(rawData)

  const colors = ["#78BE20", "#012169", "#E8BA1C", "#F47B20"]
  
  const margin = {top: 55, right: 75, bottom: 20, left: 40}
  , width = 700
  , canvasHeight = 420 - margin.top - margin.bottom;

  const svg = d3.select(".largeunits_age-frame")
    .attr("width", width)
    .attr("height", canvasHeight + margin.top + margin.bottom)

  svg.append("text")
    .attr('x', '50%')
    .attr('y', '16')
    .attr('text-anchor', 'middle')
    .attr("class", "graph__title")
    .text("Large Unit Household Size by Tenure")

  svg.append("text")
    .attr('x', '50%')
    .attr('y', '36')
    .attr('text-anchor', 'middle')
    .attr("class", "graph__subtitle")
    .text("Inner Core PUMAS, 2012–2016")

  const graph = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .attr("class", "graph")
    .attr("height", canvasHeight+margin.top+margin.bottom)

  const xScale = d3.scaleBand()
    .range([0, width-margin.left])
    .domain(rawData.map((d) => d.type ))
    .round(true)
    .padding(.35);

  const yScale = d3.scaleLinear()
    .range([canvasHeight-25, 0])
    .domain([0, 1]);

  const xAxis = d3.axisBottom(xScale)
  const yAxis = d3.axisLeft(yScale)
    .ticks(10, "~%")

  graph.append("g")
  .call(xAxis)
  .attr("transform", "translate(0," + (canvasHeight - 25) + ")")


  graph.selectAll("text")
  .attr("class", "xaxis__label")

  graph.append("g")
  .call(yAxis)
  .selectAll("g")
  .attr("class", "yaxis__label")

  graph.selectAll("g.household-type")
    .data(formattedData)
    .enter().append("g")
    .attr("class", "household-type")
    .style("fill", function(d, i) { return colors[i]; })
    .selectAll("rect")
    .data(function(d) { return d; })
    .enter().append("rect")
    .attr("x", function(d) { return xScale(d.data.type) })
    .attr("y", d => { return yScale(d[1]) })
    .attr("height", d => Math.abs(yScale(d[1]) - yScale(d[0])))
    .attr("width", xScale.bandwidth())
    .on("mousemove", function(d) {
        tooltip.html(displayToolTip(d.data))
        tooltip.attr("width", "200")
        tooltip.attr("height", "200")
        tooltip.style("display", null)
        .style("left", tooltipLeft(d3.event, document.getElementsByClassName('tooltip')[0]))
        .style("top", tooltipTop(d3.event,  document.getElementsByClassName('tooltip')[0]));
    })
    .on("mouseleave", function(d) { tooltip.style("display", "none") })

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

    addLegend(canvasHeight, margin)
})

function tooltipLeft(event, tooltip) {
  if (event.pageX > 350) {
    return event.pageX - tooltip.offsetWidth - 10 + "px"
  } else {
    return event.pageX + 10 + "px"
  }
}

function tooltipTop(event, tooltip) {
  if (event.pageY > 235) {
    return event.pageY - tooltip.offsetHeight - 10 + "px"
  } else {
    return event.pageY + 10 + "px"
  }
}

function displayToolTip(data){
  return "<h4 class='tooltip__title'>" + data.type + "</h4>"
  + "<p class='tooltip__text'>" 
  + "<svg width='16' height='10'><circle cx='5' cy='5' r='5' fill='#F47B20'/></svg>"
  + (d3.format(".0%")(data.fourPeoplePlus)) + " 4+ people</p>"
  + "<p class='tooltip__text'>" 
  + "<svg width='16' height='10'><circle cx='5' cy='5' r='5' fill='#E8BA1C'/></svg>"
  + (d3.format(".0%")(data.threePeople)) + " 3 people</p>"
  + "<p class='tooltip__text'>" 
  + "<svg width='16' height='10'><circle cx='5' cy='5' r='5' fill='#012169'/></svg>"
  + (d3.format(".0%")(data.twoPeople)) + " 2 people</p>"
  + "<p class='tooltip__text'>" 
  + "<svg width='16' height='10'><circle cx='5' cy='5' r='5' fill='#78BE20'/></svg>"
  + (d3.format(".0%")(data.onePerson)) + " 1 person</p>"
}

function addLegend(height, margin) {
  const legend = d3.select('svg')
  .append('g')
  .attr('class', 'legend')
  .style('transform', 'translate(25%, 0)')

  const legendItemOne = legend.append('g')
  .attr('class', 'legend__item')

  legendItemOne.append('rect')
  .attr('x', 0)
  .attr('y', height + margin.top + 5)
  .attr('width', 10)
  .attr('height', 10)
  .attr('fill', '#78BE20')

  legendItemOne.append("text")
  .attr('x', 20)
  .attr('y', height + margin.top + 14)
  .text("1 person")

  const legendItemTwo = legend.append('g')
  .attr('class', 'legend__item')

  legendItemTwo.append('rect')
  .attr('x', 100)
  .attr('y', height + margin.top + 5)
  .attr('width', 10)
  .attr('height', 10)
  .attr('fill', '#012169')

  legendItemTwo.append("text")
  .attr('x', 120)
  .attr('y', height + margin.top + 14)
  .text("2 people")

  const legendItemThree = legend.append('g')
  .attr('class', 'legend__item')

  legendItemThree.append('rect')
  .attr('x', 200)
  .attr('y', height + margin.top + 5)
  .attr('width', 10)
  .attr('height', 10)
  .attr('fill', '#E8BA1C')

  legendItemThree.append("text")
  .attr('x', 220)
  .attr('y', height + margin.top + 14)
  .text("3 people")

  const legendItemFour = legend.append('g')
  .attr('class', 'legend__item')

  legendItemFour.append('rect')
  .attr('x', 300)
  .attr('y', height + margin.top + 5)
  .attr('width', 10)
  .attr('height', 10)
  .attr('fill', '#F47B20')

  legendItemFour.append("text")
  .attr('x', 320)
  .attr('y', height + margin.top + 14)
  .text("4+ people")
}