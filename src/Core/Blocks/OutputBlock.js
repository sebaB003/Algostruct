import {BaseBlock} from './BaseBlock';

/** */
export class OutputBlock extends BaseBlock {
  /** */
  constructor(memoryReference) {
    super('output', memoryReference);
    super.content = 'Output';
    super.blockDescription = 'Output blocks are used to display the result of the program';
    super.height = 50;
    memoryReference.add(this);
  }
}
