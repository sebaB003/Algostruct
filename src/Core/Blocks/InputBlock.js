import {BaseBlock} from './BaseBlock';

/** */
export class InputBlock extends BaseBlock {
  /** */
  constructor(memoryReference) {
    super('input', memoryReference);
    super.content = 'Input';
    super.height = 50;
    memoryReference.add(this);
  }
}
