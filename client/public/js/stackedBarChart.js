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


    // leg.append('text')
    //     .text('positive')
    //     .attr('class', 'legend-text pos')
    //     .attr('x', () => vis.svgWidth / 2 - 100)
    //     .attr('text-anchor', 'middle')
    //     .attr('y', 15)

    // leg.append('text')
    //     .text('neutral')
    //     .attr('class', 'legend-text neu')
    //     .attr('x', () => vis.svgWidth / 2)
    //     .attr('text-anchor', 'middle')
    //     .attr('y', 15)

    // leg.append('text')
    //     .text('negative')
    //     .attr('class', 'legend-text neg')
    //     .attr('x', () => vis.svgWidth / 2 + 100)
    //     .attr('text-anchor', 'middle')
    //     .attr('y', 15)




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



    let marginX = 40;
    let x = d3.scaleLinear()
        .domain([0, Object.keys(data).length - 1])
        .range([marginX, vis.svgWidth - marginX]);

    let marginYTop = 10;
    let marginYBot = 50;

    let y = d3.scaleLinear()
        .domain([0, 1])
        // .range([vis.svgHeight - marginY, marginY]);
        .range([marginYTop, vis.svgHeight - marginYBot])

    let keys = Object.keys(data);
    // console.log(keys)
    // console.log(Object.values(data))

    // let sortedKeys = [];
    let sortedKeys = keys.sort((a, b) => {
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
        sortedData.push(data[s])
    }
    // console.log(sortedData)

    // console.log(sortedData)
    let stackedData = d3.stack()
        .keys(vis.labels)(Object.values(sortedData))

    // console.log(stackedData)

    // let typeToClass = d3.scaleOrdinal()
    //     .domain()


    // let rects = vis.svg.selectAll('rect')
    //     .data(keys);

    let animTime = 1000;


    let text = vis.svg.selectAll('.stacked-bar-label')
        .data(sortedKeys);

    text
        .text((d) => d)
        .transition()
        .duration(animTime)
        .style('opacity', 1)
        .attr('x', (d, i) => x(i));

    text.enter()
        .append('text')
        .text((d) => d)
        .attr('x', (d, i) => x(i))
        .attr('y', vis.svgHeight - 20)
        .attr('class', 'stacked-bar-label')
        .attr('text-anchor', 'middle')
        .style('opacity', 0)
        .transition().duration(animTime)
        .style('opacity', 1);

    text.exit()
        .remove();


    vis.svg.selectAll('g')
        // .style('opacity', 1)
        // .transition()
        // .duration(animTime)
        // .style('opacity', 0)
        .remove();

    let groups = vis.svg.selectAll('g')
        .data(stackedData)
        .enter()
        .append('g')
        .attr('class', (d, i) => d.key)
        .style('opacity', 1);

    let rectWidth = 30;


    let rects = groups.selectAll('rect')
        .data((d) => d);

    rects
        .attr('x', (d, i) => x(i) - rectWidth / 2)
        .attr('y', (d) => y(d[0]))
        .attr('height', (d) => y(d[1]) - y(d[0]));

    // * For the id of each rect
    let counter = 1
    let arr = []
    if (s_or_e == 'sentiments') {
        // console.log('sentiments CHART')
        arr = ['pos', 'neu', 'neg']
    } else {
        arr = ['angry', 'fear', 'happy', 'sad', 'surprise']
    }
    // console.log(data)

    let index = 0
    let num_hws = Object.keys(data).length + 1
    let ids = []

    for (sentiment of stackedData) {
        // console.log(sentiment)
        let i = 0
        for (let rect of sentiment) {
            if (counter % num_hws == 0) {
                // console.log(sortedKeys)
                index += 1
                counter += 1
            }
            let id = sortedKeys[i] + '_' + arr[index]
            ids.push(id)
                // console.log(rect[2])
            counter += 1
            i += 1
        }
    }
    // console.log(ids)
    var tooltip = vis.svg
        //* Create tooltip and set opacity to 0
    if (vis.cat == 'sentiments') {
        tooltip = d3.select("#stacked-bar-svg-sent")
            .append("text")
            .attr('class', 'info-text glass-cont opaque')
            .style("opacity", 0)
    } else {
        tooltip = d3.select("#stacked-bar-svg-emote")
            .append("text")
            .attr('class', 'info-text glass-cont opaque')
            .style("opacity", 0)
    }

    let id_counter = 0
    rects
        .enter()
        .append('rect')
        .attr('class', 'stacked-bar')
        // .attr('id', (d) => {
        //     // console.log(d);
        // })
        .attr('x', (d, i) => x(i) - rectWidth / 2)
        .attr('y', (d) => y(d[0]))
        .attr('height', (d) => y(d[1]) - y(d[0]))
        .attr('width', rectWidth)
        .attr('id', (d) => {
            let id = ids[id_counter]
            id_counter += 1
                // console.log(id)
            return id
        })
        .on("mouseover", (e) => {
            // console.log(e)
            // console.log(e.target.id)
            let id = e.target.id;
            let cur_hw = ''
            let cur_info = ''
            let cur_category = id.substring(4, id.length)
                // console.log(cur_category)
            for (let [hw, info] of Object.entries(data)) {
                if (id.includes(hw)) {
                    cur_hw = hw
                    cur_info = info
                        // console.log(cur_info)
                }
            }

            let tooltip_score = cur_info[cur_category]
            tooltip_score = Math.round(100 * (Math.round(tooltip_score * 1000) / 1000))
            let string = cur_category + ': ' + tooltip_score + '%'
                // console.log(string)

            tooltip
                .html(string)
                .style('opacity', 1)
                // if(id.includes('pos'))
                // tooltip
                //     .html("subgroup: " + subgroupName + "<br>" + "Value: " + subgroupValue)
                //     .style("opacity", 1)
        })
        .on("mousemove", function(e) {
            // console.log(d3.pointer(e))
            tooltip
                .attr("x", (d3.pointer(e)[0]) + 10 + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
                .attr("y", (d3.pointer(e)[1]) + (-10) + "px")
                // console.log('moving the mouse')
        })
        .on("mouseout", () => {
            // console.log('mouseout')
            tooltip.style('opacity', 0)
        })
        .style('opacity', 0)
        .transition()
        .duration(animTime)
        .style('opacity', 1)


    // rects.on('mouseover', (e) => {
    //     console.log(e)
    // });



    // rects
    //     .update(() => {
    //         console.log('we updated')
    //     })


    // rects

    // rects.enter()
    //     .append('rect')
    //     .attr('x', (d, i) => x(i))
    //     .attr('y', () => y(0))
    //     .attr('width', 20)
    //     .attr('height', y(0))
    //     .attr('class', 'bar')
    //     .transition()
    //     .duration(animTime)
    //     // .attr('y', () => y(1))
    //     .attr('height', (d) => {
    //         console.log(data[d].pos)
    //         console.log(y(data[d].pos))

    //         return y(data[d].pos);
    //     });
}