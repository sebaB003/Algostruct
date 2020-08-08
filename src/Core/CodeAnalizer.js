import {checkVariable, checkNumber, checkString, checkOperationRegex, checkConditionRegex} from './Utils/Regex';

/**
 * Syntax Checker
 */
export class CodeAnalizer {
  /**
 * Returns the type of a variable
 * @param {*} value the value of the variable to find the type
 * @return {String} type
 */
  static getVariableType(value) {
    let type = '';
    if (checkFloat.test(value)) {
      type = 'Float';
    } else if (checkBoolean.test(value)) {
      type = 'Bool';
    } else if (checkString.test(value)) {
      type = 'String';
    } else if (checkNumber.test(value)) {
      type = 'Interger';
    } else {
      type = 'Undefined';
    }
    return type;
  }

  /**
   * Checks if in a statement there are undefined
   * variables
   * @param {*} variablePool defined variables
   * @param {*} statement the statement to check
   * @return {String} returns a message that contains not defined variables
   */
  static checkVariableExistence(variablePool, statement) {
    let message = 'You must define ';
    let areVariablesDefined = true;

    console.log(variablePool);

    const extractedVariables = statement.match(/([A-Za-z_][[A-Za-z0-9_]*)/gm);

    if (areVariablesDefined) {
      message = 1;
    }

    return message;
  }
}
