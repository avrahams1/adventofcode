// rawInput = `target area: x=20..30, y=-10..-5`;

const input = (() => {
    const values = rawInput
        .substring('target area: '.length)
        .split(', ')
        .map(coord => coord.substring(2))
        .map(coord => coord.split('..'))
        .map(([min, max]) => [+min, +max]);

    const [[minX, maxX], [minY, maxY]] = values;

    return {
        minX,
        maxX,
        minY: minY,
        maxY: maxY
    };
})();