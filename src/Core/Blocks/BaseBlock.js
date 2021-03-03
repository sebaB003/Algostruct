/**
 *
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
   * Updates the width of the block based on the text content
   */
  updateWidth() {
    this.width = Math.max(this._content.length * 28 + 80, 200);
  }
  /**
   * @param {*} value
   */
  set content(value) {
    this._content = value;
    this.updateWidth();
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
  */
  moveStructure(x, y, pointer=this) {
    if (!pointer) {
      return;
    }

    if (pointer.type == 'condition') {
      pointer.posX += x;
      pointer.posY += y;
      if (pointer.node.nType == 'if') {
        this.moveStructure(x, y, pointer.nextBlock);
        this.moveStructure(x, y, pointer.nextBlock2);
      } else if (pointer.node.nType == 'lo') {
        this.moveStructure(x, y, pointer.nextBlock);
        this.moveStructure(x, y, pointer.nextBlock2);
      } else {
        this.moveStructure(x, y, pointer.nextBlock);
      }
    } else if (pointer.type == 'node') {
      pointer.posX += x;
      pointer.posY += y;
      this.moveStructure(x, y, pointer.nextBlock);
    } else {
      pointer.posX += x;
      pointer.posY += y;
      if (pointer.nextBlock) {
        if (pointer.nextBlock.branchID == pointer.branchID) {
          this.moveStructure(x, y, pointer.nextBlock);
        }
      }
    }
  }
}
