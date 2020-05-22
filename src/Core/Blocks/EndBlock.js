import {BaseBlock} from './BaseBlock';
/**
 *
 */
export class EndBlock extends BaseBlock {
  /**
   *
   * @param {*} previousBlock
   * @param {*} memoryReference
   */
  constructor(previousBlock, memoryReference) {
    super('end', memoryReference);
    super.previousBlock = previousBlock;
    super.posX = previousBlock.posX;
    super.posY = previousBlock.posY + 100;
    super.content = 'End';
    super.height = 50;
    memoryReference.add(this);
  }
}
