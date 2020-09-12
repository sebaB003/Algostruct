/**
 * Tokens are used to identify parts of the interpreted code.
 */
export class Token {
  /**
   * @param {*} type
   * @param {*} value
   * @param {*} blockId
   * @param {*} pos
   */
  constructor(type, value, blockId, pos) {
    this.type = type;
    this.value = value;
    this.blockId = blockId;
    this.pos = pos;
  }
}

/**
* Returns Token formatted content
* @return {String}
*/
Token.prototype.toString = function toString() {
  return `Token(${this.type}: ${this.value})[Block ID: ${this.blockId}:${this.pos}]`;
};
