import {BaseBlock} from './BaseBlock';

/** */
export class InputBlock extends BaseBlock {
  /** */
  constructor() {
    super('input');
    super.content = 'Input';
    this.width = this.content.length * 28 + 80;
    this.height = 50;
  }
}
