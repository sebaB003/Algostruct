import { Memory } from '../Core/Memory';
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
    const visitorName = `visit${tree.constructor.name}`;
    const visitor = this[visitorName];
    if (visitor) {
      return visitor.call(this, tree);
    } else {
      this.error('Unexpected token');
      throw new Error('Unexpected token');
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
    for (const statement of node.statements) {
      this.visit(statement);
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
    }

    this.error(`Unexpected value: '${value}'`);
    throw new Error('Unexpected value');
  }

  /** */
  parseValue(value) {
    if (this.getValueType(value) == 'int') {
      return parseInt(value);
    } else {
      return parseFloat(value);
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
    } else if (node.operator.type == 'POW') {
      return Math.pow(this.visit(node.leftNode), this.visit(node.rightNode));
    } else if (node.operator.type == 'PLUS') {
      return this.visit(node.leftNode) + this.visit(node.rightNode);
    } else if (node.operator.type == 'MINUS') {
      return this.visit(node.leftNode) - this.visit(node.rightNode);
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

  /** */
  interpret(startBlock) {
    this.outputsView.console.clear();
    this.memory = new Map();
    const lexer = new Lexer(startBlock, this.logsView, this.outputsView);
    const parser = new Parser(lexer, this.logsView, this.outputsView);

    const tree = parser.flowchart();

    this.logsView.console.log('Generated AST');

    this.logsView.console.log('Starting execution...');

    console.log(tree);
    this.visit(tree);

    console.log(this.memory);
  }
}
