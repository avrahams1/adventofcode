// rawInput = `target area: x=20..30, y=-10..-5`;

const input = (() => {
    const values = rawInput
        .substring('target area: '.length)
        .split(', ')
        .map(coord => coord.substring(2))
        .map(coord => coord.split('..'))
        .map(([min, max]) => [+min, +max]);
    
    const [[minX, maxX], [minY, maxY]] = values;
    const yCorrection = minY + 1;

    return {
        minX,
        maxX,
        minY: minY + yCorrection,
        maxY: maxY + yCorrection,
        yCorrection
    };
})();

function getMinThrowX(targetX) {
    return Math.ceil(Math.abs(
        (1 - Math.sqrt(1 + 8 * targetX)) / 2
    ));
}

const possibleNumOfSteps = (() => {
    const minSteps = getMinThrowX(input.minX);
    const maxSteps = getMinThrowX(input.maxX);
    const arr = [];

    for (let i = maxSteps; i >= minSteps ; i--) {
        arr.push(i);
    }

    return arr;
})();

console.log(possibleNumOfSteps);