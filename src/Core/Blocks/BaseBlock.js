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
    this.blockDescription = '';
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

    block.posY = this.posY + 50 + this.height;
    previous.posY = block.posY + 50 + block.height;

    this.nextBlock.posX = this.posX;
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

    block.posY = this.posY + 50 + this.height;
    previousBlock.posY = block.posY + 50 + block.height;

    this.nextBlock2.posX = this.posX;
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
        nodeReached = false;
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
