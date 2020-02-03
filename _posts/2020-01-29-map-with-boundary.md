---
layout: post
title:  "Region map with study area boundary"
description: "Click to view data visualization"
---
<div id="map" class="map__container"></div>
<div class="map__overlay map__title" id="title">Family Sized Housing Units</div>
<div class="map__overlay map__legend" id="legend">
  <svg height='168' width='160'>
    <rect width='16' height='16' x='8' y='8' style='fill:#0097c4; stroke: black; stroke-width: 1px;'></rect>
    <text x='32' y='20' class='legend__label'>0%-25%</text>
    <rect width='16' height='16' x='8' y='32' style='fill:#3b66b0; stroke: black; stroke-width: 1px;'></rect>
    <text x='32' y='44' class='legend__label'>26%-50%</text>
    <rect width='16' height='16' x='8' y='56' style='fill:#233069; stroke: black; stroke-width: 1px;'></rect>
    <text x='32' y='70' class='legend__label'>51%-75%</text>
    <rect width='16' height='16' x='8' y='80' style='fill:#111436; stroke: black; stroke-width: 1px;'></rect>
    <text x='32' y='92' class='legend__label'>76%-100%</text>
    <rect width='16' height='16' x='8' y='104' style='fill:#B57F00; stroke: black; stroke-width: 1px;'></rect>
    <text x='32' y='116' class='legend__label'>Data unavailable</text>
    <rect width='16' height='16' x='8' y='128' style='fill:black; stroke: black; stroke-width: 1px;'></rect>
    <line x1='15' y1='144' x2='24' y2='135' style='stroke: #CFCECC;'></line>
    <line x1='8' y1='144' x2='24' y2='128' style='stroke: #CFCECC;'></line>
    <line x1='8' y1='137' x2='17' y2='128' style='stroke: #CFCECC;'></line>
    <text x='32' y='140' class='legend__label'>High margin of error</text>
    <line x1 ='8' y1='160' x2='24' y2='160' style='stroke: #7d7d7d; stroke-width: 4;'></line>
    <text x='32' y='164' class='legend__label'>Study area boundary</text>
  </svg>
</div>
<script src="{{'assets/javascripts/map-with-boundary.js' | absolute_url }}" type="module"></script>