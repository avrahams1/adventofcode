// window.rawInput = `
// 5483143223
// 2745854711
// 5264556173
// 6141336146
// 6357385478
// 4167524645
// 2176841721
// 6882881134
// 4846848554
// 5283751526`;

// window.rawInput = `
// 11111
// 19991
// 19191
// 19991
// 11111`;

const input = window.rawInput
    .trim()
    .split('\n')
    .map(line => [...line].map(Number));

const dir_mat = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
    [-1, -1],
    [-1, 1],
    [1, -1],
    [1, 1]
];

function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

function indicesToString(i, j) {
    return `${i},${j}`;
}

function stringToIndices(str) {
    return {
        i: +str.charAt(0),
        j: +str.charAt(2)
    };
}

function iterate(fn) {
    for (let i = 0; i < input.length; i++) {
        for (let j = 0; j < input[i].length; j++) {
            fn({
                input, 
                i, 
                j, 
                value: input[i][j]
            });
        }
    }
}

function areIndicesValid(i, j) {
    return !(i < 0 || i >= input.length ||
        j < 0 || j >= input[i].length);
}

function step() {
    increaseAllEnergyLevels();
    const flashedIndices = calcFlashes();
    resetFlashed(flashedIndices);

    return flashedIndices.size == input.length * input[0].length;
}

function increaseAllEnergyLevels() {
    iterate(({input, i, j}) => input[i][j]++);
}

function calcFlashes() {
    const flashedIndices = new Set();

    iterate(({i, j, value}) => {
        if (value > 9) {
            flash(i, j, flashedIndices);
        }
    });

    return flashedIndices;
}

function flash(i, j, flashedIndices) {
    const stringIndices = indicesToString(i, j);
    if (flashedIndices.has(stringIndices)) return;

    flashedIndices.add(stringIndices);
    
    dir_mat
        .map(([diffI, diffJ]) => [i + diffI, j + diffJ ])
        .filter(indices => areIndicesValid(...indices))
        .filter(indices => {
            const indicesString = indicesToString(...indices);
            return !flashedIndices.has(indicesString);
        })
        .forEach(([newI, newJ]) => {
            // if (newI == 0 && [1, 2].includes(newJ)) {
            //     console.log('incrementing (%d, %d) from (%d, %d), %d -> %d', newI, newJ, i, j,input[newI][newJ],input[newI][newJ]+1);
            // }

            input[newI][newJ]++;

            if (input[newI][newJ] > 9) {
                flash(newI, newJ, flashedIndices);
            }
        })
}

function resetFlashed(flashedIndices) {
    for (const stringIndices of flashedIndices) {
        const {i, j} = stringToIndices(stringIndices);
        input[i][j] = 0;
    }
}

function printMat() {
    // console.log(input.reduce((prev, row) => {
    //     return prev + row.reduce((prev, item) => prev + item + ' ', '') + '\n';
    // }, ''));
}

let numOfFlashes = 0;

let i;
for (i = 0;; i++) {
    if (step()) break;
}

console.log(i + 1);