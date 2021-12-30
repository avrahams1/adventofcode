// window.rawInput = `be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe
// edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc
// fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg
// fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb
// aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea
// fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb
// dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe
// bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef
// egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg | gbdfcae bgc cg cgb
// gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | fgae cfgab fg bagce`;

// window.rawInput = `acedgfb cdfbe gcdfa fbcad dab cefabd cdfgeb eafb cagedb ab | cdfeb fcadb cdfeb cdbaf`;

/*
0 = abcefg (6)
1 = cf (2) --
2 = acdeg (5)
3 = acdfg (5)
4 = bcdf (4) --
5 = abdfg (5)
6 = abdefg (6)
7 = acf (3) --
8 = abdcefg (7) --
9 = abcdfg (6)
*/

/*
1 4 7 8
a spot - 7 - 1, remaining is a
d spot - 4 (unique) ^ (all 5 digit numbers)
b spot - 4 - 1 - { d }
f spot - find 6 digit number where ^ 1 != 1, ^ it with 4, - {b, d}
c spot - 1 - { f }
g spot - find 5 digit number with { a, b, d, f }, substract said group, g is left (5)
e spot - 8 - the rest
*/

const DIGITS = {
    'abcefg': '0',
    'cf': '1',
    'acdeg': '2',
    'acdfg': '3',
    'bcdf': '4',
    'abdfg': '5',
    'abdefg': '6',
    'acf': '7',
    'abcdefg': '8',
    'abcdfg': '9'
};

class Digit {
    constructor(originalString) {
        this.originalString = typeof originalString === 'string' ? [...originalString] : originalString;
    }

    andDigit(digit) {
        return this.andLetters(...digit.originalString);
    }

    andLetters(...letters) {
        return new Digit(this.originalString.filter(letter => letters.includes(letter)));
    }

    subDigit(digit) {
        return this.subLetters(...digit.originalString);
    }

    subLetters(...letters) {
        return new Digit(this.originalString.filter(letter => !letters.includes(letter)));
    }

    contains(...letters) {
        return letters.every(letter => this.originalString.includes(letter));
    }

    get length() {
        return this.originalString.length;
    }

    get string() {
        const arr = this.originalString;
        arr.sort();
        return arr.join('');
    }

    get translatedDigit() {
        const arr = this.originalString.map(letter => cypherToActual.get(letter));
        arr.sort();
        const str = arr.join('');

        return DIGITS[str];
    }
}

const actualToCypher = new Map();
const cypherToActual = new Map();

const input = window.rawInput
    .split('\n')
    .map(line => line.split(' | '))
    .map(splitLine => ({
        signalPatterns: splitLine[0].split(' ').map(str => new Digit(str)),
        outputValues: splitLine[1].split(' ').map(str => new Digit(str))
    }));

function solve(line) {
    const { signalPatterns, outputValues } = line;

    decypherMappings(signalPatterns);

    const result = outputValues.map(digit => digit.translatedDigit).join('');
    // console.log(result);

    return +result;
}

function decypherMappings(signalPatterns) {
    function setMapping(actual, cypher) {
        actualToCypher.set(actual, cypher);
        cypherToActual.set(cypher, actual);
        //console.log(`found ${actual} -`, cypher);
    }

    // find 1, 4, 7, 8
    const one = signalPatterns.filter(digit => digit.length === 2)[0];
    const four = signalPatterns.filter(digit => digit.length === 4)[0];
    const seven = signalPatterns.filter(digit => digit.length === 3)[0];
    const eight = signalPatterns.filter(digit => digit.length === 7)[0];

    // find a
    const aSpot = seven.subDigit(one).string;
    setMapping('a', aSpot);

    // find d
    const dSpot = signalPatterns.filter(digit => digit.length === 5).reduce((prev, curr) => curr.andDigit(prev), four).string;
    setMapping('d', dSpot);

    // find b
    const bSpot = four.subDigit(one).subLetters(actualToCypher.get('d')).string;
    setMapping('b', bSpot);

    // find f
    const fSpot = signalPatterns
        .filter(digit => digit.length === 6)
        .filter(digit => digit.andDigit(one).string !== one.string)
        [0]
        .andDigit(four)
        .subLetters(actualToCypher.get('b'), actualToCypher.get('d'))
        .string;
    setMapping('f', fSpot);

    // find c
    const cSpot = one.subLetters(actualToCypher.get('f')).string;
    setMapping('c', cSpot);

    // find g
    const gSpot = signalPatterns
        .filter(digit => digit.length === 5)
        .filter(digit => digit.contains(actualToCypher.get('a'), actualToCypher.get('b'), actualToCypher.get('d'), actualToCypher.get('f')))
        [0]
        .subLetters(actualToCypher.get('a'), actualToCypher.get('b'), actualToCypher.get('d'), actualToCypher.get('f'))
        .string;
    setMapping('g', gSpot);

    // find e
    const eSpot = eight.subLetters(...Array.from(actualToCypher.values())).string;
    setMapping('e', eSpot);
}

const sum = input/*.slice(3, 4)*/.reduce((prev, curr) => prev + solve(curr), 0);

console.log(sum);