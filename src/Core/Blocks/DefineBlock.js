import {BaseBlock} from './BaseBlock';

/** */
export class DefineBlock extends BaseBlock {
  /** */
  constructor() {
    super('define');
    super.content = 'Define';
    this.width = this.content.length * 28 + 80;
    this.height = 50;
  }
}
