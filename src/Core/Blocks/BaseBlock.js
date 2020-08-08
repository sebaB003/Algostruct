/**
 * TODO: reorganize class
 * TODO: find a way to render branches
 * TODO: create SVGGenerator
*/
export class BaseBlock {
  /**
   * @param {*} type
   * @param {*} memoryReference
   */
  constructor(type, memoryReference) {
    this.memoryReference = memoryReference;
    this.id = undefined;
    this.type = type;
    this._nextBlockID;
    this._previousBlockID;
    this.posX = 0;
    this.posY = 0;
    this._content = '';
    this.width = 0;
    this.height = 0;
    this.branchID = 0;
    this.isSelected = false;
    this.hasErrors = false;
  }

  /**
   * @param {*} value
   */
  set content(value) {
    this._content = value;
    this.width = Math.max(this._content.length * 28 + 80, 200);
  }

  /** */
  get content() {
    return this._content;
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
   * @param {*} value
   */
  set nextBlock(value) {
    this._nextBlockID = value.id;
  }

  /**
   * @param {*} value
   */
  get nextBlock() {
    return this.memoryReference.get(this._nextBlockID);
  }

  /**
   * @param {*} value
   */
  set previousBlock(value) {
    this._previousBlockID = value.id;
  }

  /**
   * @param {*} value
   */
  get previousBlock() {
    return this.memoryReference.get(this._previousBlockID);
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
    pointer.posY = pointer.previousBlock.posY +
    pointer.previousBlock.height + 50;
  }

  /**
   *
   * @param {*} x
   * @param {*} y
   * @param {*} pointer
   * @param {*} condition
   */
  moveStructure(x, y, pointer=this, condition=(p) => p.nextBlock != undefined && p.branchID == p.nextBlock.branchID) {
    let nodeReached = false;

    while (condition(pointer)) {
      pointer.posY += y;
      if (pointer.type == 'node') {
        nodeReached = true;
        if (pointer.nextBlock == pointer.previousBlock2) {
          pointer.posX = pointer.previousBlock.posX;
        } else {
          pointer.posX = (pointer.previousBlock.posX + pointer.previousBlock2.posX) / 2;
        }
      } else {
        if (!nodeReached) {
          pointer.posX += x;
        } else {
          pointer.posX = pointer.previousBlock.posX;
        }
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
      nodeReached = true;
    } else {
      if (!nodeReached) {
        pointer.posX += x;
      } else {
        pointer.posX = pointer.previousBlock.posX;
      }
    }
  }
}
