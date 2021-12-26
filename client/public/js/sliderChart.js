function SliderChart(){
    let vis = this;
    vis.init();
}

SliderChart.prototype.init = function(){
    let vis = this;

    vis.svgWidth = 1000;
    vis.svgHeight = 100;
     

    vis.svg = d3.select('#sliderChart').append('svg')
        .attr('width', vis.svgWidth)
        .attr('height', vis.svgHeight)
}

function hoverFunction(e, separatedData){
    let target_id = e.target.id
    console.log(separatedData)
    // console.log(this)

    let target_hw = ''
    let target_compound = ''
    for(let [key, info] of Object.entries(separatedData)){
        if(target_id.includes(key)){
            target_hw = key
            target_compound = info.compound
        }
    }
    // console.log(hov_hw)
    target_compound = Math.round(target_compound * 1000)/1000
    console.log(target_compound)

    let pnn = ''

    if(target_compound > 0.05){
        pnn = '(positive)'
    }
    else if(target_compound < -0.05){
        pnn = '(negative)'
    }
    else{
        pnn = 'neutral'
    }

    let string = target_hw + ': ' + target_compound + ' ' + pnn
    
    $('#slider-chart-tooltip').show()
    $('#slider-chart-tooltip').text(string)
}

function unhoverFunction(separatedData){
    // console.log('we are not hovering')
}

SliderChart.prototype.initial = function(separatedData){
    let vis = this;

    let y = 70
    let initial_text_y = 65
    let axis_y = 80

    let separated_array = Object.entries(separatedData);

    // * Adding test circles for neutral and negative homeworks

    // ? separatedData['test_neu'] = {'compound': 0}
    // ? separatedData['test_neg'] = {'compound': -.10}

    // vis.svg.selectAll('circle').remove()

    vis.svg.selectAll('rect').remove()
    vis.svg.selectAll('g').remove()

    // * send the keys as data so we have easy access to keys
    let keys = Object.keys(separatedData);


    // * Scale and axis stuff
    let xScaleComp = d3.scaleLinear()
                        .domain([d3.min(keys, (d) => {return separatedData[d].compound -.02}),
                                    d3.max(keys, (d) => {return separatedData[d].compound + .02})])
                        .range([20, vis.svgWidth]);

    let x_axis = d3.axisBottom()
        .scale(xScaleComp);

    let xScalePNN = d3.scaleLinear()
                        .domain([0,1])
                        .range([20, vis.svgWidth]);

    // *Adding the scale
    vis.svg.append("g")
        .attr('transform', 'translate(0,'+axis_y+')')
        .call(x_axis);

    
    // * Adding the rectangles
    vis.svg.selectAll('rect')
        .data(keys)
        .enter()
        .append('rect')
        .attr('stroke', 'black')
        .attr('class', 'slider-rect')
        .attr('y', y)
        .attr('width', 10)
        .attr('height', 20)
        .attr('id', (k)=>{
            return 'rect_'+k;
        })
        .attr('x', (d, i) =>{
            return xScaleComp(separatedData[d].compound)
        })
        .attr('fill', (d) =>{
            
            // console.log('Just added')
            // console.log(d)
            // console.log(separatedData[d].compound)

            if (separatedData[d].compound > .05){
                return '#29b674';
            }
            else if (separatedData[d].compound < -.05){
                return '#AC3B61';
            }
            else {
                 return '#3badd3';
            }
        })
        .style('opacity', .8)
        .on('mouseover', (e) => hoverFunction(e, separatedData))
        .on('mouseout', () => unhoverFunction(separatedData));
    
    
    // * Finding proper y for text. Convert compound to the scale, then compare
    // * to see if the text will overlap
    // console.log(separated_array)
    // * Adding initial y value
    for (hw_i of separated_array){
        hw_i[1]['y_value'] = initial_text_y
    }
    for (hw_i of separated_array){
        let x_value_i = xScaleComp(hw_i[1].compound)
        // console.log(x_value_i)
        for (hw_c of separated_array){
            if(hw_c[0] != hw_i[0]){
                let x_value_c = xScaleComp(hw_c[1].compound)
                if(Math.abs(x_value_i - x_value_c) < 25 && hw_i[0].substring(2) > hw_c[0].substring(2)){
                    // console.log(hw_i[0] + " is too close to " + hw_c[0])
                    hw_c[1]['y_value'] = hw_c[1]['y_value'] - 15
                }
            }
        }
    }
    
    // * Adding the text
    // console.log(separated_array)
    vis.svg.selectAll('text')
        .data(keys, function(k){
            return k;
        })
        .enter()
        .append('text')
        .attr('class', 'slider-text')
        .attr('id', (k)=>{
            return 'text_'+k;
        })
        .text((d) =>{
            return d
        })
        .attr('x', (d, i) =>{
            // console.log(xScaleComp(separatedData[d].compound) - 5)
            return xScaleComp(separatedData[d].compound) - 7
        })
        .attr('y', (d) =>{
            // let array = Object.entries(separatedData);
            let y_value = 0
            for (hw of separated_array){
                if(hw[0] == d){
                    y_value = hw[1].y_value
                }
            }
            // console.log(separatedData)
            return y_value
        })
        .style('font-size', 13)
        .on('mouseover', (e) => hoverFunction(e, separatedData))
        .on('mouseout', () => unhoverFunction(separatedData));
}




SliderChart.prototype.transition = function(separatedData){
    let vis = this;
    
    let y = 70
    let hidden_y = -40
    let initial_text_y = 65
    let axis_y = 80

    let separated_array = Object.entries(separatedData);

    // * Adding test circles for neutral and negative homeworks

    // ? separatedData['test_neu'] = {'compound': 0}
    // ? separatedData['test_neg'] = {'compound': -.10}

    // vis.svg.selectAll('circle').remove()

  
    // vis.svg.selectAll('g').remove()
    // vis.svg.selectAll('text').remove()s
 

    // * send the keys as data so we have easy access to keys
    let keys = Object.keys(separatedData);

    // * Scale and axis stuff
    // let xScaleComp = d3.scaleLinear()
    //                     .domain([d3.min(keys, (d) => {return separatedData[d].compound -.02}),
    //                                 d3.max(keys, (d) => {return separatedData[d].compound + .02})])
    //                     .range([20, vis.svgWidth]);
    let xScaleComp = d3.scaleLinear()
                        .domain([d3.min(keys, (d) => {return separatedData[d].compound -.02}),
                                    d3.max(keys, (d) => {return separatedData[d].compound + .02})])
                        .range([20, vis.svgWidth]);

    let x_axis = d3.axisBottom()
        .scale(xScaleComp)

    let xScalePNN = d3.scaleLinear()
                        .domain([0,1])
                        .range([20, vis.svgWidth]);

    // *Adding the axis
    console.log(vis.svg.select("g"))
    vis.svg.select("g")
    // .attr('transform', 'translate(0,'+axis_y+')')
    .transition()
    .duration(1500)
    .call(x_axis);

    
    // * Joining rectangles and entering new ones
    vis.svg.selectAll('rect')
        // * Additional data function to match new data to correct rect elements
        .data(keys, function(k) {
            
            return this.id || 'rect_'+k;
        })
        .join(
            // * Specify what to do on an enter (rects that are entering)
            (enter) => {
                let rects = enter.append('rect')
                .attr('class', 'slider-rect')
                .attr('id', (k)=>{
                    return 'rect_'+k;
                })
                .attr('stroke', 'black')
                .attr('y', hidden_y)
                .attr('x', (d, i) =>{
                    return xScaleComp(separatedData[d].compound)
                })
                .attr('width', 10)
                .attr('height', 20)
                .attr('fill', (d) =>{
                    if (separatedData[d].compound > .05){
                        return '#29b674';
                    }
                    else if (separatedData[d].compound < -.05){
                        return '#AC3B61';
                    }
                    else {
                        return '#3badd3';
                    }
                });


            rects
            .on('mouseover', (e) => hoverFunction(e, separatedData))
            .on('mouseout', () => unhoverFunction(separatedData))

            rects
            .transition()
            .duration(1700)
            .attr("y", y)
            .selection()
            },
            
            // * Specify what to do on an update (rects that already exist)
            (update) => update.transition()
            .duration(1500)   
            .attr('x', (d, i) =>{
                return xScaleComp(separatedData[d].compound)
            })
            .attr('fill', (d) =>{
                if (separatedData[d].compound > .05){
                    return '#29b674';
                }
                else if (separatedData[d].compound < -.05){
                    return '#AC3B61';
                }
                else {
                     return '#3badd3';
                }
            })
            // need to set the y value here in case the user clicks quickly
            .attr('y', y),
            // * Specify what to do on an exit (rects that will be removed)
            // * Need to use .remove here because we need to remove the 
            // * Un-needed rect to invoke enter again when it is added back
            (exit) => exit.transition()
            .duration(1700)
            // ? Up or down?
            .attr("y", -30)
            .remove()
            
        )
        
    

    // * Finding proper y for text. Convert compound to the scale, then compare
    // * to see if the text will overlap
    // console.log(separated_array)
    // * Adding initial y value
    for (hw_i of separated_array){
        hw_i[1]['y_value'] = initial_text_y
    }
    for (hw_i of separated_array){
        let x_value_i = xScaleComp(hw_i[1].compound)
        // console.log(x_value_i)
        for (hw_c of separated_array){
            if(hw_c[0] != hw_i[0]){
                let x_value_c = xScaleComp(hw_c[1].compound)
                if(Math.abs(x_value_i - x_value_c) < 25 && hw_i[0].substring(2) > hw_c[0].substring(2)){
                    // console.log(hw_i[0] + " is too close to " + hw_c[0])
                    hw_c[1]['y_value'] = hw_c[1]['y_value'] - 15
                }
            }
        }
    }
    
    // * Adding the text
    console.log(separated_array)
    vis.svg.selectAll('.slider-text')
        // * Additional data function to match new data to correct text elements
        .data(keys, function(k) {
            return this.id || 'text_'+k;
        })
        .join(
            // * What to do on a text enter
            (enter) => {

                let text = enter.append('text')
                .style('font-size', 13)
                .text((d) =>{
                    return d
                })
                .attr('class', 'slider-text')
                .attr('id', (k)=>{
                    return 'text_'+k;
                })
                .attr('x', (d, i) =>{
                    // console.log(xScaleComp(separatedData[d].compound) - 5)
                    return xScaleComp(separatedData[d].compound) - 7
                })
                .attr('y', -40);

                text
                .transition()
                .duration(1700)
                .attr('y', (d) =>{
                    // let array = Object.entries(separatedData);
                    let y_value = 0
                    for (hw of separated_array){
                        if(hw[0] == d){
                            y_value = hw[1].y_value
                        }
                    }
                    // console.log(separatedData)
                    return y_value
                });


                text
                .on('mouseover', (e) => hoverFunction(e, separatedData))
                .on('mouseout', () => unhoverFunction(separatedData))

            },
            // * What to do on a text update
            (update) =>{
                update.transition()
                .duration(1500)
                .attr('x', (d, i) =>{
                    // console.log(xScaleComp(separatedData[d].compound) - 5)
                    return xScaleComp(separatedData[d].compound) - 7
                })
                .attr('y', (d) =>{
                    // let array = Object.entries(separatedData);
                    let y_value = 0
                    for (hw of separated_array){
                        if(hw[0] == d){
                            y_value = hw[1].y_value
                        }
                    }
                    // console.log(separatedData)
                    return y_value
            })
            },
            // * What to do on a text exit
            (exit) =>{
                exit.transition()
                .duration(1700)
                // ? Up or down?
                .attr("y", -40)
                .remove()
            } 
        )

}