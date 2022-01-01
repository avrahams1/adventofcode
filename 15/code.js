// window.rawInput = `
// 1163751742
// 1381373672
// 2136511328
// 3694931569
// 7463417111
// 1319128137
// 1359912421
// 3125421639
// 1293138521
// 2311944581`;

class GraphNode {
    constructor(price, isGoal, original) {
        this.neighbors = new Set();
        this.isGoal = isGoal;
        this.price = price;
    }

    connect(node) {
        this.neighbors.add(node);
        node.neighbors.add(this);
    }
}

class Graph {
    constructor(head, nodes) {
        this.head = head;
        this.nodes = nodes;
    }

    static fromInput(matrix) {
        const dir_mat = [
            [0, 1],
            [0, -1],
            [1, 0],
            [-1, 0]
        ];

        let head;
        const nodes = [];
        const nodeCache = new Map();

        function getOrAddNode(i, j) {
            const key = indicesToString(i, j);
            if (!nodeCache.has(key)) {
                const newNode = new GraphNode(
                    matrix[i][j],
                    i === matrix.length - 1 && j === matrix[0].length - 1);
                
                nodes.push(newNode);
                if (i === 0 && j === 0) {
                    head = newNode;
                }

                nodeCache.set(key, newNode);
            }

            return nodeCache.get(key);
        }
        
        iterateMatrix(matrix, ({i, j}) => {
            const node = getOrAddNode(i, j);
            dir_mat.forEach(([diffI, diffJ]) => {
                const newI = i + diffI;
                const newJ = j + diffJ;

                if (!areIndicesValid(matrix, newI, newJ)) {
                    return;
                }

                node.connect(getOrAddNode(newI, newJ));
            })
        });

        console.log('built graph');

        return new Graph(head, nodes);
    }
}

const input = (() => {
    const matrix = window.rawInput
        .trim()
        .split('\n')
        .map(line => line.split('').map(Number));

    
    const bigMatrix = explodeMatrix(matrix);
    return Graph.fromInput(bigMatrix);
})();

function explodeMatrix(smallMatrix) {
    const smallMatrixSize = smallMatrix.length;
    const mat = createBlankMatrix({ x: smallMatrixSize * 5, y: smallMatrixSize * 5 }, 0);

    for (let tile = 0; tile < 5 * 5; tile++) {
        const startI = Math.floor(tile / 5) * smallMatrixSize;
        const startJ = (tile % 5) * smallMatrixSize;
        const additionalRiskLevel = Math.floor(startI / smallMatrixSize) + Math.floor(startJ / smallMatrixSize);

        for (let i = startI, smallMatI = 0; i < startI + smallMatrixSize; i++, smallMatI++) {
            for (let j = startJ, smallMatJ = 0; j < startJ + smallMatrixSize; j++, smallMatJ++) {
                const sum = smallMatrix[smallMatI][smallMatJ] + additionalRiskLevel;
                mat[i][j] = sum >= 10 ? sum % 9 : sum;
            }
        }
    }

    console.log('built matrix');

    return mat;
}

function dijkstra(graph) {
    function popNodeWithMinDist(nodeList, nodeData) {
        let minValue = Number.MAX_VALUE;
        let minNode = null;
    
        for (const node of nodeList) {
            const dist = nodeData.get(node).dist;
    
            if (dist < minValue) {
                minValue = dist;
                minNode = node;
            }
        }
    
        nodeList.delete(minNode);
        return minNode;
    }

    const nodeData = new Map();
    const nodeList = new Set(graph.nodes);

    for (const node of graph.nodes) {
        nodeData.set(node, {
            dist: Number.MAX_VALUE,
            prev: null
        });
    }

    nodeData.get(graph.head).dist = 0;

    while (nodeList.size) {
        const node = popNodeWithMinDist(nodeList, nodeData);
        console.log('dijkstra step, %d remaining', nodeList.size);

        for (const neighbor of node.neighbors) {
            if (nodeList.has(neighbor) === -1) {
                continue;
            }

            const currDistance = nodeData.get(node).dist + neighbor.price;
            const neighborData = nodeData.get(neighbor);

            if (currDistance < neighborData.dist) {
                neighborData.dist = currDistance;
                neighborData.prev = node;
            }
        }
    }

    return nodeData;
}

console.log('running dijkstra');
const dijkstraValues = dijkstra(input);
console.log('got dijkstra result');
const lowestRiskToGoal = Array.from(dijkstraValues.entries())
    .filter(([node]) => node.isGoal)
    [0]
    [1]
    .dist;

console.log(lowestRiskToGoal);