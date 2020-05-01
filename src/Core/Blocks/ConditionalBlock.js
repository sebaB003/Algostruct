import {BaseBlock} from './BaseBlock';

/** */
export class ConditionalBlock extends BaseBlock {
  /**
   * @param {*} node
   */
  constructor(node) {
    super('condition');
    super.content = 'Condition';
    super.height = 100;
    this.node = node;
    this.nextBlock2;
    this.brenchWidth = 1;
    this.secondaryBrenchWidth = 1;
  }

  /**
   * @param {*} nextBlock
   */
  setSecondaryNextBlock(nextBlock) {
    this.nextBlock2 = nextBlock;
  }
}
