import {DefineBlock} from '../Blocks/DefineBlock';
import {InputBlock} from '../Blocks/InputBlock';
import {ConditionalBlock} from '../Blocks/ConditionalBlock';
import {OutputBlock} from '../Blocks/OutputBlock';
import {InsertBlock} from '../Blocks/InsertBlock';
import {NodeBlock} from '../Blocks/NodeBlock';

export const addBlocksContextMenu = {
  'Define': addDefineBlockHandler,
  'Input': addInputBlockHandler,
  'Output': addOutputBlockHandler,
  'Condition': addConditionalBlockHandler,
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

/**
 * @param {*} block
 * @param {*} parent
 */
function addInputBlockHandler(block, parent) {
  block.insert(new InputBlock());
  block.nextBlock.insert(new InsertBlock());
  parent.render();
}

/**
 * @param {*} block
 * @param {*} parent
 */
function addOutputBlockHandler(block, parent) {
  block.insert(new OutputBlock());
  block.nextBlock.insert(new InsertBlock());
  parent.render();
}

/**
 * @param {*} block
 * @param {*} parent
 */
function addConditionalBlockHandler(block, parent) {
  const node = new NodeBlock();
  block.insert(new ConditionalBlock(node));
  block.nextBlock.insert(node);
  const leftBranchInsert = new InsertBlock();
  const rightBranchInsert = new InsertBlock();
  block.nextBlock.insert(rightBranchInsert);
  block.nextBlock.createSecondaryBranch(leftBranchInsert); //TODO: solve the connectors rendering bug
  node.insert(new InsertBlock());
  node.posX = (node.previousBlock.posX + node.previousBlock2.posX) / 2;
  leftBranchInsert.posX -= 200;
  rightBranchInsert.posX += 200;
  node.updateStructure();
  parent.render();
}
