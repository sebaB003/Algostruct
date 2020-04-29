import {BaseBlock} from './BaseBlock';

/** */
export class CommentBlock extends BaseBlock {
  /** */
  constructor() {
    super('comment');
    super.content = 'comment';
    this.width = this.content.length * 28 + 80;
    this.height = (this.content.split('\n').length + 1) * 50;
    this.offsetX = 0;
    this.offsetY = 0;
  }
}
