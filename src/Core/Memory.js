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
   * Returns the block of blockID ID
   * @param {number} blockID the block ID
   * @return {*} block
   */
  get(blockID) {
    const block = this._memory.get(blockID);
    return block;
  }

  /**
   * Delete the block of blockID ID
   * @param {number} blockID the block ID
   */
  delete(blockID) {
    this._idsBuffer.add(blockID);
    this._memory.delete(blockID);
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
   * Add a block to the memory and
   * generate an unique ID
   * @param {*} block
  */
  add(block) {
    const ID = this.generateID();
    block.id = ID;
    this._memory.set(ID, block);
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
