// window.rawInput = `acedgfb cdfbe gcdfa fbcad dab cefabd cdfgeb eafb cagedb ab | cdfeb fcadb cdfeb cdbaf`;

const input = window.rawInput
    .split('\n')
    .map(line => line.split(' | '))
    .map(splitLine => ({
        signalPatterns: splitLine[0].split(' ').map(str => new Digit(str)),
        outputValues: splitLine[1].split(' ').map(str => new Digit(str))
    }));