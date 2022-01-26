class Tree {
    constructor(head) {
        this.head = head;
    }

    toString() {
        return this.head.toString();
    }

    clone() {
        return new Tree(this.head.clone());
    }
}

class Node {
    set isLeft(val) {
        this._isLeft = val;
    }

    get isLeft() {
        return this._isLeft;
    }

    get isRight() {
        return !this.isLeft;
    }

    get isInnerNode()  {
        return this instanceof TreeNode;
    }
}

class TreeNode extends Node {
    constructor() {
        super();
        this.parent = null;
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
    
    toString() {
        return `[${this.left.toString()},${this.right.toString()}]`;
    }

    clone() {
        const newNode = new TreeNode();
        newNode.right = this.right.clone();
        newNode.left = this.left.clone();

        return newNode;
    }
}

class ValueNode extends Node {
    constructor(value) {
        super();
        this.value = value;
    }

    toString() {
        return this.value.toString();
    }

    clone() {
        return new ValueNode(this.value);
    }
}