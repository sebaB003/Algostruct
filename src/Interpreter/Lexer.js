import {Token} from './Token';
import * as token from './Tokens';
import {RESERVED_KEY} from './ReservedKey';

/** */
export class Lexer {
  /**
   * @param {*} block
   */
  constructor(block) {
    this.current_block = block;
    this.text = block.content;
    this.pos = 0;
    this.current_character = this.text[this.pos];
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
    } else if (this.peekBlock().type == 'insert' ||
      this.peekBlock().type == 'node'
    ) {
      this.current_block = peekBlock;
      this.text = ' ';
      this.pos = 0;
      this.current_character = this.text[this.pos];
    } else {
      this.current_block = peekBlock;
      this.text = this.current_block.content + ' EOB';
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

    return token;
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

      if (this.current_character == '^') {
        this.advance();
        return new Token(token.EXP, '^', tokenBlockId, tokenStartPos);
      }

      if (this.current_character == ',') {
        this.advance();
        return new Token(token.COMMA, ',', tokenBlockId, tokenStartPos);
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
