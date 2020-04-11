import {BaseBlock} from './BaseBlock';
/**
 *
 */
export class EndBlock extends BaseBlock {
  /**
   *
   * @param {*} previousBlock
   */
  constructor(previousBlock) {
    super('end');
    super.previousBlock = previousBlock;
    super.posX = previousBlock.posX;
    super.posY = previousBlock.posY + 100;
    super.content = 'End';
    this.width = this.content.length * 28 + 100;
    this.height = 50;
  }
}
