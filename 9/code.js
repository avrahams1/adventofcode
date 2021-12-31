// window.rawInput = `
// 2199943210
// 3987894921
// 9856789892
// 8767896789
// 9899965678`;

const input = window.rawInput
    .trim()
    .split('\n')
    .map(line => [...line].map(Number))
    .reduce((prev, curr) => {
        prev.push(curr);
        return prev;
    }, []);

const dir_mat = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0]
];

function getNewIndices(dirMatElement, i, j) {
    return {
        newI: i + dirMatElement[0],
        newJ: j + dirMatElement[1]
    };
}

function getValueIfValid(i, j) {
    if (i < 0 || i >= input.length ||
        j < 0 || j >= input[0].length) {
            return Number.MAX_VALUE;
        }

    return input[i][j];
}

function getValueAt(dirMatElement, i, j) {
    const { newI, newJ } = getNewIndices(dirMatElement, i, j);

    return getValueIfValid(newI, newJ);
}

function indicesToString(i, j) {
    return `${i},${j}`;
}

function calcBasin(i, j, visited = new Set()) {
    const currValue = input[i][j];

    visited.add(indicesToString(i, j));

    if (currValue === 9) {
        return 0;
    }

    const otherDirsCount = dir_mat.reduce((prev, curr) => {
        const { newI, newJ } = getNewIndices(curr, i, j);

        if (visited.has(indicesToString(newI, newJ))) {
            return prev;
        }

        const nextValue = getValueIfValid(newI, newJ);
        
        if (nextValue === Number.MAX_VALUE ||
            currValue > nextValue) {
                return prev;
            }
        
        return prev + calcBasin(newI, newJ, visited);
    }, 0);

    return otherDirsCount + 1;
}

const sums = [];

for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input[i].length; j++) {
        const currValue = input[i][j];
        if (dir_mat.every(dirMatElement => currValue < getValueAt(dirMatElement, i, j))) {
            const basinSize = calcBasin(i, j);
            sums.push(basinSize);
        }
    }
}

sums.sort((a, b) => b - a);
const sum = sums[0] * sums[1] * sums[2];

console.log(sum);