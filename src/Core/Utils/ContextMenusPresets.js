import {DefineBlock} from '../Blocks/DefineBlock';
import {InsertBlock} from '../Blocks/InsertBlock';

export const addBlocksContextMenu = {
  'define': addDefineBlockHandler,
};

/**
 * @param {*} block
 * @param {*} parent
 */
function addDefineBlockHandler(block, parent) {
  block.insert(new DefineBlock());
  block.nextBlock.insert(new InsertBlock());
  parent.render();
}
