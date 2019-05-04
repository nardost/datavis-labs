
import { transformOrdinalX, transformY, gridOrdinal, axes, box, baseLine } from './scale.js';

export function LineChart(canvasId, dataset, properties) {

    let newLineChart = {

        draw: function() {

            const margin = { left: 10, top: 10, right: 10, bottom: 10 };
            const { width, height, flags } = properties;
            const lineWidth = 1;
            const dotRadius = 2;
            const svg = d3.select('#' + canvasId).append('svg');

            svg.attr('class', 'line-chart')
                .attr('width', width)
                .attr('height', height);

            if (flags.grid) { gridOrdinal(svg, dataset, width, height, margin, { horizontal: true, vertical: true }); }

            const x = function (i) { return transformOrdinalX(i, dataset, width, margin); }
            const y = function (d) { return transformY(d, dataset, height, margin); }
            svg.append('g')
                .selectAll('line').data(dataset)
                .enter()
                .append('line')
                .attr('class', 'line')
                .attr('stroke-width', lineWidth)
                .attr('x1', (d, i) => x(i))
                .attr('y1', (d) => y(d))
                .attr('x2', (d, i) => (i < dataset.length - 1) ? x(i + 1) : x(i))
                .attr('y2', (d, i) => (i < dataset.length - 1) ? y(dataset[i + 1]) : y(dataset[i]));

            baseLine(svg, dataset, width, height, margin);
            if (y(0) < 0 || y(0) > height) {
                /** Origin is out of canvas bound. */
                box(svg, dataset, width, height, margin, { bottom: true, top: true, left: true, right: true, ordinal: true, xTicks: false });
            } else {
                axes(svg, dataset, width, height, margin, { left: true, ordinal: true });
            }
            
            const delta = (width - margin.left - margin.right ) / dataset.length;
            if (delta > 5 * dotRadius) {
                svg.append('g')
                    .selectAll('circle').data(dataset)
                    .enter()
                    .append('circle')
                    .attr('class', 'dot')
                    .attr('r', dotRadius)
                    .attr('cx', (d, i) => x(i))
                    .attr('cy', (d, i) => y(dataset[i]))
                    .on('mouseover', doMouseOver)
                    .on('mouseout', doMouseOut);
            }

            function doMouseOver(d, i) {
                d3.select(this).classed('highlighted', true).attr('r', dotRadius * 1.5);
                svg.append('text').text(d)
                    .attr('id', 't-' + i)
                    .attr('x', () => x(i) + 2)
                    .attr('y', () => y(dataset[i]) - 2)
                    .classed('pop-up-coordinate', true)
            }
            function doMouseOut(d, i) {
                d3.select(this).classed('highlighted', false).attr('r', dotRadius);
                d3.select('#t-' + i).remove();
            }
        }
    }
    return newLineChart;
}