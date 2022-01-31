import {Token} from './Token';
import * as token from './Tokens';
import {RESERVED_KEY} from './ReservedKey';

/** */
export class Lexer {
  /**
   * @param {*} block
   * @param {*} logsView
   * @param {*} outputView
   */
  constructor(block, logsView, outputView) {
    this.current_block = block;

    this.logsView = logsView;
    this.outputView = outputView;

    this.conditionStack = [];
    this.nodeStack = [];

    this.text = block.content;
    this.pos = 0;
    this.current_character = this.text[this.pos];
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
   * Returns the next flowchart block
   * @return {BaseBlock}
   */
  peekBlock() {
    const nextBlock = this.current_block.nextBlock;

    if (nextBlock == undefined) {
      return undefined;
    } else {
      return nextBlock;
    }
  }

  /**
   * Returns the next character of the current block content
   * @return {String}
   */
  peek() {
    const nextPos = this.pos + 1;

    if (nextPos > this.text.length - 1) {
      return null;
    }

    return this.text[this.pos + 1];
  }

  /**
   * Moves to the next block
   */
  advanceBlock() {
    const peekBlock = this.peekBlock();

    if (!peekBlock) {
      this.current_block = null;
    } else if (peekBlock.type == 'insert') {
      this.current_block = peekBlock;
      this.text = ' ';
      this.pos = 0;
      this.current_character = this.text[this.pos];
    } else if (peekBlock.type == 'node') {
      if (peekBlock.nType == 'if') {
        if (this.conditionStack.length) {
          if (this.conditionStack[this.conditionStack.length-1].node == peekBlock) {
            this.current_block = this.conditionStack[this.conditionStack.length-1].nextBlock2;
            this.text = ' ELSE ';
            this.conditionStack.pop();
          } else {
            this.current_block = peekBlock;
            this.text = 'ENDIF EOB';
          }
        } else {
          this.current_block = peekBlock;
          this.text = 'ENDIF EOB';
        }
      } else if (peekBlock.nType == 'dl') {
        this.current_block = peekBlock;
        this.nodeStack.push(peekBlock);
        this.text = 'DO ';
      } else if (peekBlock.nType == 'lo') {
        if (this.conditionStack.length) {
          if (this.conditionStack[this.conditionStack.length-1].node == peekBlock) {
            this.conditionStack.pop();
            this.current_block = peekBlock.nextBlock.nextBlock;
            this.text = ' ENDLOOP EOB ';
          } else {
            this.current_block = peekBlock;
            this.text = ' ';
          }
        } else {
          this.current_block = peekBlock;
          this.text = ' ';
        }
      } else {
        this.current_block = peekBlock;
        this.text = ' ';
      }

      this.pos = 0;
      this.current_character = this.text[this.pos];
    } else if (peekBlock.type == 'output') {
      this.current_block = peekBlock;
      this.text = 'OUT ' + this.current_block.content + ' EOB ';
      this.pos = 0;
      this.current_character = this.text[this.pos];
    } else if (peekBlock.type == 'input') {
      this.current_block = peekBlock;
      this.text = 'IN ' + this.current_block.content + ' EOB ';
      this.pos = 0;
      this.current_character = this.text[this.pos];
    } else if (peekBlock.type == 'condition') {
      this.current_block = peekBlock;
      if (peekBlock.node == this.nodeStack[this.nodeStack.length-1]) {
        this.nodeStack.pop();
        this.text = 'DOLOOP ' + this.current_block.content + ' EOB ENDLOOP EOB ';
      } else if (peekBlock.node.nType == 'lo') {
        this.conditionStack.push(peekBlock);
        this.current_block = peekBlock.nextBlock2;
        this.text = 'LOOP ' + peekBlock.content + ' EOB ';
      } else {
        this.conditionStack.push(peekBlock);
        this.text = 'IF ' + this.current_block.content + ' EOB ';
      }
      this.pos = 0;
      this.current_character = this.text[this.pos];
    } else {
      this.current_block = peekBlock;
      this.text = this.current_block.content + ' EOB ';
      this.pos = 0;
      this.current_character = this.text[this.pos];
    }
  }

  /**
   * Moves to the next character
   */
  advance() {
    this.pos++;

    if (this.pos > this.text.length - 1) {
      this.current_character = null;
      this.advanceBlock();
    } else {
      this.current_character = this.text[this.pos];
    }
  }

  /**
   * Skip all space occurency untill the next Token
  */
  skipSpaces() {
    while (
      this.current_character != null && /\s/.test(this.current_character)
    ) {
      this.advance();
    }
  }

  /**
   * Find and returns a number token
   * @return {Number}
   */
  getNumber() {
    let number = '';

    while (
      this.current_character != null &&
      /[0-9]/.test(this.current_character)
    ) {
      number += this.current_character;
      this.advance();
    }

    if (this.current_character == '.') {
      number += '.';
      this.advance();

      while (
        this.current_character != null &&
        /[0-9]/.test(this.current_character)
      ) {
        number += this.current_character;
        this.advance();
      }
      return new Token(token.FLOAT_CONST, parseFloat(number));
    } else {
      return new Token(token.INTEGER_CONST, parseInt(number));
    }
  }

  /**
   * Find and returns an identifier token
   * @return {String}
  */
  getId() {
    let id = '';

    while (
      this.current_character != null &&
      /[_a-zA-z0-9]/.test(this.current_character)
    ) {
      id += this.current_character;
      this.advance();
    }

    const token = RESERVED_KEY[id] ?
                  RESERVED_KEY[id] :
                  new Token('ID', id);

                  console.log(token);
    return token;
  }

  /**
   * Find and returns a string
   * @return {String}
  */
   getString(char) {
    let string = '';
    this.advance();

    while (
      this.current_character != null && this.current_character != char
    ) {
      string += this.current_character;
      this.advance();
    }
    this.advance();

    return new Token(token.STRING_CONST, string);
  }

  /**
   * Returns the next code token
   * @return {Token}
   */
  getNextToken() {
    while (this.current_character != null) {
      const tokenBlockId = this.current_block.id;
      const tokenStartPos = this.pos;

      if (this.current_character == ' ') {
        this.skipSpaces();
        continue;
      }

      if (/[0-9]/.test(this.current_character)) {
        const token = this.getNumber();
        token.blockId = tokenBlockId;
        token.pos = tokenStartPos;
        return token;
      }

      if (/[_a-zA-z]/.test(this.current_character)) {
        const token = this.getId();
        token.blockId = tokenBlockId;
        token.pos = tokenStartPos;
        return token;
      }

      if (/[\"]/.test(this.current_character)) {
        const token = this.getString('\"');
        token.blockId = tokenBlockId;
        token.pos = tokenStartPos;
        return token;
      }

      if (this.current_character == '=' && this.peek() == '=') {
        this.advance();
        this.advance();
        return new Token(token.EQ, '==', tokenBlockId, tokenStartPos);
      }

      if (this.current_character == '!' && this.peek() == '=') {
        this.advance();
        this.advance();
        return new Token(token.NEQ, '!=', tokenBlockId, tokenStartPos);
      }

      if (this.current_character == '<' && this.peek() == '=') {
        this.advance();
        this.advance();
        return new Token(token.LTET, '<=', tokenBlockId, tokenStartPos);
      }

      if (this.current_character == '>' && this.peek() == '=') {
        this.advance();
        this.advance();
        return new Token(token.GTET, '>=', tokenBlockId, tokenStartPos);
      }

      if (this.current_character == '&' && this.peek() == '&') {
        this.advance();
        this.advance();
        return new Token(token.LAND, '&&', tokenBlockId, tokenStartPos);
      }

      if (this.current_character == '|' && this.peek() == '|') {
        this.advance();
        this.advance();
        return new Token(token.LOR, '||', tokenBlockId, tokenStartPos);
      }

      if (this.current_character == '<') {
        this.advance();
        return new Token(token.LT, '<', tokenBlockId, tokenStartPos);
      }

      if (this.current_character == '>') {
        this.advance();
        return new Token(token.GT, '>', tokenBlockId, tokenStartPos);
      }

      if (this.current_character == '+') {
        this.advance();
        return new Token(token.PLUS, '+', tokenBlockId, tokenStartPos);
      }

      if (this.current_character == '-') {
        this.advance();
        return new Token(token.MINUS, '-', tokenBlockId, tokenStartPos);
      }

      if (this.current_character == '*') {
        this.advance();
        return new Token(token.MUL, '*', tokenBlockId, tokenStartPos);
      }

      if (this.current_character == '/') {
        this.advance();
        return new Token(token.DIV, '/', tokenBlockId, tokenStartPos);
      }

      if (this.current_character == '%') {
        this.advance();
        return new Token(token.MOD, '%', tokenBlockId, tokenStartPos);
      }

      if (this.current_character == ',') {
        this.advance();
        return new Token(token.COMMA, ',', tokenBlockId, tokenStartPos);
      }

      if (this.current_character == '!') {
        this.advance();
        return new Token(token.NOT, '!', tokenBlockId, tokenStartPos);
      }

      if (this.current_character == ';') {
        this.advance();
        return new Token(token.SEMICOLON, ';', tokenBlockId, tokenStartPos);
      }

      if (this.current_character == ':') {
        this.advance();
        return new Token(token.COLON, ':', tokenBlockId, tokenStartPos);
      }

      if (this.current_character == '=') {
        this.advance();
        return new Token(token.ASSIGN, '=', tokenBlockId, tokenStartPos);
      }

      if (this.current_character == '(') {
        this.advance();
        return new Token(token.LPAREN, '(', tokenBlockId, tokenStartPos);
      }

      if (this.current_character == ')') {
        this.advance();
        return new Token(token.RPAREN, ')', tokenBlockId, tokenStartPos);
      }

      this.error(`Invalid character '${this.current_character}' at [Block ID: ${tokenBlockId}:${tokenStartPos}]`);
    }

    return new Token(token.EOF, null);
  }

  /** */
  lex() {
    let currentToken = 0;
    while (currentToken.type != token.EOF) {
      currentToken = this.getNextToken();
      console.log(currentToken);
    }
  }
}