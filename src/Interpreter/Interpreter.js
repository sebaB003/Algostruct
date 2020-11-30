import {Lexer} from './Lexer';
import {Parser} from './Parser';

/** */
class Scope {
  /**
   * @param {*} scopeName
   * @param {*} scopeLevel
   * @param {*} encolsedScope
   */
  constructor(scopeName, scopeLevel, encolsedScope=null) {
    this.memory = new Map();
    this.scopeName = scopeName;
    this.scopeLevel = scopeLevel;
    this.encolsedScope = encolsedScope;
  }

  /**
   * @param {*} key
   * @param {*} value
   * @return {*}
   */
  set(key, value) {
    return this.memory.set(key, value);
  }

  /**
   * @param {*} key
   * @return {boolean}
   */
  has(key) {
    return this.memory.has(key);
  }

  /**
   * @param {*} key
   * @return {*}
   */
  get(key) {
    return this.memory.get(key);
  }

  /**
   * @param {*} key
   * @return {boolean}
   */
  hasDeep(key) {
    if (this.has(key)) {
      return true;
    }

    if (this.encolsedScope) {
      return this.encolsedScope.hasDeep(key);
    }

    return false;
  }

  /**
   * @param {*} key
   * @return {*}
   */
  getDeep(key) {
    const result = this.get(key);
    if (result) {
      return result;
    }

    if (this.encolsedScope) {
      return this.encolsedScope.getDeep(key);
    }

    return null;
  }

  /**
   * @param {*} key
   * @param {*} value
   * @return {boolean}
   */
  setDeep(key, value) {
    if (this.has(key)) {
      this.set(key, value);
      return true;
    }

    if (this.encolsedScope) {
      return this.encolsedScope.setDeep(key, value);
    }

    return false;
  }

  /** */
  mem() {
    const scopeName = `${this.scopeName}:${this.scopeLevel}`;
    const keys = [];
    for (const [key, content] of this.memory.entries()) {
      const newContent = {...content, 'scope': scopeName};
      keys.push({[key]: newContent});
    }

    if (this.encolsedScope) {
      return keys.concat(this.encolsedScope.mem());
    }

    return keys;
  }
}

/**
 *
 */
class Process {

  /**
   * @param {*} callback
   * @param {*} time
   */
  constructor(callback, time, autostart=true) {
    this.callback = callback;
    this.time = time;
    this.process;
    if (autostart) {
      this.startProcess();
    }
  }

  /** */
  stopProcess() {
    clearInterval(this.process);
    this.process = null;
  }

  /** */
  pauseProcess() {
    this.stopProcess();
  }

  /** */
  startProcess() {
    this.deleteProcess();
    this.process = setInterval(this.callback, this.time);
  }

  /** */
  deleteProcess() {
    this.stopProcess();
    delete this;
  }
}

/** */
class ProcessStack {
  /**
   * @param {*} array
   */
  constructor(array=[]) {
    this.stack = array;
    this.length = array ? array.length : 0;
  }

  /** */
  pauseCurProcess() {
    if (this.length) {
      this.stack[this.length - 1].pauseProcess();
    }
  }

  /** */
  endCurProcess() {
    const curProcess = this.stack.pop();
    if (curProcess) {
      curProcess.deleteProcess();
    }
    this.length--;
    this.startCurProcess();
  }

  /**
   * 
   * @param {*} process 
   */
  createProcess(process) {
    this.pauseCurProcess();
    this.stack.push(process);
    this.length++;
  }

  /** */
  startCurProcess() {
    if (this.length) {
      this.stack[this.length - 1].startProcess();
    }
  }

  /** */
  terminate() {
    while (this.length) {
      this.stack.pop().deleteProcess();
      this.length--;
    }
  }
}


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
    this.scope = null;

    this.isStopped = false;
    this.isPaused = false;
    this.interval;

    this.mode = 0;
    this.flowStack = new ProcessStack();
  }

  startExecution() {
    this.isStopped = false;
    this.isPaused = false;
    this.flowStack.startCurProcess();
  }

  stopExecution() {
    clearInterval(this.interval);
    this.isStopped = true;
    this.isPaused = false;
    this.parser = null;
    this.flowStack.terminate();
    console.log('stopped');
  }

  pauseExecution() {
    this.isPaused = true;
    this.flowStack.pauseCurProcess();
  }

  /**
   * Resets the interpreter
   * @param {StartBlock} startBlock
   */
  reset(startBlock) {
    const lexer = new Lexer(startBlock, this.logsView, this.outputsView);
    this.parser = new Parser(lexer, this.logsView, this.outputsView);
    this.memory = new Map();
    this.scope = new Scope('global', 1);
    if (this.watchesView.state == 'open') {
      this.watchesView.showWatches(this.scope.mem());
    }
    this.flowStack.terminate();
    this.flowStack = new ProcessStack();
  }

  /**
   * @param {*} logsView
   */
  setLogsView(logsView) {
    this.logsView = logsView;
    this.parser.logsView = logsView;
    this.parser.lexer.logsView = logsView;
  }

  /**
   * @param {string} message
  */
  error(message) {
    if (this.logsView) {
      this.logsView.console.error(message, false);
    }
    this.flowStack.terminate();
    throw new Error(message);
  }

  /**
   * @param {string} message
  */
  log(message) {
    if (this.logsView) {
      this.logsView.console.log(`${message}`);
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
        const result = visitor.call(this, tree);
        if (this.mode) {
          this.flowStack.pauseCurProcess();
        }
        return result;
      } else {
        this.error('Unexpected token');
      }
    } else {
      this.error('Invalid statement');
    }
  }

  /**
   * @param {*} node
   */
  visitFlowchartAST(node) {
    this.scope = new Scope('global', 1);
    console.log('a');
    this.visit(node.flow);

    this.scope = this.scope.encolsedScope;
  }

  /**
   * @param {*} node
   */
  visitFlow(node) {

    let index = 0;
    console.log('>', node.blocks.length);
    function iterFlow() {
      if (index < node.blocks.length) {
        this.visit(node.blocks[index]);
      } else {
        this.flowStack.endCurProcess();
        console.log('end');
      }
      index++;
    }

    const process = new Process(iterFlow.bind(this), 1);
    this.flowStack.createProcess(process);
    console.log(this.flowStack);
  }

  /**
   * @param {*} node
   */
  visitBlock(node) {
    for (const statement of node.statements) {
      this.visit(statement);
    }
  }

  /** */
  visitCondition(node) {
    const newScope = new Scope('work', this.scope.scopeLevel + 1, this.scope);
    this.scope = newScope;
    const result = this.visit(node.node);
    this.log(`Condition solved as: ${result}`);
    if (result) {
      this.visit(node.trueBranch);
    } else {
      this.visit(node.falseBranch);
    }

    this.scope = this.scope.encolsedScope;
  }

  /** */
  visitLoop(node) {
    if (node.firstExec) {
      this.visit(node.loopBranch);
    }

    let result = this.visit(node.condition);
    this.log(`Condition solved as: ${result}`);

    /** */
    function loop(interpreter) {
      if (result) {
        const newScope = new Scope('work', interpreter.scope.scopeLevel + 1, interpreter.scope);
        interpreter.scope = newScope;
        interpreter.visit(node.loopBranch);
        interpreter.scope = interpreter.scope.encolsedScope;
        result = interpreter.visit(node.condition);
        interpreter.log(`Condition solved as: ${result}`);
      } else {
        this.flowStack.endCurProcess();
      }
    }

    const process = new Process(loop.bind(this, this), 1);
    this.flowStack.createProcess(process);
    console.log(this.flowStack);
  }

  /**
   * @param {*} node
   */
  visitVarDecl(node) {
    const variableName = node.variableNode.value;
    const variableType = this.visit(node.typeNode);
    console.log(this.scope);
    if (!this.scope.has(variableName)) {
      this.scope.set(variableName, {type: variableType, value: undefined});
      this.log(`Defined: ${variableType} '${variableName}'`);
      if (this.watchesView.state == 'open') {
        this.watchesView.showWatches(this.scope.mem());
      }
    } else {
      this.error(`Variable alrady defined: ${variableName}`);
    }
  }

  /**
   * @param {*} node
   */
  visitAssign(node) {
    const variableName = node.leftNode.value;
    if (this.scope.hasDeep(variableName)) {
      const content = this.scope.getDeep(variableName);
      const value = this.visit(node.rightNode);
      const valueType = this.getValueType(value);

      if (valueType == content['type'] || content['type'] == 'auto') {
        content['value'] = this.parseValue(value);
        this.scope.setDeep(variableName, content);
        if (this.watchesView.state == 'open') {
          this.watchesView.showWatches(this.scope.mem());
        }
      } else {
        this.error(`Unexpected variable type: '${valueType}'\nExpected:${content['type']}`);
      }
    } else {
      this.error(`Undefined variable '${variableName}'`);
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
    this.pauseExecution();
    return this.outputsView.console.input(node.message);
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

    if (!this.scope.hasDeep(variableName)) {
      this.error(`Undefined variable '${variableName}'`);
    } else {
      return this.scope.getDeep(variableName)['value'];
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

  /** 
   * @param {StartBlock} startBlock
   * @param {logsView} logsView
  */
  stepInterpret(startBlock, logsView) {
    this.mode = 1;
    if (!this.parser) {
      this.outputsView.console.clear();
      this.reset(startBlock);
    }

    this.setLogsView(logsView);

    if (this.parser.currentToken.type == 'START') {
      this.parser.match('START');
      this.visit(this.parser.flow());
    } else if (this.parser.currentToken.type == 'END' && !this.flowStack.length) {
      this.parser.match('END');
      this.parser = null;
    } else {
      this.flowStack.startCurProcess();
    }
  }

  /** */
  interpret() {
    this.mode = 1;
    this.outputsView.console.clear();

    // let token;
    // token = this.parser.lexer.getNextToken();
    // while(token.type != 'END') {
    //   console.log(token);
    //   token = this.parser.lexer.getNextToken();
    // }
    // console.log(token);
    this.parser.match('START');
    this.visit(this.parser.flow());
    this.parser.match('END');
    this.parser = null;
  }
}
