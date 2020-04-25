/**
 * TODO: reorganize class
 * TODO: find a way to render branches
 * TODO: create SVGGenerator
*/
export class BaseBlock {
  /**
   *
   * @param {*} type
   */
  constructor(type) {
    this.type = type;
    this.nextBlock;
    this.previousBlock;
    this.posX = 0;
    this.posY = 0;
    this.content = '';
    this.branchID = 0;
  }

  /**
   *
   * @param {*} nextBlock
   */
  setNextBlock(nextBlock) {
    this.nextBlock = nextBlock;
  }

  /**
   *
   * @param {*} previousBlock
   */
  setPreviousBlock(previousBlock) {
    this.previousBlock = previousBlock;
  }

  /**
   *
   * @param {*} block
   */
  insert(block) {
    const previous = this.nextBlock;
    this.setNextBlock(block);
    block.setPreviousBlock(this);
    block.setNextBlock(previous);
    block.branchID = block.previousBlock.branchID;
    if (previous.type == 'node' && block.branchID > previous.branchID) {
      previous.setSecondaryPreviousBlock(block);
    } else {
      previous.setPreviousBlock(block);
    }
    // if (block.type == 'condition') {
    //   this.updateBranchOffset(block);
    // }
    this.updateStructure();
  }

  /**
   *
   * @param {*} block
   */
  createSecondaryBranch(block) {
    const previousBlock = this.nextBlock.nextBlock;
    this.setSecondaryNextBlock(block);
    block.setPreviousBlock(this);
    block.setNextBlock(previousBlock);
    previousBlock.setSecondaryPreviousBlock(block);
    block.branchID = block.previousBlock.branchID + 1;
    this.updateStructure(this.nextBlock2);
  }

  /** */
  delete() {
    if (this.type == 'condition') {
      if (this.previousBlock.type == 'node' || this.nextBlock2 == this.node) {
        this.node.previousBlock.setNextBlock(this.nextBlock.nextBlock);
        if (this.nextBlock.nextBlock.branchID < this.nextBlock.branchID) {
          this.nextBlock.nextBlock.setSecondaryPreviousBlock(this.node.previousBlock);
        } else {
          this.nextBlock.nextBlock.setPreviousBlock(this.node.previousBlock);
        }
      } else {
        if (this.previousBlock.previousBlock.type == 'condition' &&
        this.branchID > this.previousBlock.previousBlock.branchID) {
          this.previousBlock.previousBlock.setSecondaryNextBlock(
              this.node.nextBlock);
        } else {
          this.previousBlock.previousBlock.setNextBlock(this.node.nextBlock);
        }
        this.node.nextBlock.setPreviousBlock(this.previousBlock.previousBlock);
      }
    } else {
      if (this.previousBlock.previousBlock.type == 'condition' &&
      this.branchID > this.previousBlock.previousBlock.branchID) {
        this.previousBlock.previousBlock.setSecondaryNextBlock(this.nextBlock);
      } else {
        this.previousBlock.previousBlock.setNextBlock(this.nextBlock);
      }
      this.nextBlock.setPreviousBlock(this.previousBlock.previousBlock);
    }

    this.updateStructure();
    delete(this);
  }

  /**
   *
   * @param {*} pointer
   */
  updateBranchOffset(pointer) {
    let prevCond = pointer;
    let leftBranchOffset = 1;
    let rightBranchOffset = 1;
    while (pointer.type != 'start') {
      if (pointer.type == 'condition') {
        if (prevCond.branchID == pointer.branchID) {
          pointer.brenchWidth = rightBranchOffset;
          rightBranchOffset += 1;
        } else {
          pointer.secondaryBrenchWidth = leftBranchOffset;
          leftBranchOffset += 1;
        }
      }
      prevCond = pointer;
      pointer = pointer.previousBlock;
    }
  }
  /**
   *
   * @param {*} pointer
   */
  static setBranchOffset(pointer) {
    if (pointer.previousBlock) {
      if (pointer.previousBlock.type == 'condition') {
        if (pointer.branchID > pointer.previousBlock.branchID) {
          pointer.posX -= pointer.previousBlock.secondaryBrenchWidth * 200;
        } else {
          pointer.posX += pointer.previousBlock.brenchWidth * 200;
        }
      }
    }
  }

  /**
   *
   * @param {*} pointer
   */
  static centerNode(pointer) {
    if (pointer.previousBlock && pointer.previousBlock2) {
      if (pointer.type == 'node') {
        pointer.posX = (pointer.previousBlock.posX +
          pointer.previousBlock2.posX) / 2;
        pointer.posY = Math.max(
            pointer.previousBlock.posY + 50 + pointer.previousBlock.height,
            pointer.previousBlock2.posY + 50 + pointer.previousBlock2.height);
      }
    }
  }

  /**
   *
   * @param {*} pointer
   * @param {*} condition
   */
  updateStructure(pointer=this.nextBlock,
      condition=(p) => p.type != 'end') {
    if (pointer.previousBlock) {
      pointer.posX = pointer.previousBlock.posX;
    }
    BaseBlock.setBranchOffset(pointer);
    BaseBlock.centerNode(pointer);

    while (condition(pointer)) {
      if (pointer.previousBlock) {
        pointer.posY = pointer.previousBlock.posY +
        pointer.previousBlock.height + 50;
        if (pointer.type == 'node' && pointer.previousBlock2) {
          if (pointer != pointer.nextBlock.node && pointer.previousBlock2.type != 'condition') {
            pointer.posY = Math.max(
                pointer.previousBlock.posY + 50 + pointer.previousBlock.height,
                pointer.previousBlock2.posY + 50 + pointer.previousBlock2.height);
          }
        }
      }

      if (pointer.type == 'condition' && pointer.nextBlock2) {
        if (pointer.node != pointer.nextBlock2) {
          this.updateStructure(pointer.nextBlock2, (p)=> p.branchID == p.nextBlock.branchID);
        }
      }
      pointer = pointer.nextBlock;
    }
    if (pointer.previousBlock) {
      pointer.posY = pointer.previousBlock.posY +
      pointer.previousBlock.height + 50;
    }
  }

  /**
   *
   * @param {*} x
   * @param {*} y
   * @param {*} pointer
   * @param {*} condition
   */
  moveStructure(x, y, pointer=this, condition=(p) => p.nextBlock != undefined && p.branchID == p.nextBlock.branchID) {
    while (condition(pointer)) {
      pointer.posY += y;
      if (pointer.type == 'node') {
        if (pointer.nextBlock == pointer.previousBlock2) {
          pointer.posX = pointer.previousBlock.posX;
        } else {
          pointer.posX = (pointer.previousBlock.posX + pointer.previousBlock2.posX) / 2;
        }
      } else {
        pointer.posX += x;
      }

      if (pointer.type == 'condition' && pointer.nextBlock2) {
        if (pointer.node != pointer.nextBlock2) {
          this.moveStructure(x, y, pointer.nextBlock2,
              (p)=> p.branchID == p.nextBlock.branchID);
        }
      }
      pointer = pointer.nextBlock;
    }
    pointer.posY += y;
    if (pointer.type == 'node' && pointer.previousBlock2.type == 'condition') {
      pointer.posX = pointer.previousBlock.posX;
    } else {
      pointer.posX += x;
    }
  }
}
