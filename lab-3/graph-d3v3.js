const min = function (array) {
    return Math.min(...array);
}
const max = function (array) {
    return Math.max(...array);
}
export function Graph(canvas, data, properties) {
    let graph = {
        draw: function () {
            const { width, height, flags } = properties;
            const margin = { bottom: 100, top: 100, right: 100, left: 100 };
            const w = width - margin.right - margin.left;
            const h = height - margin.bottom - margin.top;
            const svg = d3.select('#' + canvas).append('svg').attr('width', width).attr('height', height);

            const force = d3.layout.force()
                .gravity(.05)
                .distance(400)
                .charge(-400)
                .size([width, height]);

            d3.json(data, function(graph) {

                const nodes = graph.nodes;
                const links = graph.links;
                const common = links.map(link => link.commonFriends);
                const scale = function(d) {
                    /**
                     * This scale maps number of common friends into stoke-width.
                     * Stroke width is between 1 and 15, 1 for the minimum number of friends and 
                     * 15 for the maximum number of friends.
                     */
                    return 1 + 14 * (d - min(common)) / (max(common) - min(common));
                }

                force
                    .nodes(nodes)
                    .links(links)
                    .start();

                const link = svg.selectAll('.link')
                    .data(links)
                    .enter().append('line')
                    .attr('class', 'link')
                    .style('stroke', 'lightgray')
                    .style('stroke-width', d => scale(d.commonFriends));

                const node = svg.selectAll('.node')
                    .data(nodes)
                    .enter().append('g')
                    .attr('class', 'node')
                    .call(force.drag);

                node.append('circle')
                    .attr('r', '25')
                    .style('fill', '#026399');

                node.append('text')
                    .attr('dx', 0)
                    .attr('dy', 0)
                    .style('fill', '#E6D300')
                    .text(function (d) { return d.name });

                force.on('tick', function () {
                    link.attr('x1', function (d) { return d.source.x; })
                        .attr('y1', function (d) { return d.source.y; })
                        .attr('x2', function (d) { return d.target.x; })
                        .attr('y2', function (d) { return d.target.y; });

                    node.attr('transform', function (d) { return 'translate(' + d.x + ',' + d.y + ')'; });
                });
            });
        }
    }
    return graph;
}