import {BaseBlock} from './BaseBlock';

/** */
export class DefineBlock extends BaseBlock {
  /** */
  constructor() {
    super('define');
    super.content = 'Define';
    super.width = this.content.length * 28 + 80;
    super.height = 50;
  }
}
