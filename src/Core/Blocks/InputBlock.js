import {BaseBlock} from './BaseBlock';

/** */
export class InputBlock extends BaseBlock {
  /** */
  constructor(memoryReference) {
    super('input', memoryReference);
    super.content = 'Input';
    super.blockDescription = 'Input blocks allow the user to provide external data to the program.';
    super.height = 50;
    memoryReference.add(this);
  }
}
