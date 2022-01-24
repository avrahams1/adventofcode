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

function isInteger(num) {
    return num === Math.round(num);
}

function canReachY(velocity, steps, exactStepsMatch = false) {
    const { sy, remainingSteps, a1 } = (() => {
        if (velocity > 0) {
            const peakY = ((velocity * velocity) + velocity) / 2;
            const remainingSteps = steps - velocity;
            return {
                sy: peakY,
                remainingSteps,
                a1: 0
            };
        } else {
            return {
                sy: 0,
                a1: velocity,
                remainingSteps: steps
            };
        }
    })();

    for (let targetY = input.minY; targetY <= input.maxY; targetY++) {
        const sqrtExpr = (() => {
            const bSquared = 4 * a1 * (a1 + 1) + 1;
            const fourAC = 8 * (sy - targetY);
            return bSquared + fourAC;
        })();

        if (sqrtExpr <= 0) {
            continue;
        }

        const sqrt = Math.sqrt(sqrtExpr);

        if (!isInteger(sqrt)) {
            continue;
        }

        const totalExprValue = (() => {
            return ((-2 * a1) - 1 - sqrt) / -2.0;
        })();

        const isMatch = exactStepsMatch ? totalExprValue === remainingSteps : totalExprValue >= remainingSteps;

        if (isMatch) return true;
    }

     return false;
}

function canReachX(velocy, target) {
    const sqrtValue = (() => {
        const bSquared = (4 * velocy * (velocy + 1)) + 1;
        const fourAC = 8 * target;
        return bSquared - fourAC;
    })();

    if (sqrtValue <= 0) {
        return false;
    }

    const sqrt = Math.sqrt(sqrtValue);

    if (!isInteger(sqrt)) {
        return false;
    }

    const result = ((-2 * velocy) - 1 + sqrt) / -2.0;

    if (!isInteger(result) || result <= 0) {
        console.log('wtf result', { velocy, target, result });
        return false;
    }

    return result;
}

const foundPoints = (() => {
    const foundPoints = new Set();

    for (let currX = 1; currX <= input.maxX; currX++) {
        for (let targetX = input.minX; targetX <= input.maxX; targetX++) {
            const xSteps = canReachX(currX, targetX);

            if (xSteps === false) continue;

            for (let currY = input.minY; currY <= 1000; currY++) {
                if (foundPoints.has(pointToString({ x: currX, y: currY }))) {
                    continue;
                }

                const ySteps = canReachY(currY, xSteps, xSteps !== currX);

                if (ySteps !== false) {
                    foundPoints.add(pointToString({ x: currX, y: currY }));
                }
            }
        }
    }

    return foundPoints;
})();

function pointToString(coords) {
    return `${coords.x},${coords.y}`;
}

console.log(foundPoints.size);