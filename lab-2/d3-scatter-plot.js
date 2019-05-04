
import {
    transformX,
    transformY,
    axes,
    grid,
    xList,
    yList,
    box
} from './scale.js';

export function ScatterPlot(canvasId, dataset, properties) {
    let newScatterPlot = {
        draw: function() {
            const margin = { left: 15, top: 15, right: 15, bottom: 15 };

            const { width, height, flags } = properties;

            const r = 3;
            const x = function(d) { return transformX(d, xList(dataset), width, margin); }
            const y = function(d) { return transformY(d, yList(dataset), height, margin); }

            const svg = d3.select('#' + canvasId).append('svg');
            svg.attr('width', width)
                .attr('height', height)
                .attr('class', 'scatter-plot');

            if(flags.grid) { grid(svg, dataset, width, height, margin, { horizontal: true, vertical: true }); }

            if (x(0) < 0 || x(0) > width || y(0) < 0 || y(0) > height) {
                /** Origin is out of canvas bound. */
                box(svg, dataset, width, height, margin, { left: true, right: true, top: true, bottom: true, ordinal: false, xTicks: true, yTicks: true })
            } else {
                axes(svg, dataset, width, height, margin, { ordinal: false })
            }

            svg.append('g')
                .selectAll('circle').data(dataset)
                .enter()
                .append('circle')
                .attr('class', 'dot')
                .attr('cx', d => x(d.x))
                .attr('cy', d => y(d.y))
                .attr('r', r)
                .on('mouseover', doMouseOver)
                .on('mouseout', doMouseOut);

            function doMouseOver(d, i) {
                d3.select(this).classed('highlighted', true).attr('r', r * 1.5);
                svg.append('text').text('(' + d.x + ',' + d.y + ')')
                    .attr('id', 't-' + d.x + '-' + d.y + '-' + i)
                    .attr('x', () => x(d.x) - 10)
                    .attr('y', () => y(d.y))
                    .attr('fill', 'white')
                    .classed('pop-up-coordinate', true)
            }
            function doMouseOut(d, i) {
                d3.select(this).classed('highlighted', false).attr('r', r);
                d3.select('#t-' + d.x + '-' + d.y + '-' + i).remove();
            }
        }

    }
    return newScatterPlot;
}