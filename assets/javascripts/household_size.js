d3.csv("/assets/data/household_size.csv").then((rawData) => {
  const headers = Object.keys(rawData[0]).slice(1);
  const seriesGen = d3.stack().keys(headers);
  const formattedData = seriesGen(rawData)

  const colors = ["goldenrod", "gray", "orange", "blue"]
  
  const margin = {top: 50, right: 75, bottom: 50, left: 75}
  , width = 700 - margin.left - margin.right
  , height = 420 - margin.top - margin.bottom;

  const svg = d3.select(".largeunits_age-frame")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)

  const graph = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .attr("class", "graph")
    .attr("height", height+margin.top+margin.bottom)

  const xScale = d3.scaleBand()
    .range([0, width-margin.right])
    .domain(rawData.map((d) => d.type ))
    .round(true)
    .padding(.65);

  const yScale = d3.scaleLinear()
    .range([height-25, 0])
    .domain([0, 1]);

  const xAxis = d3.axisBottom(xScale)
  const yAxis = d3.axisLeft(yScale)
    .ticks(10, "~%")

  graph.append("g")
  .call(xAxis)
  .attr("transform", "translate(0," + (height - 25) + ")")


  graph.selectAll("text")
  .attr("class", "xaxis__label")
  .call(wrap, xScale.bandwidth()+40)
  graph.append("g")
  .call(yAxis)

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
  return "<span class='tooltip__title'>" + data.type + "</span>"
  + "<br/>" + (d3.format(".0%")(data.onePerson)) + " 1 person"
  + "<br/>" + (d3.format(".0%")(data.twoPeople)) + " 2 people"
  + "<br/>" + (d3.format(".0%")(data.threePeople)) + " 3 people"
  + "<br/>" + (d3.format(".0%")(data.fourPeoplePlus)) + " 4+ people"
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