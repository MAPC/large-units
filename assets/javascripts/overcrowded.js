d3.csv("/large-units/assets/data/overcrowded.csv").then((data) => {
  const margin = {top: 80, right: 0, bottom: 25, left: 30}
  , width = 700
  , canvasHeight = 420
  , graphHeight = canvasHeight - margin.top - margin.bottom;

  const svg = d3.select(".overcrowded-frame")
    .attr("width", width)
    .attr("height", canvasHeight)

  const titles = svg.append("g")
    .attr("class", "header")

  titles.append("text")
    .attr('x', '50%')
    .attr('y', '24')
    .attr('text-anchor', 'middle')
    .attr("class", "graph__title")
    .text("Percent Overcrowded Households")

  titles.append("text")
    .attr('x', '50%')
    .attr('y', '44')
    .attr('text-anchor', 'middle')
    .attr("class", "graph__subtitle")
    .text("Study Area, 2012–2016")

  const graph = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .attr("class", "graph")
    .attr("height", graphHeight)

  const xScale = d3.scaleBand()
    .range([0, width - margin.left])
    .domain(data.map((d) => d.household ))
    .round(true)
    .padding(.65);

  const yScale = d3.scaleLinear()
    .range([graphHeight - margin.bottom, 0])
    .domain([0, .14]);

  const xAxis = d3.axisBottom(xScale)
  const yAxis = d3.axisLeft(yScale)
    .ticks(7, "~%")

  graph.append("g")
  .call(xAxis)
  .attr("transform", "translate(0," + (graphHeight - margin.bottom) + ")")
  .attr("class", "xaxis")


  graph.selectAll("text")
  .attr("class", "xaxis__label")
  .call(wrap, xScale.bandwidth() + 40);

  graph.append("g")
  .call(yAxis)
  .selectAll("g")
  .attr("class", "yaxis__label");

  graph.selectAll("bar")
    .data(data)
    .enter().append("rect")
    .style("fill", " #3B66B0")
    .attr("x", function(d) { return xScale(d.household); })
    .attr("width", xScale.bandwidth())
    .attr("y", function(d) { return yScale(d.percentage); })
    .attr("height", function(d) { return graphHeight - yScale(d.percentage) - margin.bottom; })
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
  if (event.pageX > 330) {
    return event.pageX - tooltip.offsetWidth - 10 + "px"
  } else {
    return event.pageX + 10 + "px"
  }
}

function tooltipTop(event, tooltip) {
  if (event.pageY > 240) {
    return event.pageY - tooltip.offsetHeight - 10 + "px"
  } else {
    return event.pageY + 10 + "px"
  }
}

function displayToolTip(data){
  return "<h4 class='tooltip__title'>" + data.household + "</h4>"
  + "<p class='tooltip__text'>" + d3.format("~%")(data.percentage) + " overcrowded households</p>"
}

function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
}

function type(d) {
  d.value = +d.value;
  return d;
}