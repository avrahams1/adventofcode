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

function createBlankMatrix(dimensions) {
    return Array(dimensions.y).fill().map(() => Array(dimensions.x).fill(false));
}

function calcNonEmptySpaces() {
    const { matrix } = input;
    let count = 0;
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            if (matrix[i][j]) count++;
        }
    }

    return count;
}

// console.log(input);

function fold(axis) {
    const { matrix } = input;
    let newMatrix;

    if (axis === 'x') {
        const foldingIndex = Math.floor(matrix[0].length / 2);
        newMatrix = createBlankMatrix({
            x: foldingIndex,
            y: matrix.length
        });

        for (let y = 0; y < newMatrix.length; y++) {
            for (let x = 0; x < newMatrix[y].length; x++) {
                newMatrix[y][x] = matrix[y][x] || matrix[y][matrix[y].length - x - 1];
            }
        }
    } else {
        const foldingIndex = Math.floor(matrix.length / 2);
        newMatrix = createBlankMatrix({
            x: matrix[0].length,
            y: foldingIndex
        });

        for (let y = 0; y < newMatrix.length; y++) {
            for (let x = 0; x < newMatrix[y].length; x++) {
                newMatrix[y][x] = matrix[y][x] || matrix[matrix.length - y - 1][x];
            }
        }
    }

    input.matrix = newMatrix;
}

// fold(input.instructions[0]);
input.instructions.forEach(fold);
// console.log(calcNonEmptySpaces());
(() => {
    const { matrix } = input;
    const matString = matrix.reduce((prev, line) => {
        return prev + line.reduce((prev, curr) => prev + (curr ? '#' : '.'), '') + '\n';
    }, '');
    console.log(matString);
})();