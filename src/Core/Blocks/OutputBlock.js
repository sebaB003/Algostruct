import {BaseBlock} from './BaseBlock';

/** */
export class OutputBlock extends BaseBlock {
  /** */
  constructor() {
    super('output');
    super.content = 'Output';
    super.height = 50;
  }
}
