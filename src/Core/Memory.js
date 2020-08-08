/**
 * Memory
 */
export class Memory {
  /** */
  constructor() {
    this._memory = new Map();
    this._idsBuffer = new Set();
  }

  /**
   * Returns the value of valueID ID
   * @param {number} valueID the value ID
   * @return {*} value
   */
  get(valueID) {
    const value = this._memory.get(valueID);
    return value;
  }

  /**
   * Delete the value of valueID ID
   * @param {number} valueID the value ID
   */
  delete(valueID) {
    this._idsBuffer.add(valueID);
    this._memory.delete(valueID);
  }

  /**
   * Generate a new ID
   * @return {number} ID
  */
  generateID() {
    // this._checkIDs();
    let ID;
    if (this._idsBuffer.size) {
      ID = Array.from(this._idsBuffer.values())[0];
      this._idsBuffer.delete(ID);
      return ID;
    } else {
      return this._memory.size + 1;
    }
  }

  /**
   * Find memory gap and push the free memory id
   * to a dump
  */
  _checkIDs() {
    this.reorder();
    let prevId = 0;
    for (const ID of this._memory.keys()) {
      const gap = ID - prevId;

      console.log(ID, gap);
      if (gap > 1) {
        for (let possibleID = prevId + 1; possibleID < ID; possibleID++) {
          this._idsBuffer.add(possibleID);
        }
      }
      prevId = ID;
    }
  }

  /**
   * Reorders the memory by IDs
  */
  reorder() {
    this._memory = new Map([...this._memory.entries()].sort());
  }

  /**
   * Add a value to the memory and
   * generate an unique ID
   * @param {*} value
  */
  add(value) {
    const ID = this.generateID();
    value.id = ID;
    this._memory.set(ID, value);
  }

  /**
   * Clear the memory
  */
  reset() {
    this._memory = new Map();
    this._idsBuffer = new Set();
  }

  /**
   * @return {*} memory values
   */
  [Symbol.iterator]() {
    return this._memory.values();
  }
}
