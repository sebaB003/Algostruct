import {BaseBlock} from './BaseBlock';

/** */
export class CommentBlock extends BaseBlock {
  /** */
  constructor(memoryReference) {
    super('comment', memoryReference);
    super.content = 'comment';
    super.blockDescription = 'Comment blocks are text notes used to explain the code you are writing. Comments are considered as non-executable statements.';
    super.height = (this.content.split('\n').length + 1) * 50;
    this.offsetX = 0;
    this.offsetY = 0;
    // memoryReference.add(this);
  }
}
