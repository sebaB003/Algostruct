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
    super.height = 50;
  }
}
