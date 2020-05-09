import {DefineBlock} from '../Blocks/DefineBlock';
import {InputBlock} from '../Blocks/InputBlock';
import {ConditionalBlock} from '../Blocks/ConditionalBlock';
import {OutputBlock} from '../Blocks/OutputBlock';
import {InsertBlock} from '../Blocks/InsertBlock';
import {NodeBlock} from '../Blocks/NodeBlock';
import { CommentBlock } from '../Blocks/CommentBlock';
import { moveBlockHandler } from './BlockBehaviour';

export const addBlocksContextMenu = {
  'Define': addDefineBlockHandler,
  'Input': addInputBlockHandler,
  'Output': addOutputBlockHandler,
  'Condition': addConditionalBlockHandler,
  'While': addWhileBlockHandler,
  'DoWhile': addDoWhileBlockHandler,
  'Comment': addCommentHandler,
  'Paste': pasteBlock,
};

export const clipboardContextMenu = {
  'Copy': copyBlockHandler,
  'Cut': cutBlockHandler,
  'Delete': deleteBlock,
};

export const viewContextMenu = {
  'Reorder': reorderHandler,
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
  block.nextBlock.createSecondaryBranch(leftBranchInsert);
  node.insert(new InsertBlock());
  node.posX = (node.previousBlock.posX + node.previousBlock2.posX) / 2;
  node.updateStructure();
  console.log(block.nextBlock);
  parent.render();
}


/**
 * @param {*} block
 * @param {*} parent
 * TODO: Adjust rendering
 */
function addWhileBlockHandler(block, parent) {
  const node = new NodeBlock();
  const whileBlock = new ConditionalBlock(node);
  const insertBlock = new InsertBlock();
  block.insert(node);
  node.insert(whileBlock);
  node.setSecondaryPreviousBlock(insertBlock);
  whileBlock.secondaryBrenchWidth = 0;
  whileBlock.brenchWidth = 1;
  whileBlock.branchID = block.branchID;
  insertBlock.branchID = block.branchID + 1;
  node.branchID = block.branchID;
  insertBlock.setPreviousBlock(whileBlock);
  insertBlock.setNextBlock(node);
  whileBlock.setSecondaryNextBlock(insertBlock);
  whileBlock.insert(new InsertBlock());
  insertBlock.posX = whileBlock.posX;
  insertBlock.posY = whileBlock.posY + 50 + whileBlock.height;
  parent.render();
}

/**
 * @param {*} block
 * @param {*} parent
 */
function addDoWhileBlockHandler(block, parent) {
  const node = new NodeBlock();
  const whileBlock = new ConditionalBlock(node);
  block.insert(node);
  node.insert(whileBlock);
  node.insert(new InsertBlock());
  whileBlock.secondaryBrenchWidth = 0;
  whileBlock.insert(new InsertBlock());
  whileBlock.setSecondaryNextBlock(node);
  node.setSecondaryPreviousBlock(whileBlock);
  whileBlock.branchID = block.branchID;
  parent.render();
}

/**
 * @param {*} block
 * @param {*} parent
 */
function addCommentHandler(block, parent) {
  const comment = new CommentBlock();
  comment.setPreviousBlock(block);
  comment.posY = block.posY - 20;
  comment.posX = block.posX + 300;
  parent.project.flowchart.comments.push(comment);
  parent.render();
}
/* --------------- CLIPBOARD CONTEXT MENU --------------- */

/**
 * @param {*} block
 * @param {*} parent
 */
function copyBlockHandler(block, parent) {
  parent.clipboard = parent.project.flowchart.copy(block);
}

/**
 * @param {*} block
 * @param {*} parent
 */
function cutBlockHandler(block, parent) {
  if (block.type != 'comment') {
    block.delete();
    parent.clipboard = parent.project.flowchart.copy(block);
    parent.render();
  } else {
    const commentIndex = parent.project.flowchart.comments.indexOf(block);
    parent.project.flowchart.comments.splice(commentIndex, 1);
    parent.clipboard = block;
    parent.render();
  }
}

/**
 * @param {*} block
 * @param {*} parent
 */
function deleteBlock(block, parent) {
  if (block.type != 'comment') {
    block.delete();
  } else {
    const commentIndex = parent.project.flowchart.comments.indexOf(block);
    parent.project.flowchart.comments.splice(commentIndex, 1);
  }

  if (block == parent.project.flowchart.selected) {
    parent._deselect();
  }

  parent.render();
}

/**
 * @param {*} block
 * @param {*} parent
 */
function pasteBlock(block, parent) {
  if (parent.clipboard) {
    if (parent.clipboard.type != 'comment') {
      block.insert(parent.clipboard);
      block.nextBlock.insert(new InsertBlock());
    } else {
      parent.clipboard.previousBlock = block;
      parent.project.flowchart.comments.push(parent.clipboard);
    }
    parent.render();
  }
}

/**
 * @param {*} block
 * @param {*} parent
 */
function reorderHandler(block, parent) {
  parent.project.flowchart.reorder();
  parent.render();
}
