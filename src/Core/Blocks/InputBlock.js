import {BaseBlock} from './BaseBlock';

/** */
export class InputBlock extends BaseBlock {
  /** */
  constructor() {
    super('input');
    super.content = 'Input';
    super.height = 50;
  }
}
