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

function canReachY(velocity, steps) {
    function canDescendToPoint(startY, targetY) {
        const result = Math.sqrt(1 + (8 * (startY - targetY)));
        return result === Math.round(result) && result % 2 === 1 && result;
    }

    const peakY = ((velocity * velocity) + velocity) / 2;
    const remainingSteps = steps - velocity;

    for (let y = input.minY; y <= input.maxY; y++) {
        const result = canDescendToPoint(peakY, y);
        if (result !== false && result >= remainingSteps) {
            return peakY;
        }
    }

    return false;
}

const possibleNumOfSteps = (() => {
    function getMinThrowX(targetX) {
        return Math.ceil(Math.abs(
            (1 - Math.sqrt(1 + 8 * targetX)) / 2
        ));
    }

    const minSteps = getMinThrowX(input.minX);
    const maxSteps = getMinThrowX(input.maxX);
    const arr = [];

    for (let i = maxSteps; i >= minSteps; i--) {
        arr.push(i);
    }

    return arr;
})();

const highestThrow = (() => {
    let count = 0;
    let highest = Number.MIN_VALUE;
    for (const numOfSteps of possibleNumOfSteps) {
        for (let i = 1; i < 1000; i++) {
            let currHighest = canReachY(i, numOfSteps);

            if (currHighest !== false) {
                // console.log('got', currHighest, 'for', { currVelocity:i, numOfSteps });
                highest = Math.max(highest, currHighest);
                count++;
            }
        }
    }

    return { highest, count };
})();

console.log(highestThrow);