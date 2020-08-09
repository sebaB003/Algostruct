import {BaseBlock} from './BaseBlock';

/** */
export class StatementBlock extends BaseBlock {
  /** */
  constructor(memoryReference) {
    super('statement', memoryReference);
    super.content = 'Statement';
    super.blockDescription = 'Statement blocks are the instructions to be executed';
    super.width = this.content.length * 28 + 80;
    super.height = 50;
    memoryReference.add(this);
  }
}
