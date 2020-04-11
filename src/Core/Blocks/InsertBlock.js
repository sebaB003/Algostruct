import {BaseBlock} from './BaseBlock';

/**
 *
 */
export class InsertBlock extends BaseBlock {
  /**
   *
   */
  constructor() {
    super('insert');
    super.content = '+';
    this.width = 30;
    this.height = 30;
  }
}
