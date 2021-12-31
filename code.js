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