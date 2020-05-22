import {BaseBlock} from './BaseBlock';

/**
 *
 */
export class InsertBlock extends BaseBlock {
  /**
   * @param {*} memoryReference
   */
  constructor(memoryReference) {
    super('insert', memoryReference);
    super.content = '+';
    super.width = 30;
    super.height = 30;
    memoryReference.add(this);
  }
}
