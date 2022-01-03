// rawInput = `9C0141080250320F1802104A08`;

const input = (() => {
    return [...rawInput].map(hexChar => parseInt(hexChar, 16).toString(2).padStart(4, '0')).join('');
})();

const HEADER_LEN = 6;

function readHeader(position) {
    return {
        version: parseInt(input.substr(position, 3), 2),
        typeId: parseInt(input.substr(position + 3, 3), 2)
    }
}

function parseLiteralValue(position) {
    let sum = 0n;
    let shouldReadFurther = true;

    while (shouldReadFurther) {
        shouldReadFurther = input.charAt(position) === '1';
        const currVal = BigInt(parseInt(input.substr(position + 1, 4), 2));
        sum = (sum << 4n) | currVal;
        position += 5;
    }

    return { newPosition: position, result: sum };
}

function parseOperator(position, typeId) {
    const lengthTypeId = input.charAt(position++);
    const values = [];

    if (lengthTypeId === '0') {
        const subPackestLength = parseInt(input.substr(position, 15), 2);
        position += 15;

        const originalPosition = position;
        while (position - originalPosition < subPackestLength) {
            const { newPosition, result } = parsePacket(position);
            position = newPosition;
            values.push(result);
        }
        
        if (position - originalPosition !== subPackestLength) throw new Error('nooo');
    } else {
        const numOfSubPackets = parseInt(input.substr(position, 11), 2);
        position += 11;

        for (let i = 0; i < numOfSubPackets; i++) {
            const { newPosition, result } = parsePacket(position);
            position = newPosition;
            values.push(result);
        }
    }

    return {
        result: calcResult(typeId, values),
        newPosition: position
    }
}

function calcResult(typeId, values) {
    switch (typeId) {
        case 0:
            return values.reduce((prev, curr) => prev + curr, 0n);
        case 1:
            return values.reduce((prev, curr) => prev * curr, 1n);
        case 2:
            return values.reduce(bigIntMin, values[0]);
        case 3:
            return values.reduce(bigIntMax, values[0]);
        case 5:
            return values[0] > values[1] ? 1n : 0n;
        case 6:
            return values[0] < values[1] ? 1n : 0n;
        case 7:
            return values[0] === values[1] ? 1n : 0n;
        default: throw new Error('noooooo');
    }
}

function bigIntMax(a, b) {
    return a > b ? a : b;
}

function bigIntMin(a, b) {
    return a < b ? a : b;
}

function parsePacket(position) {
    const { typeId } = readHeader(position);
    position += HEADER_LEN;

    let result = (typeId === 4 ? parseLiteralValue : parseOperator)(position, typeId);

    return result;
}

const { result } = parsePacket(0);

console.log(result);