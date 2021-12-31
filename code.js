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

function getValueAt(dirMatElement, i, j) {
    const newI = i + dirMatElement[0];
    const newJ = j + dirMatElement[1];

    if (newI < 0 || newI >= input.length ||
        newJ < 0 || newJ >= input[0].length) {
            return Number.MAX_VALUE;
        }

    return input[newI][newJ];
}

let sum = 0;

for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input[i].length; j++) {
        const currValue = input[i][j];
        if (dir_mat.every(dirMatElement => currValue < getValueAt(dirMatElement, i, j))) {
            // debugger;
            sum += currValue + 1;
        }
    }
}

console.log(sum);