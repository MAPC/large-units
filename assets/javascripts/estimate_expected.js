d3.csv("/assets/data/estimate_expected.csv").then((formattedData) => {
  const margin = {top: 50, right: 75, bottom: 50, left: 75}
  , width = 900 - margin.left - margin.right
  , height = 420 - margin.top - margin.bottom;

  const svg = d3.select(".estimate_expected-frame")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)

  const graph = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .attr("class", "graph")
    .attr("height", height+margin.top+margin.bottom)

  const xScale = d3.scaleBand()
    .range([0, width-margin.right])
    .domain(formattedData.map((d) => d.type ))
    .round(true)
    .padding(.65);

  const yScale = d3.scaleLinear()
    .range([height-25, 0])
    .domain([0, d3.max(formattedData.map(datum => +datum.acs))]);

  const xAxis = d3.axisBottom(xScale)
  const yAxis = d3.axisLeft(yScale)

  graph.append("g")
  .call(xAxis)
  .attr("transform", "translate(0," + (height - 25) + ")")


  graph.selectAll("text")
  .attr("class", "xaxis__label")
  graph.append("g")
  .call(yAxis)

  graph.selectAll("bar")
    .data(formattedData)
    .enter().append("rect")
    .style("fill", "steelblue")
    .attr("x", function(d) { return xScale(d.type); })
    .attr("width", xScale.bandwidth() / 2)
    .attr("y", function(d) { return yScale(d.acs) - 25; })
    .attr("height", function(d) { return height - yScale(d.acs); })
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
    .style("fill", "white")
    .style("stroke", "black")
    .attr("x", function(d) { return (xScale(d.type) + xScale.bandwidth() / 2); })
    .attr("width", xScale.bandwidth() / 2)
    .attr("y", function(d) { return yScale(d.expected) - 25; })
    .attr("height", function(d) { return height - yScale(d.expected); })
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

function displayToolTip(data){
  return "<span class='tooltip__title'>Age range: " + data.type + "</span>"
  + "<br/>" + d3.format(",")(data.acs) + " ACS"
  + "<br/>" + d3.format(",")(data.expected) + " expected"
}
