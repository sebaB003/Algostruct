import {Lexer} from './Lexer';
import {Parser} from './Parser';

/** */
export class Interpreter {
  /**
   * @param {*} logsView
   * @param {*} outputsView
   * @param {*} watchesView
   */
  constructor(logsView, outputsView, watchesView) {
    this.logsView = logsView;
    this.outputsView = outputsView;
    this.watchesView = watchesView;

    this.parser = null;
    this.memory = new Map();
  }

  /**
   * @param {string} message
  */
  error(message) {
    if (this.logsView) {
      this.logsView.console.error(message, false);
    }
  }

  /**
   * @param {*} tree
   */
  visit(tree) {
    if (tree) {
      const visitorName = `visit${tree.constructor.name}`;
      const visitor = this[visitorName];
      if (visitor) {
        return visitor.call(this, tree);
      } else {
        this.error('Unexpected token');
        throw new Error('Unexpected token');
      }
    } else {
      this.error('Invalid statement');
      throw new Error('Invalid statement');
    }
  }

  /**
   * @param {*} node
   */
  visitFlow(node) {
    for (const block of node.blocks) {
      this.visit(block);
    }
  }

  /**
   * @param {*} node
   */
  visitBlock(node) {
    console.log(node);
    for (const statement of node.statements) {
      this.visit(statement);
    }
  }

  /** */
  visitCondition(node) {
    const result = this.visit(node.node);
    this.logsView.console.log(`Condition solved as: ${result}`);
    if (result) {
      this.visit(node.trueBranch);
    } else {
      this.visit(node.falseBranch);
    }
  }

  /** */
  async visitLoop(node) {
    if (node.firstExec) {
      this.visit(node.loopBranch);
    }

    let result = this.visit(node.condition);
    this.logsView.console.log(`Condition solved as: ${result}`);
    while (result) {
      result = this.visit(node.condition);
      this.logsView.console.log(`Condition solved as: ${result}`);
    }
  }

  /**
   * @param {*} node
   */
  visitVarDecl(node) {
    const variableName = node.variableNode.value;
    const variableType = this.visit(node.typeNode);

    if (!this.memory.has(variableName)) {
      this.memory.set(variableName, {type: variableType, value: undefined});
      this.logsView.console.log(`Defined: ${variableType} '${variableName}'`);
      this.watchesView.showWatches(this.memory);
    } else {
      this.error(`Variable alrady defined: ${variableName}`);
      throw new Error('Variable alrady defined');
    }
  }

  /**
   * @param {*} node
   */
  visitAssign(node) {
    const variableName = node.leftNode.value;
    if (this.memory.has(variableName)) {
      const content = this.memory.get(variableName);
      const value = this.visit(node.rightNode);
      const valueType = this.getValueType(value);

      if (valueType == content['type'] || content['type'] == 'auto') {
        content['value'] = this.parseValue(value);
        this.memory.set(variableName, content);
        this.watchesView.showWatches(this.memory);
      } else {
        this.error(`Unexpected variable type: '${valueType}'\nExpected:${content['type']}`);
        throw new Error('Unexpected variable type');
      }
    } else {
      this.error(`Undefined variable '${variableName}'`);
      throw new Error('Undefined variable');
    }
  }

  /**
   * @param {*} value
   */
  getValueType(value) {
    if (/[0-9]*\.[0-9]*/.test(value)) {
      return 'float';
    } else if (/\d+/.test(value)) {
      return 'int';
    } else if (value == true || value == false) {
      return 'bool';
    }

    this.error(`Unexpected value: '${value}'`);
    throw new Error('Unexpected value');
  }

  /** */
  parseValue(value) {
    const valueType = this.getValueType(value);
    if (valueType == 'int') {
      return parseInt(value);
    } else if (valueType == 'float') {
      return parseFloat(value);
    } else {
      return value;
    }
  }

  /**
   * @param {*} node 
   */
  visitUnaryOperator(node) {
    if (node.token.type == 'PLUS') {
      return + this.visit(node.node);
    } else if (node.token.type == 'MINUS') {
      return - this.visit(node.node);
    } else if (node.token.type == 'NOT') {
      return !this.visit(node.node);
    }
  }

  /**
   * @param {*} node 
   */
  visitBinaryOperator(node) {
    if (node.operator.type == 'MUL') {
      return this.visit(node.leftNode) * this.visit(node.rightNode);
    } else if (node.operator.type == 'DIV') {
      return this.visit(node.leftNode) / this.visit(node.rightNode);
    } else if (node.operator.type == 'MOD') {
      return this.visit(node.leftNode) % this.visit(node.rightNode);
    } else if (node.operator.type == 'POW') {
      return Math.pow(this.visit(node.leftNode), this.visit(node.rightNode));
    } else if (node.operator.type == 'PLUS') {
      return this.visit(node.leftNode) + this.visit(node.rightNode);
    } else if (node.operator.type == 'MINUS') {
      return this.visit(node.leftNode) - this.visit(node.rightNode);
    } else if (node.operator.type == 'LAND') {
      return this.visit(node.leftNode) && this.visit(node.rightNode);
    } else if (node.operator.type == 'LOR') {
      return this.visit(node.leftNode) || this.visit(node.rightNode);
    } else if (node.operator.type == 'LT') {
      return this.visit(node.leftNode) < this.visit(node.rightNode);
    } else if (node.operator.type == 'LTET') {
      return this.visit(node.leftNode) <= this.visit(node.rightNode);
    } else if (node.operator.type == 'GT') {
      return this.visit(node.leftNode) > this.visit(node.rightNode);
    } else if (node.operator.type == 'GTET') {
      return this.visit(node.leftNode) >= this.visit(node.rightNode);
    } else if (node.operator.type == 'EQ') {
      return this.visit(node.leftNode) == this.visit(node.rightNode);
    } else if (node.operator.type == 'NEQ') {
      return this.visit(node.leftNode) != this.visit(node.rightNode);
    }
  }

  /**
   * @param {*} node
   */
  visitOutput(node) {
    const result = this.visit(node.node);
    this.outputsView.console.log(`${result}`);
  }

  /**
   * @param {*} node
   */
  visitInput(node) {
    return prompt(node.message); //this.outputsView.console.input(node.message);
  }

  /**
   * @param {*} node
   */
  visitNone(node) {
  }

  /**
   * @param {*} node
   */
  visitType(node) {
    return node.value;
  }

  /**
   * @param {*} node
   */
  visitVar(node) {
    const variableName = node.value;

    if (!this.memory.has(variableName)) {
      this.error(`Undefined variable '${variableName}'`);
      throw new Error('Undefined variable');
    } else {
      return this.memory.get(variableName)['value'];
    }
  }

  /**
   * @param {*} node 
   */
  visitNumber(node) {
    return node.value;
  }

  /**
   * @param {*} node 
   */
  visitBoolVal(node) {
    return node.value;
  }

  /** */
  stepInterpret(startBlock) {
    if (!this.parser) {
      console.log('a');
      this.outputsView.console.clear();
      this.memory = new Map();
      const lexer = new Lexer(startBlock, this.logsView, this.outputsView);
      this.parser = new Parser(lexer, this.logsView, this.outputsView);
    }
    if (this.parser.currentToken.type == 'START') {
      this.parser.match('START');
    } else if (this.parser.currentToken.type == 'END') {
      this.parser.match('END');
      this.parser = null;
    } else {
      this.visit(this.parser.block());
    }
  }

  /** */
  interpret(startBlock) {
    this.outputsView.console.clear();
    this.memory = new Map();
    const lexer = new Lexer(startBlock, this.logsView, this.outputsView);
    this.parser = new Parser(lexer, this.logsView, this.outputsView);

    // let token;
    // token = lexer.getNextToken();
    // while(token.type != 'END') {
    //   console.log(token);
    //   token = lexer.getNextToken();
    // }
    // console.log(token);
    this.parser.match('START');
    while (this.parser.currentToken.type != 'END') {
      this.visit(this.parser.block());
    }
    this.parser.match('END');

    console.log(this.memory);
  }
}

// Generate new Interpeter on file loading
// Fix loops saving / loading
// Add step and stop interpreter
// Try to make async
