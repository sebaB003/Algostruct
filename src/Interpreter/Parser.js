import * as ASTComponents from './AST';
import {Token} from './Token';

/*
  flowchart : 'START' flow 'END'
            ;

  flow : block* EOB
       ;

  block : statement (SEMICOLON statement)*

  statement : ifExpr
            | loopExpr
            | declaration
            | outputExpr
            | inputExpr
            | assignmentExpr
            | ''
            | ';'
            ;

  inputExpr : 'IN' var
            ;

  declaration : typeDef identifier (',' identifier)* ';'
              ;

  typeDef : 'int'
          | 'float'
          | 'bool'
          | 'auto'
          ;

  identifier : /[_a-zA-Z][_a-zA-Z0-9]/
             ;

  ifExpr : 'IF' conditionalExpr 'EOB' flow 'ELSE' flow 'ENDIF'
         ;

  loopExpr : 'DO' flow 'LOOP' conditionExpr 'ENDLOOP'
           | 'LOOP' conditionExpr 'EOB' flow 'ENDLOOP'
           ;

  assignmentExpr : identifier '=' conditionalExpr

  conditionalExpr: logicalOrExpr
                 ;

  logicalOrExpr : logicalAndExpr ('||' logicalOrExpr)*
                ;

  logicalAndExpr : equealityExpr ('||' logicalAndExpr)*
                 ;

  equalityExpr : relationalExpr ('==' | '!=' equalityExpr)*
               ;

  relationalExpr : additionalExpr ('<' | '<=' | '>' | '>=' relationalExpr)*
                 ;

  additionalExpr : multiplicativeExpr ('+' | '-' additionalExpr)*
                 ;

  multiplicativeExpr : unaryExpr ('*' | '/' | '%' multiplicativeExpr)*
                     ;

  unaryExpr : powerExpr ('+' | '-' | '!' unaryExpr)*

  powerExpr : expr ('pow' poerExpr)

  expr : indetifier
       | constant
       | '(' expression ')'
       ;

  constant : integer_const
           | float_const
           ;

  outputExpr : 'OUT' expr
             ;

  integer_const : [0-9]*
                ;

  float_const : / [0-9]*.[0-9]* /
              ;

  true_const : 'true'

  false_const : 'false'

  PRECEDENCE TABLE
  ____________________________________________
  | PREC LEVEL | ASSOCIATIVITY | OPERATORS   |
  |------------|---------------|-------------|
  |      7     | left-right    | ||          |
  |------------|---------------|-------------|
  |      6     | left-right    | &&          |
  |------------|---------------|-------------|
  |      5     | left-right    | == !=       |
  |------------|---------------|-------------|
  |      4     | left-right    | < <= > >=   |
  |------------|---------------|-------------|
  |      3     | left-right    | + - / * ^ = |
  |------------|---------------|-------------|
  |      2     | right-left    | + -         |
  |------------|---------------|-------------|
  |      1     | left-right    | ()          |
  --------------------------------------------
*/

/**
 * Parser follow BNFM grammar to parse the code and generate an AST.
 */
export class Parser {
  /**
   * @param {Lexer} lexer
   * @param {*} logsView
   * @param {*} outputView
  */
  constructor(lexer, logsView, outputView) {
    this.lexer = lexer;

    this.logsView = logsView;
    this.outputView = outputView;

    this.currentToken = lexer.getNextToken();
    this.mode = 'normal';
  }

  /**
   * @param {string} message
  */
  error(message) {
    if (this.logsView) {
      this.logsView.console.error(message, false);
    }
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
   * Check if the token we are looking for is valid,
   * next returns a new token
   * @param {string} tokenType
   */
  match(tokenType) {
    if (this.currentToken.type == tokenType) {
      this.log(`${this.currentToken }`);
      this.currentToken = this.lexer.getNextToken();
    } else {
      this.error(`Invalid token:${this.currentToken}\n\tExpected: ${tokenType}`);
    }
  }

  /** */
  flowchart() {
    this.match('START');
    const result = this.flow();
    this.match('END');

    return new ASTComponents.FlowchartAST(result);
  }

  /** */
  flow() {
    const blocks = [];

    console.log(this.currentToken);
    while (this.currentToken.type != 'END' && this.currentToken.type != 'ELSE' && this.currentToken.type != 'ENDIF' && this.currentToken.type != 'ENDLOOP'&& this.currentToken.type != 'DOLOOP') {
      blocks.push(this.block());
    }

    return new ASTComponents.Flow(blocks);
  }

  /** */
  block() {
    let statements = [].concat(this.statement());

    while (this.currentToken.type == 'SEMICOLON') {
      this.match('SEMICOLON');
      statements = statements.concat(this.statement());
    }

    try {
      this.match('EOB');
    } catch (e) {}

    return new ASTComponents.Block(statements);
  }

  /** */
  statement() {
    let statement;
    if (this.currentToken.type == 'IF') {
      statement = this.ifExpr();
    } else if (['DO', 'LOOP'].includes(this.currentToken.type)) {
      statement = this.loopExpr();
    } else if (this.currentToken.type == 'ID') {
      statement = this.assigmentExpr();
    } else if (this.currentToken.type == 'OUT') {
      statement = this.outputExpr();
    } else if (this.currentToken.type == 'IN') {
      statement = this.inputExpr();
    } else if (['INTEGER', 'FLOAT', 'AUTO', 'BOOL'].includes(this.currentToken.type)) {
      statement = this.declaration();
    } else if (this.currentToken.type == 'EOB') {
      statement = this.none();
    } else {
      this.error('Invalid statement');
    }

    return statement;
  }

  /** */
  none() {
    return new ASTComponents.None();
  }

  /** */
  ifExpr() {
    this.match('IF');
    const condition = this.conditionalExpr();
    const trueBranch = this.flow();
    this.match('ELSE');
    const falseBranch = this.flow();
    this.match('ENDIF');
    return new ASTComponents.Condition(condition, trueBranch, falseBranch);
  }

  /** */
  loopExpr() {
    if (this.currentToken.type == 'DO') {
      this.match('DO');
      const loopBranch = this.flow();
      this.match('DOLOOP');
      const condition = this.conditionalExpr();
      this.match('EOB');
      this.match('ENDLOOP');

      return new ASTComponents.Loop(condition, loopBranch, true);
    } else {
      this.match('LOOP');
      const condition = this.conditionalExpr();
      const loopBranch = this.flow();
      this.match('ENDLOOP');

      return new ASTComponents.Loop(condition, loopBranch, false);
    }
  }

  /** */
  assigmentExpr() {
    const identifier = this.identifier();
    const token = this.currentToken;
    this.match('ASSIGN');
    const node = this.conditionalExpr();

    return new ASTComponents.Assign(identifier, token, node);
  }

  /** */
  conditionalExpr() {
    return this.logicalAndExpr();
  }
  
  /** */
  logicalOrExpr() {
    let node = this.logicalAndExpr();

    while (this.currentToken.type == 'LOR') {
      const operator = this.currentToken;
      this.match('LOR');
      node = new ASTComponents.BinaryOperator(node, operator, this.logicalOrExpr());
    }

    return node;
  }

  /** */
  logicalAndExpr() {
    let node = this.equalityExpr();

    while (this.currentToken.type == 'LAND') {
      const operator = this.currentToken;
      this.match('LAND');
      node = new ASTComponents.BinaryOperator(node, operator, this.logicalAndExpr());
    }

    return node;
  }

  /** */
  equalityExpr() {
    let node = this.relationalExpr();

    while (['EQ', 'NEQ'].includes(this.currentToken.type)) {
      const operator = this.currentToken;
      if (operator.type == 'EQ') {
        this.match('EQ');
      } else {
        this.match('NEQ');
      }
      node = new ASTComponents.BinaryOperator(node, operator, this.equalityExpr());
    }

    return node;
  }
  
  /** */
  relationalExpr() {
    let node = this.additiveExpr();

    while (['LT', 'LTET', 'GT', 'GTET'].includes(this.currentToken.type)) {
      const operator = this.currentToken;
      if (operator.type == 'LT') {
        this.match('LT');
      } else if (operator.type == 'LTET') {
        this.match('LTET');
      } else if (operator.type == 'GT') {
        this.match('GT');
      } else {
        this.match('GTET');
      }
      node = new ASTComponents.BinaryOperator(node, operator, this.relationalExpr());
    }

    return node;
  }

  /** */
  additiveExpr() {
    let node = this.multiplicativeExpr();

    while (['PLUS', 'MINUS'].includes(this.currentToken.type)) {
      const operator = this.currentToken;
      if (operator.type == 'PLUS') {
        this.match('PLUS');
      } else {
        this.match('MINUS');
      }

      node = new ASTComponents.BinaryOperator(node, operator, this.additiveExpr());
    }

    return node;
  }

  /** */
  multiplicativeExpr() {
    let node = this.powerExpr();

    while (['MUL', 'DIV', 'MOD'].includes(this.currentToken.type)) {
      const operator = this.currentToken;
      if (operator.type == 'MUL') {
        this.match('MUL');
      } else if (operator.type == 'DIV') {
        this.match('DIV');
      } else {
        this.match('MOD');
      }
      node = new ASTComponents.BinaryOperator(node, operator, this.multiplicativeExpr());
    }

    return node;
  }

  /** */
  powerExpr() {
    let node = this.expr();

    while (this.currentToken.type == 'POW') {
      const operator = this.currentToken;
      this.match('POW');
      node = new ASTComponents.BinaryOperator(node, operator, this.powerExpr());
    }

    return node;
  }

  /** */
  expr() {
    const token = this.currentToken;
    if (token.type == 'ID') {
      return this.identifier();
    } else if (token.type == 'PLUS') {
      this.match('PLUS');
      return new ASTComponents.UnaryOperator(token, this.expr());
    } else if (token.type == 'MINUS') {
      this.match('MINUS');
      return new ASTComponents.UnaryOperator(token, this.expr());
    } else if (token.type == 'NOT') {
      this.match('NOT');
      return new ASTComponents.UnaryOperator(token, this.expr());
    } else if (token.type == 'LPAREN') {
      this.match('LPAREN');
      const node = this.conditionalExpr();
      this.match('RPAREN');
      return node;
    } else {
      return this.constant();
    }
  }

  /** */
  constant() {
    const token = this.currentToken;
    if (token.type == 'INTEGER_CONST') {
      this.match('INTEGER_CONST');
      return new ASTComponents.Number(token);
    } else if (token.type == 'FLOAT_CONST') {
      this.match('FLOAT_CONST');
      return new ASTComponents.Number(token);
    } else if (token.type == 'FALSE_CONST' || token.type == 'TRUE_CONST') {
      this.match(token.type);
      return new ASTComponents.BoolVal(token);
    }
  }

  /** */
  identifier() {
    const token = this.currentToken;
    this.match('ID');

    return new ASTComponents.Var(token);
  }

  /** */
  outputExpr() {
    this.match('OUT');
    const expr = this.conditionalExpr();

    return new ASTComponents.Output(expr);
  }

  /** */
  inputExpr() {
    this.match('IN');
    const id = this.identifier();

    return new ASTComponents.Assign(id, new Token('ASSIGN', '='), new ASTComponents.Input(''));
  }

  /** */
  declaration() {
    const type = this.typeDef();
    const identifiers = [this.identifier()];

    while (this.currentToken.type == 'COMMA') {
      this.match('COMMA');
      identifiers.push(this.identifier());
    }

    const variableDeclarations = [];

    for (const identifier of identifiers) {
      variableDeclarations.push(new ASTComponents.VarDecl(identifier, type));
    }

    return variableDeclarations;
  }

  /** */
  typeDef() {
    const token = this.currentToken;
    if (token.type == 'INTEGER') {
      this.match('INTEGER');
    } else if (token.type == 'FLOAT') {
      this.match('FLOAT');
    } else if (token.type == 'BOOL') {
      this.match('BOOL');
    } else {
      this.match('AUTO');
    }

    return new ASTComponents.Type(token);
  }
}
