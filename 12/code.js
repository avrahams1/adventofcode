// window.rawInput = `
// fs-end
// he-DX
// fs-he
// start-DX
// pj-DX
// end-zg
// zg-sl
// zg-pj
// pj-he
// RW-he
// fs-DX
// pj-RW
// zg-RW
// start-pj
// he-WI
// zg-he
// pj-fs
// start-RW`;

const input = window.rawInput
    .trim()
    .split('\n')
    .map(line => line.split('-'));

class CaveNode {
    constructor(name) {
        this.name = name;
        this.connectedNodes = [];
    }

    get isBig() {
        return this.name === this.name.toUpperCase();
    }

    connect(node) {
        this.connectedNodes.push(node);
        node.connectedNodes.push(this);
    }

    isConnectedTo(node) {
        return this.connectedNodes.includes(node);
    }
}

class Cave {
    constructor(paths) {
        const {start, end} = Cave.buildCave(paths);
        this.start = start;
        this.end = end;
        this.allPaths = [];
    }

    explore(node = this.start, smallVisited = new Set(), didSimulateSmallNotVisited = false, visited = []) {
        visited.push(node.name);

        let curr = 0;
        if (node.isConnectedTo(this.end)) {
            console.log(visited);
            this.allPaths.push(visited);
            curr = 1;
        }

        if (!node.isBig) smallVisited.add(node);

        const connectedNodesToCheck = node.connectedNodes
            .filter(node => node != this.start)
            .filter(node => node != this.end)
            .filter(node => node.isBig || !smallVisited.has(node));

        if (connectedNodesToCheck.length === 0) {
            return curr;
        }

        if (!node.isBig && !didSimulateSmallNotVisited) {
            const setCloneWithoutCurrent = new Set(smallVisited);
            setCloneWithoutCurrent.delete(node);
            curr += connectedNodesToCheck
                .reduce((prev, node) => prev + this.explore(node, new Set(setCloneWithoutCurrent), true, [...visited]), 0);
        }
        
        return curr + connectedNodesToCheck
            .reduce((prev, node) => prev + this.explore(node, new Set(smallVisited), didSimulateSmallNotVisited, [...visited]), 0);
    }

    static buildCave(paths) {
        let start, end;
        const createdNodes = new Map();
        function createOrGetNode(name) {
            if (!createdNodes.has(name)) {
                const newNode = new CaveNode(name);
                createdNodes.set(name, newNode);

                if (name === 'start') {
                    start = newNode;
                } else if (name === 'end') {
                    end = newNode;
                }
            }

            return createdNodes.get(name);
        }

        for (const [first, second] of paths) {
            const firstNode = createOrGetNode(first);
            const secondNode = createOrGetNode(second);
            firstNode.connect(secondNode);
        }

        if (!start || !end) throw new Error('noooo');
        return { start, end };
    }
}

const cave = new Cave(input);
cave.explore();
const set = new Set(cave.allPaths.map(path => path.join('')));
console.log(set.size);