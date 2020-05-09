import {checkVariable} from './Utils/Regex';

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
      case 'define':
        result = SyntaxChecker._checkDefineSyntax(block.content);
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
    }

    return result;
  }

  /**
   * @param {string} content the block content to check
   * @return {boolean} isSyntaxCorrect
  */
  static _checkDefineSyntax(content) {
    let isSyntaxCorrect = false;
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
  */
  static _checkOutputSyntax(content) {
    const statements = content.split(';');
    let isSyntaxCorrect = false;

    for (const statement in statements) {
      if (checkVariable.test(statement.trim())) {
        isSyntaxCorrect = true;
      } else {
        isSyntaxCorrect = false;
        break;
      }
    }
  }

  /**
   * @param {string} content the block content to check
  */
  static _checkConditionSyntax(content) {
  }
}
