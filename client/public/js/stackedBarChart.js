function StackedBarChart(container, labels, legLabels, s_or_e) {
    let vis = this;
    vis.container = container;
    vis.labels = labels;
    vis.legLabels = legLabels;
    vis.cat = s_or_e
    vis.init();
}

StackedBarChart.prototype.init = function() {
    let vis = this;

    vis.svgWidth = 1000;
    vis.svgHeight = 300;
    vis.legHeight = 30;


    // * LEGEND * //

    vis.legSvg = d3.select(vis.container).append('svg')
        .attr('width', vis.svgWidth)
        .attr('height', vis.legHeight);

    let leg = vis.legSvg.append('g')

    for (let i = 0; i < vis.labels.length; i++) {
        // console.log(vis.labels[i]);
        // console.log(vis.legLabels[i]);
        leg.append('text')
            .text(vis.legLabels[i])
            .attr('class', () => 'legend-text ' + vis.labels[i])
            .attr('text-anchor', 'middle')
            .attr('x', () => {
                // console.log(vis.labels.length)
                let half = Math.floor(vis.labels.length / 2);
                // console.log(half);
                // console.log(100 * (half - i))
                return vis.svgWidth / 2 + 100 * (half - i);
            })
            .attr('y', 15);
    }


    // > END LEGEND < //
    if (vis.cat == 'sentiments') {
        vis.svg = d3.select(vis.container).append('svg')
            .attr('width', vis.svgWidth)
            .attr('height', vis.svgHeight)
            .attr('id', 'stacked-bar-svg-sent');
    } else {
        vis.svg = d3.select(vis.container).append('svg')
            .attr('width', vis.svgWidth)
            .attr('height', vis.svgHeight)
            .attr('id', 'stacked-bar-svg-emote');
    }
}

StackedBarChart.prototype.update = function(data, s_or_e) {
    let vis = this;
    // console.log(data);
    let groups = Object.keys(data);

    // console.log(groups);

    vis.svg.selectAll('g').remove()

    //Sort the data properly
    let sortedKeys = groups.sort((a, b) => {
        let an = +a.charAt(2);
        let bn = +b.charAt(2);
        if (isNaN(an))
            return 1;
        else if (isNaN(bn))
            return -1;
        else
            return an - bn;
    })

    // console.log(sortedKeys)
    let sortedData = []
    for (let s of sortedKeys) {
        // console.log(s);
        data[s].hw = s;
        sortedData.push(data[s])
    }

    //ADD THE X-AXIS
    var x = d3.scaleBand()
      .domain(sortedKeys)
      .range([50, vis.svgWidth - 50])
      .padding([0.2])
        vis.svg.append("g")
        .attr("transform", "translate(0," + (vis.svgHeight - 20) + ")")
        .call(d3.axisBottom(x).tickSize(0));

    //ADD THE Y-AXIS
    let data_arr = Object.keys(data).map((key) => [key, data[key]]);
    // console.log(data_arr)
    let max_pos = Math.max.apply(Math, data_arr.map(function(d) { return d[1].pos; }))
    let max_neg = Math.max.apply(Math, data_arr.map(function(d) { return d[1].neg; }))
    let max_neu = Math.max.apply(Math, data_arr.map(function(d) { return d[1].neu; }))
    let max_y = 0
    if(max_pos > max_neg && max_pos > max_neu){
        max_y = max_pos;
    }
    else if(max_neg > max_pos && max_neg > max_neu){
        max_y = max_neg;
    }
    else{
        max_y = max_neu;
    }
    
    let yAxis = d3.scaleLinear()
        .domain([0, max_y])
        .range([ vis.svgHeight - 20, 0]);

    let y = d3.scaleLinear()
        .domain([0, max_y])
        .range([ vis.svgHeight, 60]);
        
    vis.svg.append("g")
        .attr("transform", "translate(" + (vis.svgWidth - 950)+ ", 0)")
        .call(d3.axisLeft(yAxis));


    //ADD THE BARS
    // console.log(vis.labels);
    // color palette = one color per subgroup
    var color = d3.scaleOrdinal()
        .domain(vis.labels)
        .range(['#29b674','#559e94','#d44545'])

    var xSubgroup = d3.scaleBand()
        .domain(vis.labels)
        .range([0, x.bandwidth()]) //get width of x's scaleband
        .padding([0.05])
    
    console.log(sortedData)
    vis.svg.append('g').selectAll('g')
        .data(sortedData)
        .enter()
        .append("g")
          .attr("transform", function(d) {
                console.log(d);
                return "translate(" + x(d.hw) + ",-22)";; 
            })
        .selectAll("rect")
        .data(function(d) { 
            return vis.labels.map(function(key) { 
                console.log(d)
                return {key: key, value: d[key]};
            
            }); 
        })
        .enter().append("rect")
          .attr("x", function(d) { return xSubgroup(d.key); })
          .attr("y", function(d) {
              console.log(d);
            return y(d['value']); })
          .attr("width", xSubgroup.bandwidth()) //gets width of xSubgroup scaleBand
          .attr("height", function(d) { 
            //   console.log(d);
              return vis.svgHeight - y(d['value']); 
            })
          .attr("fill", function(d) { return color(d.key); });




    
}