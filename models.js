class Tree {
    constructor(head) {
        this.head = head;
        this.calcDepths();
    }

    // calcDepths(node) {
    //     if (node instanceof ValueNode) {
    //         return 0;
    //     }

    //     return (node.depth = Math.max(this.calcDepths(node.right), this.calcDepths(node.left)) + 1);
    // }
    calcDepths(node = this.head, depth = 1) {
        if (node instanceof ValueNode) {
            return;
        }

        node.depth = depth;

        this.calcDepths(node.left, depth + 1);
        this.calcDepths(node.right, depth + 1);
    }
}

class TreeNode {
    constructor() {
        this.parent = null;
        this.depth = 0;
    }

    get isInnerNode() {
        return true;
    }

    get right() {
        return this._right;
    }

    set right(val) {
        this._right = val;
        this.setParentIfNeeded(this.right, false);
    }

    get left() {
        return this._left;
    }

    set left(val) {
        this._left = val;
        this.setParentIfNeeded(this.left, true);
    }

    setParentIfNeeded(node, isLeft) {
        node.parent = this;
        node.isLeft = isLeft;
    }
}

class ValueNode {
    constructor(value) {
        this.value = value;
    }

    get isInnerNode() {
        return false;
    }
}