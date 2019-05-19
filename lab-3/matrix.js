const min = function (array) {
    return Math.min(...array);
}
const max = function (array) {
    return Math.max(...array);
}
export function Matrix(canvas, data, properties) {
    let matrix = {
        draw: function() {
            const { width, height, flags} = properties;
            const margin = { bottom: 10, top: 10, right: 10, left: 10 };
            const w = width - margin.right - margin.left;
            const h = height - margin.bottom - margin.top;
            const svg = d3.select('#' + canvas).append('svg').attr('width', width).attr('height', height);
            const matrix = [];
            d3.json(data)
                .then(adjacency => {
                    const nodes = adjacency.nodes;
                    const links = adjacency.links;
                    const common = links.map(link => link.commonFriends);
                    const colorScale = d3.scaleSequential(d3.interpolateBlues).domain([min(common), max(common)]);
                    const dimension = nodes.length;
                    const x = d3.scaleBand().domain(nodes).range([0, w]);
                    const z = d3.scaleLinear().domain([0,1]).clamp(true);
                    const cellWidth = w / dimension;
                    const cellHeight = h / dimension;
                    const labels = svg.append('g').attr('class', 'label')
                    const chart = svg.append('g').attr('class', 'matrix');
                    const tx = 50;
                    const ty = 50;

                    nodes.forEach((node, i) => {
                        node.index = i;
                        let r = d3.range(dimension).map(j => ({ x: j, y: i, z: false }) );
                        r.forEach((cell, j) => {
                            matrix[i * dimension + j] = cell;
                        })
                    });
                    links.forEach((link) => {
                        matrix[link.source * dimension + link.target].commonFriends = link.commonFriends;
                        matrix[link.target * dimension + link.source].commonFriends = link.commonFriends;
                        matrix[link.source * dimension + link.target].z = true;
                        matrix[link.target * dimension + link.source].z = true;
                    });

                    chart.selectAll('rect').data(matrix)
                        .enter()
                        .append('rect')
                        .attr('class', (d, k) => 'cell r-' + d.y + ' c-' + d.x)
                        .attr('width', cellWidth)
                        .attr('height', cellHeight)
                        .attr('stroke', 'lightgray')
                        .attr('x', (d, k) => d.x * cellWidth)
                        .attr('y', (d, k) => d.y * cellHeight)
                        .style('fill', d => (d.z) ? colorScale(d.commonFriends) : 'none')
                        .attr('transform', (d, i) => { return 'translate(' + tx + ' ' + ty + ')'; });
                        
                    labels.append('g').selectAll('rect').data(matrix.filter(cell => cell.x == 0))
                        .enter()
                        .append('text')
                        .attr('class', 'label')
                        .attr('y', (d, i) => d.y * cellHeight + cellHeight / 2 + ty + 4)
                        .attr('x', tx - 6)
                        .attr('dy', '.32em')
                        .attr('text-anchor', 'end')
                        .text((d, i) => nodes[i].name)
                    
                    labels.append('g').selectAll('rect').data(matrix.filter(cell => cell.y == 0))
                        .enter()
                        .append('text')
                        .attr('class', 'label')
                        .attr('x', (d, i) => 5 + tx + d.x * cellWidth + cellWidth / 2)
                        .attr('y', ty-6)
                        .attr('dy', '.32em')
                        .attr('text-anchor', 'start')
                        .text((d, i) => nodes[i].name)
                        .attr('transform', (d, i) => { return 'rotate(-90 ' + (5 + tx + d.x * cellWidth + cellWidth / 2) + ' ' + (ty - 6) + ') translate (7' + ' ' + '-5)'; })
                    
            });
        }
    }
    return matrix;
}