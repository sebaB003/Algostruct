import {BaseBlock} from './BaseBlock';

/** */
export class NodeBlock extends BaseBlock {
  /** */
  constructor() {
    super('node');
    this.previousBlock2;
    this.width = 10;
    this.height = 10;
  }

  /**
   * @param {*} previousBlock
   */
  setSecondaryPreviousBlock(previousBlock) {
    this.previousBlock2 = previousBlock;
  }
}
