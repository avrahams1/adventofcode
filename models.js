class Tree {
    constructor() {
        this.head = new TreeNode();
    }
}

class TreeNode {
    constructor() {
        this.parent = null;
        this.depth = 0;
    }

    get right() {
        return this.right;
    }

    set right(val) {
        this.right = val;
        setParentIfNeeded(this.right);
    }

    get left() {
        return this.left;
    }

    set left(val) {
        this.left = val;
        setParentIfNeeded(this.right);
    }

    setParentIfNeeded(node) {
        if (node instanceof TreeNode) {
            node.parent = this;
        }

        let updatedDepth = 1;
        for (let currNode = this; currNode !== null; currNode = currNode.parent) {
            currNode.depth = updatedDepth++;
        }
    }
}

class ValueNode {
    constructor(value) {
        this.value = value;
    }
}