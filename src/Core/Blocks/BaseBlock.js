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
    if (this.type == 'conditional') {
      if (this.previousBlock.previousBlock.type == 'conditional' &&
      this.branchID > this.previousBlock.previousBlock.branchID) {
        this.previousBlock.previousBlock.setSecondaryNextBlock(
            this.node.nextBlock);
      } else {
        this.previousBlock.previousBlock.setNextBlock(this.node.nextBlock);
      }
      this.node.nextBlock.setPreviousBlock(this.previousBlock.previousBlock);
    } else {
      if (this.previousBlock.previousBlock.type == 'conditional' &&
      this.branchID > this.previousBlock.previousBlock.branchID) {
        this.previousBlock.previousBlock.setSecondaryNextBlock(this.nextBlock);
      } else {
        this.previousBlock.previousBlock.setNextBlock(this.nextBlock);
      }
      this.nextBlock.setPreviousBlock(this.previousBlock.previousBlock);
    }

    this.updateStructure();
  }

  /** */
  cut() {
    builderData.notes = this;
    this.delete();
  }

  /** */
  copy() {
    builderData.notes = Object.assign(new this.constructor, this);
  }

  /**
   *
   * @param {*} pointer
   */
  static setBranchOffset(pointer) {
    if (pointer.previousBlock) {
      if (pointer.previousBlock.type == 'conditional') {
        if (pointer.branchID > pointer.previousBlock.branchID) {
          pointer.posX = pointer.previousBlock.posX - 200;
        } else {
          pointer.posX = pointer.previousBlock.posX + 200;
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
      }
    }
  }

  /**
   *
   * @param {*} pointer
   * @param {*} condition
   */
  updateStructure(pointer=this.nextBlock,
      condition=(p) => p.nextBlock != undefined) {
    if (pointer.previousBlock) {
      pointer.posX = pointer.previousBlock.posX;
    }
    BaseBlock.setBranchOffset(pointer);
    BaseBlock.centerNode(pointer);

    while (condition(pointer)) {
      if (pointer.previousBlock) {
        pointer.posY = pointer.previousBlock.posY +
        pointer.previousBlock.height + 50;
      }

      if (pointer.type == 'conditional' && pointer.nextBlock2) {
        this.updateStructure(pointer.nextBlock2, (p)=> p.type != 'end');
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
   * @param {*} pointer
   * @param {*} condition
   */
  reorderStructure(pointer=this.nextBlock ? this.nextBlock : this,
      condition=(p) => p.nextBlock != undefined) {
    while (condition(pointer)) {
      if (pointer.previousBlock) {
        pointer.posX = pointer.previousBlock.posX;
      }
      if (pointer.previousBlock) {
        pointer.posY = pointer.previousBlock.posY +
        pointer.previousBlock.height + 50;
      }
      BaseBlock.setBranchOffset(pointer);
      BaseBlock.centerNode(pointer);
      if (pointer.type == 'conditional' && pointer.nextBlock2) {
        this.reorderStructure(pointer.nextBlock2,
            (p)=> p.branchID == p.nextBlock.branchID);
      }
      pointer = pointer.nextBlock;
    }
    if (pointer.previousBlock) {
      pointer.posY = pointer.previousBlock.posY +
      pointer.previousBlock.height + 50;
    }
    pointer.posX = pointer.previousBlock.posX;
  }

  /**
   *
   * @param {*} x
   * @param {*} y
   * @param {*} pointer
   * @param {*} condition
   */
  moveStructure(x, y, pointer=this, condition=(p) => p.nextBlock != undefined) {
    while (condition(pointer)) {
      if (pointer.type == 'conditional' && pointer.nextBlock2) {
        this.moveStructure(x, y, pointer.nextBlock2,
            (p)=> p.branchID == p.nextBlock.branchID);
      }
      pointer.posY += y;
      pointer.posX += x;
      pointer = pointer.nextBlock;
    }
    pointer.posY += y;
    pointer.posX += x;
  }
}
