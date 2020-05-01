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
    super.width = 30;
    super.height = 30;
  }
}
