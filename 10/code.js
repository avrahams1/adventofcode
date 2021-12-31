// window.rawInput = `
// [({(<(())[]>[[{[]{<()<>>
// [(()[<>])]({[<{<<[]>>(
// {([(<{}[<>[]}>{[]{[(<()>
// (((({<>}<{<{<>}{[]{[]{}
// [[<[([]))<([[{}[[()]]]
// [{[{({}]{}}([{[{{{}}([]
// {<[[]]>}<{[{[{[]{()[[[]
// [<(<(<(<{}))><([]([]()
// <{([([[(<>()){}]>(<<{{
// <{([{{}}[<[[[<>{}]]]>[]]`;

const input = window.rawInput
    .trim()
    .split('\n')
    .map(line => line.trim());

function matchingCloser(openChar) {
    switch (openChar) {
        case '(': return ')';
        case '[': return ']';
        case '{': return '}';
        case '<': return '>';
        default: throw Error('nooo' + char);
    }
}

function isOpening(char) {
    switch (char) {
        case '(': 
        case '[': 
        case '{': 
        case '<': return true;
        default: return false;
    }
}

function getIllegalCharScore(char) {
    switch (char) {
        case ')': return 3;
        case ']': return 57;
        case '}': return 1197;
        case '>': return 25137;
        default: throw Error('nooo' + char);
    }
}

function getCompletionCharScore(char) {
    switch (char) {
        case ')': return 1;
        case ']': return 2;
        case '}': return 3;
        case '>': return 4;
        default: throw Error('nooo' + char);
    }
}

const VALID = 'v', INCOMPLETE = 'i', CORRUPTED = 'c';

function getLineState(line) {
    const stack = [];

    for (const char of line) {
        if (isOpening(char)) {
            stack.push(char);
        } else {
            const lastOpener = stack.pop();

            if (lastOpener === undefined ||
                matchingCloser(lastOpener) !== char) {
                    return {
                        status: CORRUPTED,
                        firstIllegalChar: char
                    };
                }
        }
    }

    return {
        status: stack.length ? INCOMPLETE : VALID,
        remainingStack: stack
    };
}

function createCompletionString(remainingStack) {
    let char = remainingStack.pop();
    let completionString = '';

    while (char) {
        completionString += matchingCloser(char);
        char = remainingStack.pop();
    }

    return completionString;
}

const completionStrings = input
    .map(getLineState)
    .filter(({status}) => status === INCOMPLETE)
    .map(({remainingStack}) => createCompletionString(remainingStack));

const allSums = [];
for (const completionString of completionStrings) {
    let localSum = 0;

    for (const char of completionString) {
        localSum *= 5;
        localSum += getCompletionCharScore(char);
    }

    allSums.push(localSum);
}

allSums.sort((a, b) => a - b);

console.log(allSums[Math.floor(allSums.length / 2)]);