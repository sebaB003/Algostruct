import {BaseBlock} from './BaseBlock';

/** */
export class ConditionalBlock extends BaseBlock {
  /**
   * @param {*} node
   * @param {*} memoryReference
   */
  constructor(node, memoryReference) {
    super('condition', memoryReference);
    super.content = 'Condition';
    super.height = 100;
    this._nodeID = node.id;
    this._nextBlock2ID;
    this.brenchWidth = 1;
    this.secondaryBrenchWidth = 1;
    memoryReference.add(this);
  }

  /**
   * @param {*} value
   */
  set node(value) {
    this._nodeID = value.id;
  }

  /** */
  get node() {
    return this.memoryReference.get(this._nodeID);
  }

  /**
   * @param {*} value
   */
  set nextBlock2(value) {
    this._nextBlock2ID = value.id;
  }

  /** */
  get nextBlock2() {
    return this.memoryReference.get(this._nextBlock2ID);
  }

  /**
   * @param {*} nextBlock
   */
  setSecondaryNextBlock(nextBlock) {
    this.nextBlock2 = nextBlock;
  }
}
