const min = function (array) {
    return Math.min(...array);
}
const max = function (array) {
    return Math.max(...array);
}
export function Force(canvas, data, properties) {
    let graph = {
        draw: function() {
            const { width, height, flags } = properties;
            const margin = { bottom: 10, top: 10, right: 10, left: 10 };
            const w = width - margin.right - margin.left;
            const h = height - margin.bottom - margin.top;
            let svg = d3.select('#' + canvas).append('svg').attr('width', width).attr('height', height);
            let simulation = d3.forceSimulation();

            d3.json(data, function(error, json) {
                if(error) { throw error; }
                let nodes = json.nodes;
                let links = json.links;
                const common = links.map(link => link.commonFriends);
                const color = d3.scaleOrdinal(d3.schemeCategory20)
                const colorScale = d3.scaleSequential(d3.interpolateBlues).domain([min(common), max(common)]);

                simulation
                    .nodes(nodes)
                    .force('links', d3.forceLink(links).distance(300))
                    .force('charge', d3.forceManyBody().strength(-100))
                    .force('center', d3.forceCenter(w / 2, h / 2))
                    .force('x', d3.forceX(w / 2))
                    .force('y', d3.forceY(h / 2))
                    .on('tick', ticked);
                let link = svg.append('g')
                    .attr('class', 'links')
                    .selectAll('line')
                    .data(links)
                    .enter().append('line')
                    .style('stroke', d => colorScale(d.commonFriends))
                    .attr('stroke-width', 3);
                    
                let node = svg.append('g')
                    .attr('class', 'nodes')
                    .selectAll('g')
                    .data(nodes)
                    .enter()
                    .append('g');
                let circles = node.append('circle')
                    .attr('r', 25)
                    .attr('fill', d => color(d.index))
                    .attr('stroke', 'lightgray')
                    .attr('stroke-width', 2);
                let labels = node.append('text')
                    .attr('x', -5)
                    .attr('y', 3)
                    .style('color', 'black')
                    .text(d => d.name);
                node.append('title')
                    .text(d => d.name)
                circles.call(d3.drag()
                            .on("start", dragstarted)
                            .on("drag", dragged)
                            .on("end", dragended));
                
                function ticked() {
                    node.attr("transform", d => "translate(" + d.x + "," + d.y + ")");
                        
                    link
                        .attr('x1', d => d.source.x)
                        .attr('y1', d => d.source.y)
                        .attr('x2', d => d.target.x)
                        .attr('y2', d => d.target.y)
                }

                function dragstarted(d) {
                    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
                    d.fx = d.x;
                    d.fy = d.y;
                }
        
                function dragged(d) {
                    d.fx = d3.event.x;
                    d.fy = d3.event.y;
                }
        
                function dragended(d) {
                    if (!d3.event.active) simulation.alphaTarget(0);
                    d.fx = null;
                    d.fy = null;
                } 
            });
        }
    }
    return graph;
}