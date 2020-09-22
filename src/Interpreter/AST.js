/** */
export class FlowchartAST {
  /**
   * @param {*} flow
   */
  constructor(flow) {
    this.flow = flow;
  }
}

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
    this.typeNode = typeNode;
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
export class BoolVal {
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
export class Output {
  /**
   * @param {*} node
   */
  constructor(node) {
    this.node = node;
  }
}

/** */
export class Input {
  /**
   * @param {*} message
   */
  constructor(message) {
    this.message = message;
  }
}

/** */
export class Condition {
  /**
   * @param {*} node
   * @param {*} trueBranch
   * @param {*} falseBranch
   */
  constructor(node, trueBranch, falseBranch) {
    this.node = node;
    this.trueBranch = trueBranch;
    this.falseBranch = falseBranch;
  }
}

/**
 */
export class Loop {
  /**
   * @param {*} condition
   * @param {*} loopBranch
   * @param {*} firstExec
   */
  constructor(condition, loopBranch, firstExec) {
    this.condition = condition;
    this.loopBranch = loopBranch;
    this.firstExec = firstExec;
  }
}
/** */
export class None {
  /** */
  constructor() {}
}
