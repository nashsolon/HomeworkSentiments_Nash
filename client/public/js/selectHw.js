function SelectHW() {
    this.init();
}

SelectHW.prototype.init = function() {
    let vis = this;

    vis.svgWidth = 1000;
    vis.svgHeight = 100;


    vis.svg = d3.select('#select-hw').append('svg')
        .attr('width', vis.svgWidth)
        .attr('height', vis.svgHeight)
}

SelectHW.prototype.update = function(data) {
    // console.log(data);
    let vis = this;

    let keys = data;
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
        // console.log(sortedKeys);
    sortedKeys.unshift('all')

    // * When we select HWM and then change semesters, the NA star count
    // * gets moved to the left and breaks

    let text = vis.svg.selectAll('text').data(sortedKeys);

    let iScale = d3.scaleLinear()
        .range([50, vis.svgWidth - 50])
        .domain([0, sortedKeys.length - 1]);

    let animTime = 1000;

    text
        .text((d) => {
            return d != 'all' ? d.toUpperCase() : 'All';
        })
        .transition()
        .duration(animTime)
        .style('opacity', 1)
        .attr('x', (d, i) => iScale(i));

    text
        .exit()
        .style('opacity', 1)
        .transition()
        .duration(animTime)
        .style('opacity', 0)
        .remove();

    text.enter()
        .append('text')
        .text((d) => {
            return d != 'all' ? d.toUpperCase() : 'All';
        })
        .attr('class', (d, i) => {
            return i == 0 ? 'hw-select-text sel' : 'hw-select-text des';
        })
        .attr('x', (d, i) => iScale(i))
        .attr('y', vis.svgHeight / 2 - 10)
        .attr('text-anchor', 'middle')
        .on('click', function(e, d) {
            if (d3.select(this).classed('sel'))
                return;

            vis.svg.selectAll('text').classed('sel', false);
            vis.svg.selectAll('text').classed('des', true);

            d3.select(this).classed('des', false);
            d3.select(this).classed('sel', true);

            $('#select-hw').trigger('updateHw', [d]);

            // if ($(this).attr('id') == curSem)
            //     return;

            // $(this).removeClass('des');
            // $(this).addClass('sel');

            // $(this).siblings().removeClass('sel');
            // $(this).siblings().addClass('des');

            // curSem = $(this).attr('id');
            // update();
        })
        .style('opacity', 0)
        .transition()
        .duration(animTime)
        .style('opacity', 1);
}