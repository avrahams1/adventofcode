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
        return new Tree(parseNode(new TreeNode(), line).node);
    }

    function parseNode(node, line) {
        const firstViableIndex = (() => {
            for (let i = 0; i < line.length; i++) {
                const c = line.charAt(i);
                if (c !== ']' && c !== ',') return i;
            }

            return line.length;
        })();

        line = line.substring(firstViableIndex);

        if (!line) {
            return null;
        }

        const numMatch = line.match(/^(?<num>\d+)/);

        if (numMatch) {
            const { num } = numMatch.groups;

            return {
                node: new ValueNode(+num),
                line: line.substring(num.length + 1)
            };
        } else if (line.charAt(0) === '[') {
            const leftRes = parseNode(new TreeNode(), line.substring(1));
            node.left = leftRes.node;

            const rightRes = parseNode(new TreeNode(), leftRes.line);
            node.right = rightRes.node;

            return {
                node,
                line: rightRes.line
            };
        }
    }

    return values;
})();

function add(tree1, tree2) {
    const newHead = new TreeNode();
    newHead.left = tree1.head;
    newHead.right = tree2.head;
    const res = new Tree(newHead);

    logTree('added %s and %s and got %s', tree1, tree2, res);

    return res;
}

function reduce(tree) {
    while (explode(tree) || split(tree)) { }
}

function explode(tree) {
    function findExplodablePair(node, depth = 1) {
        if (!node.isInnerNode) {
            return null;
        }

        if (depth >= 5 &&
            !node.right.isInnerNode &&
            !node.left.isInnerNode) {
            return node;
        }

        return findExplodablePair(node.left, depth + 1) || findExplodablePair(node.right, depth + 1);
    }

    function getNodeToTheRight(node) {
        for (; node.parent && node.isRight; node = node.parent) { }

        if (!node.parent) {
            return null;
        }

        for (node = node.parent.right; node.isInnerNode; node = node.left) { }

        return node;
    }

    function getNodeToTheLeft(node) {
        for (; node.parent && node.isLeft; node = node.parent) { }

        if (!node.parent) {
            return null;
        }

        for (node = node.parent.left; node.isInnerNode; node = node.right) { }

        return node;
    }

    const explodableNode = findExplodablePair(tree.head);

    if (explodableNode) {
        logTree('before explode: %s, exploding on %s', tree, explodableNode);

        const immidiateRight = getNodeToTheRight(explodableNode);
        const immidiateLeft = getNodeToTheLeft(explodableNode);

        // Update left and right
        if (immidiateLeft) {
            immidiateLeft.value += explodableNode.left.value;
        }

        if (immidiateRight) {
            immidiateRight.value += explodableNode.right.value;
        }

        // Switch current node with a 0 constant
        const newNode = new ValueNode(0);
        if (explodableNode.isRight) {
            explodableNode.parent.right = newNode;
        } else {
            explodableNode.parent.left = newNode;
        }

        logTree('exploded: %s', tree);
    }

    return !!explodableNode;
}

function split(tree) {
    function findSplittableNode(node) {
        if (!node.isInnerNode) {
            return node.value >= 10 ? node : null;
        }

        return findSplittableNode(node.left) || findSplittableNode(node.right);
    }

    const splittableNode = findSplittableNode(tree.head);

    if (splittableNode) {
        logTree('before split: %s, splitting on %s', tree, splittableNode);

        const { value, parent } = splittableNode;
        const newNode = new TreeNode();
        newNode.left = new ValueNode(Math.floor(value / 2));
        newNode.right = new ValueNode(Math.ceil(value / 2));

        if (splittableNode.isRight) {
            parent.right = newNode;
        } else {
            parent.left = newNode;
        }

        logTree('splitted: %s', tree);
    }

    return !!splittableNode;
}

function magnitude(tree) {
    function value(node) {
        if (!node.isInnerNode) {
            return node.value;
        }

        return (3 * value(node.left)) + (2 * value(node.right));
    }

    return value(tree.head);
}

function logTree(str, ...trees) {
    // console.log(str, ...trees.map(tree => tree.toString()));
}

let finalTree = input[0];
for (let i = 1; i < input.length; i++) {
    finalTree = add(finalTree, input[i]);
    reduce(finalTree);
    // console.log('#%d: %s', i, finalTree.toString());
}

// console.log(finalTree.toString());
console.log(magnitude(finalTree));