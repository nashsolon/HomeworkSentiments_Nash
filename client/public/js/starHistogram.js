function StarHistogram() {
    let vis = this;
    vis.init();
}

StarHistogram.prototype.init = function() {
    let vis = this;
    vis.svgWidth = 750;
    vis.svgHeight = 250;

    vis.svg = d3.select('#starHistogram').append('svg')
        .attr('width', vis.svgWidth)
        .attr('height', vis.svgHeight);

    vis.y = d3.scaleLinear()
        .range([30, vis.svgHeight - 20])
        .domain([0, 5])

    for (let i = 0; i < 5; i++) {
        for (let j = 5; j > i; j--) {
            vis.svg.append('text')
                .text(() => '\uf005')
                .attr('class', 'fa svg-star')
                .attr('x', -10 + 30 * j)
                .attr('y', vis.y(i)); //50 + 50 * i
        }
    }
    vis.svg.append('text')
        .text('NA')
        .attr('class', 'stars-na-text')
        .attr('x', 143)
        .attr('text-anchor', 'right')
        .attr('y', vis.y(5))


}

StarHistogram.prototype.update = function(data) {
    let vis = this;
    console.log(data);

    let keys = Object.keys(data);
    // console.log(keys);
    // keys = keys.sort((a, b) => {
    //     if (isNaN(a)) return 1;
    //     else return -1;
    // })

    // * To order the NaN to the right place
    let last = keys.pop();
    keys.unshift(last);

    let rects = vis.svg.selectAll('rect')
        .data(keys);

    let text = vis.svg.selectAll('.star-text')
        .data(keys);

    // console.log(keys);

    vis.x = d3.scaleLinear()
        .domain([0, Math.max(...Object.values(data))])
        .range([0, 500])

    let rectHeight = 30;
    let animTime = 1000;

    rects
        .transition()
        .duration(animTime)
        .attr('y', (d, i) => vis.y(5 - i) - rectHeight / 2 - 7)
        .attr('width', (d, i) => {
            return vis.x(data[d])
        });


    rects.enter()
        .append('rect')
        .attr('class', 'star-bar')
        .attr('y', (d, i) => vis.y(5 - i) - rectHeight / 2 - 7)
        .attr('x', 200)
        .attr('height', rectHeight)
        .attr('width', 0)
        .on('click', function(e, d) {
            vis.svg.selectAll('rect').classed('clicked', false);
            d3.select(this).classed('clicked', true);
            $('#starHistogram').trigger('updateStars', [d])
        })
        .transition()
        .duration(animTime)
        .attr('width', (d, i) => {
            return vis.x(data[d])
        });

    text
        .text((d) => {
            if (data[d] != 0) return data[d]
        })
        .transition()
        .duration(animTime)
        .attr('x', (d) => 210 + vis.x(data[d]))
        .style('opacity', 1);

    text
        .enter()
        .append('text')
        .attr('class', 'star-text')
        .text((d) => {
            if (data[d] != 0) return data[d]
        })
        .attr('y', (d, i) => {
            return vis.y(5 - i) - rectHeight / 2 + 15
        })
        .attr('x', (d) => 210)
        .style('opacity', 0)
        .transition()
        .duration(animTime)
        .attr('x', (d) => 210 + vis.x(data[d]))
        .style('opacity', 1)


}