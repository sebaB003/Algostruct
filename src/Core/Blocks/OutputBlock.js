import {BaseBlock} from './BaseBlock';

/** */
export class OutputBlock extends BaseBlock {
  /** */
  constructor() {
    super('output');
    super.content = 'Output';
    this.width = this.content.length * 28 + 80;
    this.height = 50;
  }
}
