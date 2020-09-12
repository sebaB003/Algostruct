import {BaseBlock} from './BaseBlock';

/**
 *
 */
export class StartBlock extends BaseBlock {
  /**
   *
   * @param {number} posx
   * @param {number} posy
   * @param {*} memoryReference
   */
  constructor(posx, posy, memoryReference) {
    super('start', memoryReference);
    super.posX = posx;
    super.posY = posy;
    super.content = 'START';
    super.height = 50;
    memoryReference.add(this);
  }
}
