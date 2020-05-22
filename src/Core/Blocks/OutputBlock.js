import {BaseBlock} from './BaseBlock';

/** */
export class OutputBlock extends BaseBlock {
  /** */
  constructor(memoryReference) {
    super('output', memoryReference);
    super.content = 'Output';
    super.height = 50;
    memoryReference.add(this);
  }
}
