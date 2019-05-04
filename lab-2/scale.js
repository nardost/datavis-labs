/**
 * A library of functions, among which are 
 * linear transformations that mimick d3's scales.
 */

export const xList = function (d) { return d.map((v) => v.x); }
export const yList = function (d) { return d.map((v) => v.y); }
export const min = function (array) {
    return Math.min(...array);
}
export const max = function (array) {
    return Math.max(...array);
}

export const transformOrdinalX = function (i, dataset, width, margin) {
    return margin.left + i * ((width - margin.left - margin.right) / dataset.length);
}

export const transformX = function (d, xList, width, margin) {
    return margin.left + (d - min(xList)) * (width - margin.right - margin.left) / (max(xList) - min(xList));
}

export const transformY = function (d, dataset, height, margin) {
    return margin.top + (d - max(dataset)) * ((height - margin.bottom - margin.top) / (min(dataset) - max(dataset)));
}

export const inverseTransformX = function(x, xList, width, margin) {
    return min(xList) + (x - margin.left) * (max(xList) - min(xList)) / (width - margin.right - margin.left);
}
export const inverseTransformY = function(y, yList, height, margin) {
    return max(yList) + (y - margin.top) * (min(yList) - max(yList)) / (height - margin.bottom - margin.top);
}

export const axes = function(svg, dataset, width, height, margin, flags) {
    const x = function (i) { return transformX(i, xList(dataset), width, margin); }
    const y = function (d) { return transformY(d, yList(dataset), height, margin); }
    const axes = svg.append('g');
    const N = 10; //Number of ticks... Could be a parameter...
    if(!flags.ordinal) { //Axes for Scatter Plots
        axes.append('g')
            .append('line')
            .attr('class', 'axis')
            .attr('x1', x(0))
            .attr('y1', 0)
            .attr('x2', x(0))
            .attr('y2', height);
        let list = (flags.ordinal) ? dataset : yList(dataset);
        ticks(svg, list, width, height, margin, x(0), 0, x(0), height, N);
        axes.append('g')
            .append('line')
            .attr('class', 'axis')
            .attr('x1', 0)
            .attr('y1', y(0))
            .attr('x2', width)
            .attr('y2', y(0));
        list = (flags.ordinal) ? dataset : xList(dataset);
        ticks(svg, list, width, height, margin, 0, y(0), width, y(0), N);
    } else {//Axes for Bar Graphs and Line Graphs
        const y0 = transformY(0, dataset, height, margin);
        if (flags.left) {
            svg.append('g')
                .append('line')
                .attr('class', 'axis')
                .attr('x1', 0)
                .attr('y1', y0)
                .attr('x2', 0)
                .attr('y2', 0);
            ticks(svg, dataset, width, height, margin, 0, y0, 0, 0, N);
            svg.append('g')
                .append('line')
                .attr('class', 'axis')
                .attr('x1', 0)
                .attr('y1', y0)
                .attr('x2', 0)
                .attr('y2', height);
            ticks(svg, dataset, width, height, margin, 0, y0, 0, height, N);
        }
        if (flags.right) {
            svg.append('g')
                .append('line')
                .attr('class', 'axis')
                .attr('x1', width)
                .attr('y1', y0)
                .attr('x2', width)
                .attr('y2', 0);
            ticks(svg, dataset, width, height, margin, width, y0, width, 0, N);
            svg.append('g')
                .append('line')
                .attr('class', 'axis')
                .attr('x1', width)
                .attr('y1', y0)
                .attr('x2', width)
                .attr('y2', height);
            ticks(svg, dataset, width, height, margin, width, y0, width, height, N);
        }
    }
}


/**
 * Baseline for Bar Graphs and Line Graphs (Ordinal Data)/
 * @param {*} svg 
 * @param {*} dataset 
 * @param {*} width 
 * @param {*} height 
 * @param {*} margin 
 */
export const baseLine = function (svg, dataset, width, height, margin) {
    const y0 = transformY(0, dataset, height, margin);
    let axes = svg.append('g');
    axes.append('line')
        .attr('x1', 0)
        .attr('class', 'axis')
        .attr('y1', y0)
        .attr('x2', width)
        .attr('y2', y0);
}

export const ticks = function(svg, dataset, width, height, margin, x1, y1, x2, y2, n) {
    if (x1 != x2 && y1 == y2) {
        let delta = (width - margin.left - margin.right) / n;
        let a = [];
        for (let i = 0; i < n; i++) { a[i] = i; }
        svg.append('g').selectAll('line').data(a).enter()
            .append('line')
            .attr('class', 'ticks')
            .attr('x1', (d) => d * delta)
            .attr('y1', y1)
            .attr('x2', (d) => d * delta)
            .attr('y2', y1 - 5)

        svg.append('g').selectAll('text').data(a).enter()
            .append('text')
            .attr('x', (d) => d * delta)
            .attr('y', y1 - 6)
            .text((d) => inverseTransformX(d * delta, dataset, width, margin))
            .attr('fill', 'darkgray')
            .attr('font-size', '.5em')
    }

    if (y1 != y2 && x1 == x2) {
        let delta = (height - margin.top - margin.bottom) / n;
        let a = [];
        for (let i = 0; i < n; i++) { a[i] = i; }
        svg.append('g').selectAll('line').data(a).enter()
            .append('line')
            .attr('class', 'ticks')
            .attr('y1', (d) => d * delta)
            .attr('x1', x1)
            .attr('y2', (d) => d * delta)
            .attr('x2', x1 + 6)
        svg.append('g').selectAll('text').data(a).enter()
            .append('text')
            .attr('y', (d) => d * delta)
            .attr('x', x1 + 6)
            .text((d) => inverseTransformY(d * delta, dataset, height, margin))
            .attr('fill', 'darkgray')
            .attr('font-size', '.5em')
    }
}

export const grid = function(svg, dataset, width, height, margin, flags) {
    const x = function (d) { return transformX(d, xList(dataset), width, margin); }
    const y = function (d) { return transformY(d, yList(dataset), height, margin); }
    if (flags.vertical) {
        svg.append('g').selectAll('line').data(dataset).enter()
            .append('line')
            .attr('class', 'grid')
            .attr('x1', (d, i) => x(d.x))
            .attr('y1', 0)
            .attr('x2', (d, i) => x(d.x))
            .attr('y2', height)
    }

    if (flags.horizontal) {
        svg.append('g').selectAll('line').data(dataset).enter()
            .append('line')
            .attr('class', 'grid')
            .attr('y1', (d, i) => y(d.y))
            .attr('x1', 0)
            .attr('y2', (d, i) => y(d.y))
            .attr('x2', width)
    }
}

export const gridOrdinal = function (svg, dataset, width, height, margin, flags) {
    const x = function (i) { return transformOrdinalX(i, dataset, width, margin); }
    const y = function (d) { return transformY(d, dataset, height, margin); }
    if (flags.vertical) {
        svg.append('g').selectAll('line').data(dataset).enter()
            .append('line')
            .attr('class', 'grid')
            .attr('x1', (d, i) => x(i))
            .attr('y1', 0)
            .attr('x2', (d, i) => x(i))
            .attr('y2', height)
    }

    if (flags.horizontal) {
        svg.append('g').selectAll('line').data(dataset).enter()
            .append('line')
            .attr('class', 'grid')
            .attr('y1', (d, i) => y(d))
            .attr('x1', 0)
            .attr('y2', (d, i) => y(d))
            .attr('x2', width)
    }
}

export const box = function(svg, dataset, width, height, margin, flags) {
    const N = 5; //number of ticks .... bad idea.
    console.log(flags)
    if (flags.left) {
        svg.append('g')
            .append('line')
            .attr('class', 'axis')
            .attr('x1', 0)
            .attr('y1', 0)
            .attr('x2', 0)
            .attr('y2', height);
        if (flags.yTicks) {
            let list = (flags.ordinal) ? dataset : xList(dataset);
            ticks(svg, list, width, height, margin, 0, 0, 0, height, N);
        }
    }
    if (flags.bottom) {
        svg.append('g')
            .append('line')
            .attr('class', 'axis')
            .attr('x1', 0)
            .attr('y1', height)
            .attr('x2', width)
            .attr('y2', height);
        if (flags.xTicks) {
            let list = (flags.ordinal) ? dataset : xList(dataset);
            ticks(svg, list, width, height, margin, 0, height, width, height, N);
        }
    }
    if (flags.right) {
        svg.append('g')
            .append('line')
            .attr('class', 'axis')
            .attr('x1', width)
            .attr('y1', 0)
            .attr('x2', width)
            .attr('y2', height);
        if (flags.yTicks) {
            let list = (flags.ordinal) ? dataset : xList(dataset);
            ticks(svg, list, width, height, margin, width, 0, width, height, N);
        }
    }
    if (flags.top) {
        svg.append('g')
            .append('line')
            .attr('class', 'axis')
            .attr('x1', 0)
            .attr('y1', 0)
            .attr('x2', width)
            .attr('y2', 0);
        if (flags.xTicks) {
            let list = (flags.ordinal) ? dataset : xList(dataset);
            ticks(svg, list, width, height, margin, 0, 0, width, 0, N);
        }
    }
}