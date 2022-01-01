function createBlankMatrix(dimensions, defaultValue) {
    return Array(dimensions.y).fill().map(() => Array(dimensions.x).fill(defaultValue));
}

function createBlankArray(size, defaultValue) {
    return Array(size).fill(defaultValue);
}

function iterateArray(arr, fn) {
    arr.forEach((value, index, arr) => fn({
        value,
        index,
        arr
    }));
}

function iterateMatrix(mat, fn) {
    mat.forEach((row, i) => {
        row.forEach((value, j) => {
            fn({
                value,
                i,
                j,
                mat
            });
        });
    });
}

function matrixToString(mat, fn) {
    return mat.reduce(
        (prev, row) => 
            prev + row.reduce((prev, value) => 
                prev + fn(value), '') + '\n', 
        '');
}