import {checkVariable, checkStatementRegex, checkConditionRegex, checkOutputRegex} from './Utils/Regex';

/**
 * Syntax Checker
 */
export class SyntaxChecker {
  /**
   * Check the syntax of a blcok content
   * @param {BaseBlock} block
   * @return {boolean} result
   */
  static checkBlockSyntax(block) {
    let result = false;

    switch (block.type) {
      case 'statement':
        result = SyntaxChecker._checkStatementSyntax(block.content);
        break;
      case 'input':
        result = SyntaxChecker._checkInputSyntax(block.content);
        break;
      case 'output':
        result = SyntaxChecker._checkOutputSyntax(block.content);
        break;
      case 'condition':
        result = SyntaxChecker._checkConditionSyntax(block.content);
        break;
      case 'comment':
        result = true;
        break;
    }

    return result;
  }

  /**
   * @param {string} content the block content to check
   * @return {boolean} isSyntaxCorrect
  */
  static _checkStatementSyntax(content) {
    const statements = content.split(';');
    if (!statements[statements.length-1]) {
      statements.pop();
    }

    let isSyntaxCorrect = false;

    if (statements.length) {
      for (const statement of statements) {
        console.log(statement);
        if (checkStatementRegex.test(statement.trim()) &&
            checkParenthesis(statement.trim())) {
          isSyntaxCorrect = true;
        } else {
          isSyntaxCorrect = false;
          break;
        }
      }
    } else {
      isSyntaxCorrect = true;
    }

    return isSyntaxCorrect;
  }

  /**
   * @param {string} content the block content to check
   * @return {boolean} isSyntaxCorrect
  */
  static _checkInputSyntax(content) {
    let isSyntaxCorrect = false;
    if (checkVariable.test(content.trim())) {
      isSyntaxCorrect = true;
    }

    return isSyntaxCorrect;
  }

  /**
   * @param {string} content the block content to check
   * @return {boolean} isSyntaxCorrect
  */
  static _checkOutputSyntax(content) {
    const statements = content.split('+');
    let isSyntaxCorrect = false;

    for (const statement of statements) {
      if (checkOutputRegex.test(statement)) {
        isSyntaxCorrect = true;
      } else {
        isSyntaxCorrect = false;
        break;
      }
    }

    return isSyntaxCorrect;
  }

  /**
   * @param {string} content the block content to check
   * @return {boolean} isSyntaxCorrect
  */
  static _checkConditionSyntax(content) {
    let isSyntaxCorrect = false;
    if (checkConditionRegex.test(content.trim()) &&
      checkParenthesis(content.trim())) {
      isSyntaxCorrect = true;
    }

    return isSyntaxCorrect;
  }
}

/**
 * Check if parenthesis are in the correct order
 * and check if are closed
 * @param {string} string
 * @return {string} string
 */
function checkParenthesis(string) {
  const buffer = [];

  for (const char of string) {
    switch (char) {
      case '(':
        buffer.push(0);
        break;
      case '[':
        buffer.push(1);
        break;
      case '{':
        buffer.push(3);
        break;
      case ')':
        if (buffer[buffer.length - 1] == 0) {
          buffer.pop();
        }
        break;
      case ']':
        if (buffer[buffer.length - 1] == 1) {
          buffer.pop();
        }
        break;
      case '}':
        if (buffer[buffer.length - 1] == 2) {
          buffer.pop();
        }
        break;
      default:
        break;
    }
  }

  return buffer.length == 0;
}
