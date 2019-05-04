
import { min, max, box, baseLine, transformOrdinalX, transformY } from './scale.js';

export function BarChart(canvasId, dataset, properties) {
    
    let newBarChart = {
        draw: function() {

            const margin = { left: 50, top: 50, right: 50, bottom: 50 };
            const { width, height } = properties;
            const x = function(i) { return transformOrdinalX(i, dataset, width, margin); }
            const y = function(d) { return transformY(d, dataset, height, margin); }

            const delta = width / dataset.length;
            const barWidthScale = 0.75;
            const barWidth = barWidthScale * delta;

            const svg = d3.select('#' + canvasId).append('svg');
            svg.attr('class', 'bar-chart')
                .attr('width', width)
                .attr('height', height);

            
            box(svg, dataset, width, height, margin, { left: true, right: true, top: true, bottom: true, ordinal: true, xTicks: false, yTicks: true });
            svg.append('g')
                .selectAll('rect').data(dataset)
                .enter()
                .append('rect')
                .attr('class', (d, i) => 'bar bar-' + i)
                .attr('width', barWidth)
                .attr('height', (d) => (d >= 0) ? y(0) - y(d) : y(d) - y(0))
                .attr('x', (d, i) => x(i))
                .attr('y', (d) => (d >= 0) ? y(d) : y(0))
                .on('mouseover', doMouseOver)
                .on('mouseout', doMouseOut);

            baseLine(svg, dataset, width, height, margin);

            function doMouseOver(d, i) {
                svg.append('text').text(d).attr('id', 'bar-' + i)
                    .classed('highlighted', true)
                    .attr('x', x(i) + barWidth / 4)
                    .attr('y', (d > 0) ? y(d) - 3 : y(d) + 13);
                svg.select('.bar-' + i).classed('highlighted', true);
            }
            function doMouseOut(d, i) {
                svg.select('#bar-' + i).remove();
                svg.select('.bar-' + i).classed('highlighted', false);
            }  
        }
    }
    return newBarChart;
}

const yAxis = function (svg, dataset, width, height, margin, flags) {
    if(min(dataset) >= 0) {
        axes.append('line')
            .attr('class', 'axis')
            .attr('x1', x)
            .attr('y1', y0)
            .attr('x2', x)
            .attr('y2', margin.top);
    } else if(max(dataset) < 0) {
        axes.append('line')
            .attr('class', 'axis')
            .attr('x1', x)
            .attr('y1', y0)
            .attr('x2', x)
            .attr('y2', height - margin.bottom);
    } else {
        axes.append('line')
            .attr('class', 'axis')
            .attr('x1', x)
            .attr('y1', y0)
            .attr('x2', x)
            .attr('y2', margin.top);
        axes.append('line')
            .attr('class', 'axis')
            .attr('x1', x)
            .attr('y1', y0)
            .attr('x2', x)
            .attr('y2', height - margin.bottom)
    }
}
