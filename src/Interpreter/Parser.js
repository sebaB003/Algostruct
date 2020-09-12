import * as tokens from './Tokens';
import * as ASTComponents from './AST';
import { lex } from './Interpreter';

/*
  flowchart : 'START' flow 'END'
            ;

  flow : statement*
       ;

  statement : declaration
            | exec
            | ''
            | ';'
            ;

  declaration : typeDef identifier (',' identifier)* ';'

  typeDef : 'int'
          | 'float'
          | 'auto'
          ;

  identifier : /[_a-zA-Z][_a-zA-Z0-9]/

  exec : identifier '=' expr;
       ;

  expr : term ('+' | '-' term)*
       ;

  term : fact ('*' | '-' | '^' term)
       ;

  fact : integer_const
       | float_const
       | '-' fact
       | '+' fact
       | '(' expr ')'
       | identifier
       ;

  integer_const : [0-9]*

  float_const : / [0-9]*.[0-9]* /

  PRECEDENCE TABLE
  ____________________________________________
  | PREC LEVEL | ASSOCIATIVITY | OPERATORS   |
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
   * @param {*} message
   */
  log(message) {
    if (this.logsView) {
      this.logsView.console.log(message);
    }
  }

  /**
   * @param {*} message
   */
  error(message) {
    if (this.logsView) {
      this.logsView.console.error(message, false);
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
      throw new Error(`Invalid token:${this.currentToken}\n\tExpected: ${tokenType}`);
    }
  }

  /** */
  flowchart() {
    this.match('START');
    const result = this.flow();
    this.match('END');

    return result;
  }

  /** */
  flow() {
    const blocks = [];

    while (this.currentToken.type != 'END') {
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

    this.match('EOB');

    return new ASTComponents.Block(statements);
  }

  /** */
  statement() {
    let statement;
    if (this.currentToken.type == 'ID') {
      statement = this.exec();
    } else if (['INTEGER', 'FLOAT', 'AUTO'].includes(this.currentToken.type)) {
      statement = this.declaration();
    } else {
      statement = this.none();
    }

    return statement;
  }

  /** */
  none() {
    return new ASTComponents.None();
  }

  /** */
  exec() {
    const identifier = this.identifier();

    const token = this.currentToken;

    this.match('ASSIGN');

    const expr = this.expr();

    return new ASTComponents.Assign(identifier, token, expr);
  }

  /** */
  identifier() {
    const token = this.currentToken;
    this.match('ID');

    return new ASTComponents.Var(token);
  }

  /** */
  expr() {
    let node = this.term();

    while (['MUL', 'DIV', 'EXP'].includes(this.currentToken.type)) {
      const operator = this.currentToken;

      if (this.currentToken.type == 'MUL') {
        this.match('MUL');
      } else if (this.currentToken.type == 'DIV') {
        this.match('DIV');
      } else {
        this.match('EXP');
      }

      node = new ASTComponents.BinaryOperator(node, operator, this.term());
    }

    return node;
  }

  /** */
  term() {
    let node = this.fact();

    while (['PLUS', 'MINUS'].includes(this.currentToken.type)) {
      const operator = this.currentToken;

      if (this.currentToken.type == 'PLUS') {
        this.match('PLUS');
      } else {
        this.match('MINUS');
      }

      node = new ASTComponents.BinaryOperator(node, operator, this.fact());
    }

    return node;
  }

  /** */
  fact() {
    const token = this.currentToken;
    if (this.currentToken.type == 'PLUS') {
      this.match('PLUS');
      return new ASTComponents.UnaryOperator(token, this.fact());
    } else if (this.currentToken.type == 'MINUS') {
      this.match('MINUS');
      return new ASTComponents.UnaryOperator(token, this.fact());
    } else if (this.currentToken.type == 'INTEGER_CONST') {
      this.match('INTEGER_CONST');
      return new ASTComponents.Number(token);
    } else if (this.currentToken.type == 'FLOAT_CONST') {
      this.match('FLOAT_CONST');
      return new ASTComponents.Number(token);
    } else if (this.currentToken.type == 'LPAREN') {
      this.match('LPAREN');
      const node = this.expr();
      this.match('RPAREN');
      return node;
    } else {
      return this.identifier();
    }
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
    } else {
      this.match('AUTO');
    }

    return new ASTComponents.Type(token);
  }
}
