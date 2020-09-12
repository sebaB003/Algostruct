/** */
export class Flow {
  /**
   * @param {*} blocks
   */
  constructor(blocks) {
    this.blocks = blocks;
  }
}

/** */
export class Block {
  /**
   * @param {*} statements
   */
  constructor(statements) {
    this.statements = statements;
  }
}


/** */
export class VarDecl {
  /**
   * @param {*} variableNode
   * @param {*} typeNode
   */
  constructor(variableNode, typeNode) {
    this.variableNode = variableNode;
    this.valueNode = typeNode;
  }
}

/** */
export class BinaryOperator {
  /**
   * @param {*} leftNode
   * @param {*} operator
   * @param {*} rightNode
   */
  constructor(leftNode, operator, rightNode) {
    this.leftNode = leftNode;
    this.operator = operator;
    this.rightNode = rightNode;
  }
}

/** */
export class Assign {
  /**
   * @param {*} leftNode
   * @param {*} operator
   * @param {*} rightNode
   */
  constructor(leftNode, operator, rightNode) {
    this.leftNode = leftNode;
    this.operator = operator;
    this.rightNode = rightNode;
  }
}
/** */
export class UnaryOperator {
  /**
   * @param {*} token
   * @param {*} node
   */
  constructor(token, node) {
    this.token = token;
    this.node = node;
  }
}

/** */
export class Number {
  /**
   * @param {*} token
   */
  constructor(token) {
    this.token = token;
    this.value = token.value;
  }
}

/** */
export class Type {
  /**
   * @param {*} token
   */
  constructor(token) {
    this.token = token;
    this.value = token.value;
  }
}

/** */
export class Var {
  /**
   * @param {*} token
   */
  constructor(token) {
    this.token = token;
    this.value = token.value;
  }
}

/** */
export class None {
  /** */
  constructor() {}
}
