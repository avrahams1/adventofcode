// window.rawInput = `
// 6,10
// 0,14
// 9,10
// 0,3
// 10,4
// 4,11
// 6,0
// 6,12
// 4,1
// 0,13
// 10,12
// 3,4
// 3,0
// 8,4
// 1,10
// 2,14
// 8,10
// 9,0

// fold along y=7
// fold along x=5`;

const input = (() => {
    const [rawCoords, rawInstructions] = window.rawInput
        .trim()
        .split('\n\n');

    const coords = rawCoords
        .split('\n')
        .map(line => line.split(','))
        .map(([x, y]) => ({
            x: Number(x),
            y: Number(y)
        }));
    
    const maxXY = coords.reduce((prev, curr) => {
        const currMaxX = Math.max(prev.x, curr.x);
        const currMaxY = Math.max(prev.y, curr.y);

        return {
            x: currMaxX,
            y: currMaxY
        };
    }, {
        x: Number.MIN_VALUE,
        y: Number.MIN_VALUE
    });

    const matrix = createBlankMatrix({
        x : maxXY.x + 1,
        y: maxXY.y + 1
    })

    coords.forEach(({x, y}) => matrix[y][x] = true);

    const instructions = rawInstructions
        .split('\n')
        .map(line => line.split(' '))
        .map(([fold, along, actualInstruction]) => actualInstruction.charAt(0));

    return {matrix, instructions};
})();
