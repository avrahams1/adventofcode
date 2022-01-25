rawInput = `[[[0,[5,8]],[[1,7],[9,6]]],[[4,[1,2]],[[1,4],2]]]
[[[5,[2,8]],4],[5,[[9,9],0]]]
[6,[[[6,2],[5,6]],[[7,6],[4,7]]]]
[[[6,[0,7]],[0,9]],[4,[9,[9,0]]]]
[[[7,[6,4]],[3,[1,3]]],[[[5,5],1],9]]
[[6,[[7,3],[3,2]]],[[[3,8],[5,7]],4]]
[[[[5,4],[7,7]],8],[[8,3],8]]
[[9,3],[[9,9],[6,[4,9]]]]
[[2,[[7,7],7]],[[5,8],[[9,3],[0,2]]]]
[[[[5,2],5],[8,[3,7]]],[[5,[7,5]],[4,4]]]`;

const input = (() => {
    const values = rawInput
        .trim()
        .split('\n')
        .map(parseLine);

    function parseLine(line) {
        const tree = new Tree();
        const lineWithoutFirst = line.substring(1);
        parseNode(tree.head, lineWithoutFirst);
    }

    function parseNode(node, line) {
        const firstCommaIndex = line.indexOf(',');
        node.left = parseNodePart(line.substring(0, firstCommaIndex));
        node.right = parseNodePart(line.substring(firstCommaIndex + 1));
    }

    function parseNodePart(part) {
        if (part.charAt(0) === '[') {
            return parseNode(new TreeNode(), part.substring(1));
        } else {
            const match = part.match(/^(?<num>\d+)/);
            if (match === null) {
                throw new Error('nooooo');
            }

            return new ValueNode(+match.groups('num'));
        }
    }

    return values;
})();

console.log(input);