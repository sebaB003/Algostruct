import {InsertBlock} from '../Blocks/InsertBlock';

export const addBlocksContextMenu = {
  'Define': addDefineBlockHandler,
  'Input': addInputBlockHandler,
  'Output': addOutputBlockHandler,
  'Condition': addConditionalBlockHandler,
  'While': addWhileBlockHandler,
  'DoWhile': addDoWhileBlockHandler,
  'Paste': {chk: canPasteBlock, func: pasteBlock},
};

export const clipboardContextMenu = {
  'Comment': addCommentHandler,
  'Paste comment': {chk: canPasteComment, func: pasteCommentHandler},
  'Copy': {chk: canExecuteClipboardAction, func: copyBlockHandler},
  'Cut': {chk: canExecuteClipboardAction, func: cutBlockHandler},
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
  parent.project.flowchart.createDefine(block);
  parent.render();
}

/**
 * @param {*} block
 * @param {*} parent
 */
function addInputBlockHandler(block, parent) {
  parent.project.flowchart.createInput(block);
  parent.render();
}

/**
 * @param {*} block
 * @param {*} parent
 */
function addOutputBlockHandler(block, parent) {
  parent.project.flowchart.createOutput(block);
  parent.render();
}

/**
 * @param {*} block
 * @param {*} parent
 */
function addConditionalBlockHandler(block, parent) {
  parent.project.flowchart.createCondition(block);
  parent.render();
}


/**
 * @param {*} block
 * @param {*} parent
 * TODO: Adjust rendering
 */
function addWhileBlockHandler(block, parent) {
  parent.project.flowchart.createWhile(block);
  parent.render();
}

/**
 * @param {*} block
 * @param {*} parent
 */
function addDoWhileBlockHandler(block, parent) {
  parent.project.flowchart.createDoWhile(block);
  parent.render();
}

/**
 * @param {*} block
 * @param {*} parent
 */
function addCommentHandler(block, parent) {
  parent.project.flowchart.createComment(block);
  parent.render();
}

/**
 * @param {*} block
 * @param {*} parent
 */
function pasteBlock(block, parent) {
  if (parent.clipboard) {
    if (parent.clipboard.type != 'comment') {
      const {_content, hasErrors}=parent.clipboard;
      block.insert(Object.assign(new parent.clipboard.constructor(parent.project.flowchart.memory), {_content, hasErrors} ));
      block.nextBlock.insert(new InsertBlock(parent.project.flowchart.memory));
    }
    parent.render();
    parent.project.flowchart.updateFlowchart();
  }
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
    parent.project.flowchart.delete(block);
    parent.clipboard = parent.project.flowchart.copy(block);
    parent.clipboard.isSelected = true;
    parent.project.flowchart.updateFlowchart();
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
    parent.project.flowchart.delete(block);
    parent.project.flowchart.updateFlowchart();
  } else {
    parent.project.flowchart.comments.delete(block.id);
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
function pasteCommentHandler(block, parent) {
  if (parent.clipboard) {
    if (parent.clipboard.type == 'comment') {
      const {_content}=parent.clipboard;
      const comment = Object.assign(new parent.clipboard.constructor(parent.project.flowchart.memory), {_content});
      comment.setPreviousBlock(block);
    }
    parent.render();
    parent.project.flowchart.updateFlowchart();
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


/* --------------- CHECK FUNCTIONS --------------- */

/**
 * If there is somenthing copyed and different
 * from a comment returns true
 *
 * This function is used to check if is possible to use
 * the paste function in the context menu
 * @param {*} parent the related parent object
 * @param  {...any} args
 * @return {bool}
 */
function canPasteBlock(parent, ...args) {
  if (parent.clipboard) {
    if (parent.clipboard.type != 'comment') {
      return true;
    }
  }
  return false;
}

/**
 * If there is a comment copyed returns true
 *
 * This function is used to check if is possible to use
 * the paste comment function in the context menu
 * @param {*} parent
 * @param  {...any} args
 * @return {bool}
 */
function canPasteComment(parent, ...args) {
  if (parent.clipboard) {
    if (parent.clipboard.type == 'comment') {
      return true;
    }
  }
  return false;
}

/**
 * If the block can be copyed returns true
 *
 * This function is used to check if is possible to use
 * clipboard functions in the context menu
 * @param {*} parent
 * @param {*} block
 * @return {bool}
 */
function canExecuteClipboardAction(parent, block) {
  return block.type != 'condition';
}
