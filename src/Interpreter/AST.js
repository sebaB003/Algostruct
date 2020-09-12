/** */
export class Block {
  /**
   * @param {*} declarations
   * @param {*} statements
   */
  constructor(declarations, statements) {
    this.declarations = declarations;
    this.statements = statements;
  }
}

/** */
export class Flow {
  /** */
  constructor() {
    self.blocks = [];
  }
}

/** */
export class Statements {
  /** */
  constructor() {
    self.statements = [];
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
