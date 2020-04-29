const cloneobj = require('lodash.clonedeep');
/**
 * Flowchart
 */
export class Flowchart {
  /**
   *
   */
  constructor() {
    this.structure;
    this.comments = [];
    this.selected = undefined;
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
      if (callback) {
        callback(pointer);
      }
      if (pointer.type == 'condition' && pointer.nextBlock2) {
        if (pointer.node != pointer.nextBlock2) {
          this._parse(pointer.nextBlock2, (p)=> p.branchID == p.nextBlock.branchID, callback);
        }
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
   * @param {*} block
   * @return {*} blockCopy
   * TODO: deep copy of conditional block
   */
  copy(block) {
    if (block.type != 'condition') {
      const blockCopy = Object.assign(new block.constructor, block);
      return blockCopy;
    }
    return undefined;
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
          if (block != block.nextBlock.node && block.previousBlock2.type != 'condition') {
            block.posY = Math.max(
                block.previousBlock.posY + 50 + block.previousBlock.height,
                block.previousBlock2.posY + 50 + block.previousBlock2.height);
            block.posX = (block.previousBlock.posX + block.previousBlock2.posX) / 2;
          } else {
            block.posY = block.previousBlock.posY + 50 + block.previousBlock.height;
            block.posX = block.previousBlock.posX;
          }
        } else {
          block.posY = block.previousBlock.posY + 50 + block.previousBlock.height;
          block.posX = block.previousBlock.posX;
        }
        if (block.previousBlock.type == 'condition') {
          if (block.branchID > block.previousBlock.branchID) {
            block.posX -= block.previousBlock.secondaryBrenchWidth * 200;
          } else {
            block.posX += block.previousBlock.brenchWidth * 200;
          }
        }
      }
    });
  }

  /**
   * @param {*} block
   */
  select(block) {
    if (this.selected) {
      this.selected.isSelected = false;
    }
    block.isSelected = true;
    this.selected = block;
  }
}
