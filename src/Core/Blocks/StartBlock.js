import {BaseBlock} from './BaseBlock';
import {EndBlock} from './EndBlock';

/**
 *
 */
export class StartBlock extends BaseBlock {
  /**
   *
   * @param {number} posx
   * @param {number} posy
   */
  constructor(posx, posy) {
    super('start');
    super.nextBlock = new EndBlock(this);
    super.posX = posx;
    super.posY = posy;
    super.content = 'Start';
    this.width = this.content.length * 28 + 80;
    this.height = 50;
  }
}
