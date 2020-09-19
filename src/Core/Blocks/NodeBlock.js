import {BaseBlock} from './BaseBlock';

/** */
export class NodeBlock extends BaseBlock {
  /**
   * @param {*} memoryReference
  */
  constructor(memoryReference, nType='') {
    super('node', memoryReference);
    this._previousBlock2ID;
    this.nType = nType;
    super.width = 10;
    super.height = 10;
    memoryReference.add(this);
  }

  /** */
  set previousBlock2(value) {
    this._previousBlock2ID = value.id;
  }

  /** */
  get previousBlock2() {
    return this.memoryReference.get(this._previousBlock2ID);
  }

  /**
   * @param {*} previousBlock
   */
  setSecondaryPreviousBlock(previousBlock) {
    this.previousBlock2 = previousBlock;
  }
}
