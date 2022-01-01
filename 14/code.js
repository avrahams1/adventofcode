// window.rawInput = `
// NNCB

// CH -> B
// HH -> N
// CB -> H
// NH -> C
// HB -> C
// HC -> B
// HN -> C
// NN -> C
// BH -> H
// NC -> B
// NB -> B
// BN -> B
// BB -> N
// BC -> B
// CC -> N
// CN -> C`;

class CountingTemplate {
    constructor(prevTemplate) {
        this.firstChar = null;
        this.lastChar = null;
        this.pairs = new Map();
        // first char -> map(second char -> num of occurences)

        if (prevTemplate) {
            this.firstChar = prevTemplate.firstChar;
            this.lastChar = prevTemplate.lastChar;
            this.pairs = prevTemplate.pairsClone;
        }
    }

    get pairsClone() {
        return new Map(
            Array.from(this.pairs.entries()).map(([key, value]) => [key, new Map(value)])
        )
    }

    get charOccurences() {
        const countMap = new Map();

        function increment(char, times = 1) {
            if (!countMap.has(char)) {
                countMap.set(char, times);
            } else {
                countMap.set(char, countMap.get(char) + times);
            }
        }
        
        increment(this.firstChar);
        
        for (const [beforeChar, followMap] of this.pairs.entries()) {
            for (const [char, numOfOccurences] of followMap.entries()) {
                increment(char, numOfOccurences);
            }
        }

        return countMap;
    }

    pushWithPrev(char, prevChar, followChar, count) {
        // add char to prev's follow count times.
        const prevCharDict = this.addChar(prevChar);
        this.incrementFollowingCharCount(prevCharDict, char, count);
        
        // remove count followChars from prevChar's follow list
        this.decrementFollowingCharCount(prevCharDict, followChar, count);

        // add followChar to char's follow list
        const charDict = this.addChar(char);
        this.incrementFollowingCharCount(charDict, followChar, count);
    }

    push(...chars) {
        if (this.lastChar != null) {
            const lastCharCounterDict = this.addChar(this.lastChar);
            this.incrementFollowingCharCount(lastCharCounterDict, chars[0]);
        }

        chars.forEach((char, index) => {
            if (index === chars.length - 1) {
                return;
            }
            const currCharMap = this.addChar(char);

            const nextChar = chars[index + 1];
            this.incrementFollowingCharCount(currCharMap, nextChar);
        });

        if (this.firstChar === null) {
            this.firstChar = chars[0];
        }

        this.lastChar = chars[chars.length - 1];
    }

    incrementFollowingCharCount(currCharMap, nextChar, count = 1) {
        if (!currCharMap.has(nextChar)) {
            currCharMap.set(nextChar, count);
        } else {
            currCharMap.set(nextChar, currCharMap.get(nextChar) + count);
        }
    }

    decrementFollowingCharCount(currCharMap, nextChar, count = 1) {
        if (!currCharMap.has(nextChar)) {
            return;
        }

        currCharMap.set(nextChar, currCharMap.get(nextChar) - count);
        if (currCharMap.get(nextChar) === 0) {
            currCharMap.delete(nextChar);
        }
    }

    addChar(char) {
        if (!this.pairs.has(char)) {
            this.pairs.set(char, new Map());
        }

        return this.pairs.get(char);
    }

    static fromExisting(stringTemplate) {
        const template = new CountingTemplate();
        template.push(...stringTemplate.split(''));

        return template;
    }
}

const input = (() => {
    const [initialTemplate, rawRules] = window.rawInput
    .trim()
    .split('\n\n');
    
    const rules = rawRules
    .split('\n')
    .map(line => line.split(' -> '))
    .reduce((prev, [src, dst]) => prev.set(src, dst), new Map());
    
    return { 
        template: CountingTemplate.fromExisting(initialTemplate),
        rules
    };
})();

function step(template) {
    const { rules } = input;
    const newTemplate = new CountingTemplate(template);

    for (const [char, followMap] of template.pairs) {
        for (const [followChar, count] of followMap) {
            const currPair = char + followChar;

            if (rules.has(currPair)) {
                const ruleChar = rules.get(currPair);
                newTemplate.pushWithPrev(ruleChar, char, followChar, count);
            }
        }
    }
    
    return newTemplate;
}

function calcMaxMinusMinOccurence(template) {
    const entries = Array.from(template.charOccurences.values());

    const { minValue, maxValue } = entries.reduce((prev, curr) => ({
        minValue: Math.min(prev.minValue, curr),
        maxValue: Math.max(prev.maxValue, curr)
    }), {
        minValue: Number.MAX_VALUE,
        maxValue: Number.MIN_VALUE
    });

    return maxValue - minValue;
}

let {template} = input;

for (let index = 0; index < 40; index++) {
    template = step(template);
}

console.log(calcMaxMinusMinOccurence(template));