/**
 * Flowchart
 */
export class Flowchart {
  /**
   *
   */
  constructor() {
    this.structure;
  }

  /**
   * Interate trougth the flowchart and apply a function
   * @param {*} pointer: current position of the iterator in the flowchart
   * @param {*} condition: set when the iteration must end
   * @param {*} callback: the function to apply
   */
  _parse(pointer=this.structure,
      condition=(p)=> p.type != 'end',
      callback=null) {
    while (condition(pointer)) {
      if (pointer.type == 'condition' && pointer.nextBlock2) {
        this._parse(pointer.nextBlock2, (p)=> p.branchID == p.nextBlock.branchID, callback);
      }
      if (callback) {
        callback(pointer);
      }
      pointer = pointer.nextBlock;
    }
    if (callback) {
      callback(pointer);
    }
  }

  /**
   * Apply a function to the flowchart
   * @param {*} func: the function to apply
   */
  apply(func) {
    this._parse(this.structure, (p)=> p.type != 'end', func);
  }

  /**
   * Reorders the blocks and puts the blocks
   * at the same distance.
  */
  reorder() {
    // TODO: find a way to render the branch with the right size
    this._parse(this.structure, (p)=> p.type != 'end', function(block) {
      if (block.previousBlock) {
        if (block.type == 'node') {
          block.posY = Math.max(
              block.previousBlock.posY + 50 + block.previousBlock.height,
              block.previousBlock2.posY + 50 + block.previousBlock2.height);
        } else {
          block.posY = block.previousBlock.posY + 50 + block.previousBlock.height;
          block.posX = block.previousBlock.posX;
        }
      }
    });
  }
}
