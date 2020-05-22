import {checkDefinitonRegex} from './Utils/Regex';
import {Memory} from './Memory';
import {StartBlock} from './Blocks/StartBlock';
import {EndBlock} from './Blocks/EndBlock';
import {InsertBlock} from './Blocks/InsertBlock';
import {InputBlock} from './Blocks/InputBlock';
import {OutputBlock} from './Blocks/OutputBlock';
import {DefineBlock} from './Blocks/DefineBlock';
import {NodeBlock} from './Blocks/NodeBlock';
import {ConditionalBlock} from './Blocks/ConditionalBlock';
import {CommentBlock} from './Blocks/CommentBlock';

/**
 * Flowchart
 */
export class Flowchart {
  /**
   *
   */
  constructor() {
    this.memory = new Memory();
    console.log(this.memory);
    this._startBlockID = undefined;
    this._endBlockID = undefined;
    this.comments = new Memory();
    this.selected = undefined;
    this.variablePool = new Set();
    this.instructions = 0;
    this.errors = 0;
  }

  /**
   * @param {*} value
  */
  set startBlock(value) {
    this._startBlockID = value.id;
  }

  /**
   * @param {*} value
  */
  get startBlock() {
    return this.memory.get(this._startBlockID);
  }

  /**
   * @param {*} value
  */
  set endBlock(value) {
    this._endBlockID = value.id;
  }

  /** */
  get endBlock() {
    return this.memory.get(this._endBlockID);
  }

  /** */
  init() {
    const startBlock = new StartBlock(100, 100, this.memory);
    const endBlock = new EndBlock(startBlock, this.memory);
    startBlock.setNextBlock(endBlock);
    this.startBlock = startBlock;
    this.endBlock = endBlock;

    startBlock.insert(new InsertBlock(this.memory));
  }

  /**
   * @param {*} block
   */
  createInput(block) {
    block.insert(new InputBlock(this.memory));
    block.nextBlock.insert(new InsertBlock(this.memory));
    this.updateFlowchart();
  }

  /**
   * @param {*} block
   */
  createOutput(block) {
    block.insert(new OutputBlock(this.memory));
    block.nextBlock.insert(new InsertBlock(this.memory));
    this.updateFlowchart();
  }

  /**
   * @param {*} block
   */
  createDefine(block) {
    block.insert(new DefineBlock(this.memory));
    block.nextBlock.insert(new InsertBlock(this.memory));
    this.updateFlowchart();
  }

  /**
   * @param {*} block
   */
  createCondition(block) {
    const node = new NodeBlock(this.memory);
    block.insert(new ConditionalBlock(node, this.memory));
    block.nextBlock.insert(node, this.memory);
    const leftBranchInsert = new InsertBlock(this.memory);
    const rightBranchInsert = new InsertBlock(this.memory);
    block.nextBlock.insert(rightBranchInsert);
    block.nextBlock.createSecondaryBranch(leftBranchInsert);
    node.insert(new InsertBlock(this.memory));
    node.posX = (node.previousBlock.posX + node.previousBlock2.posX) / 2;
    node.updateStructure();
    this.updateFlowchart();
  }

  /**
   * @param {*} block
   */
  createDoWhile(block) {
    const node = new NodeBlock(this.memory);
    const whileBlock = new ConditionalBlock(node, this.memory);
    block.insert(node);
    node.insert(whileBlock);
    node.insert(new InsertBlock(this.memory));
    whileBlock.secondaryBrenchWidth = 0;
    whileBlock.insert(new InsertBlock(this.memory));
    whileBlock.setSecondaryNextBlock(node);
    node.setSecondaryPreviousBlock(whileBlock);
    whileBlock.branchID = block.branchID;
    this.updateFlowchart();
  }

  /**
   * @param {*} block
   */
  createWhile(block) {
    const node = new NodeBlock(this.memory);
    const whileBlock = new ConditionalBlock(node, this.memory);
    const insertBlock = new InsertBlock(this.memory);
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
    whileBlock.insert(new InsertBlock(this.memory));
    insertBlock.posX = whileBlock.posX;
    insertBlock.posY = whileBlock.posY + 50 + whileBlock.height;
    this.updateFlowchart();
  }

  /**
   * @param {*} block
   */
  createComment(block) {
    const comment = new CommentBlock(this.memory);
    this.comments.add(comment);
    comment.setPreviousBlock(block);
    comment.posY = block.posY - 20;
    comment.posX = block.posX + 300;
    console.log(this.comments);
    this.updateFlowchart();
  }

  /**
   * Deletes a block from the flowchart structure
   * and from the memory
   * @param {BaseBlock} block the block to delete
  */
  delete(block) {
    let previousBlock;
    let nextBlock;

    // Find the previous and the next block of the
    // current block
    switch (block.type) {
      case 'input':
      case 'output':
      case 'define':
        previousBlock = block.previousBlock;
        nextBlock = block.nextBlock.nextBlock;
        break;
      case 'condition':
        if (block.previousBlock == block.node ||
          block.nextBlock2 == block.node) {
          previousBlock = block.node.previousBlock;
          nextBlock = block.nextBlock.nextBlock;
        } else {
          previousBlock = block.previousBlock;
          nextBlock = block.node.nextBlock.nextBlock;
        }
        break;
    }

    // Apply deletion to the memory to take space and generate new IDs
    this._deleteBlocksFromMemory(previousBlock, nextBlock);

    // Apply deletion to the flowchart structure
    previousBlock.nextBlock = nextBlock;
    nextBlock.previousBlock = previousBlock;

    previousBlock.updateStructure();
  }

  /**
   * Interate between startBlock and endBlock
   * in the flowchart structure to delete the blocks from
   * memory
   * TODO: Remove the bomments when the parent block is deleted
   * @param {*} startBlock
   * @param {*} endBlock
   */
  _deleteBlocksFromMemory(startBlock, endBlock) {
    const _toDeleteIDs = new Set;
    this._parse(startBlock.nextBlock, (p) => p != endBlock.previousBlock,
        function(block) {
          _toDeleteIDs.add(block.id);
        });
    _toDeleteIDs.forEach((id) => this.memory.delete(id));
  }

  /**
   * Interate trougth the flowchart and apply a function
   * @param {*} pointer: current position of the iterator in the flowchart
   * @param {*} condition: set when the iteration must end
   * @param {*} callback: the function to apply
   */
  _parse(pointer=this.startBlock,
      condition=(p)=> p.type != 'end',
      callback=null) {
    while (condition(pointer)) {
      if (callback) {
        callback(pointer);
      }
      if (pointer.type == 'condition' && pointer.nextBlock2) {
        if (pointer.node != pointer.nextBlock2) {
          this._parse(pointer.nextBlock2,
              (p)=> p.branchID == p.nextBlock.branchID,
              callback);
        }
      }
      pointer = pointer.nextBlock;
    }
    if (callback) {
      callback(pointer);
    }
  }

  /**
   * Apply a function to the flowchart
   * @param {*} func: the function to apply
   */
  apply(func) {
    this._parse(this.startBlock, (p)=> p.type != 'end', func);
  }


  /**
   * Extract block data to be copyed
   * @param {BaseBlock} block the block to copy
   * @return {*} blockData
  */
  copy(block) {
    if (block.type != 'condition') {
      const constructor = block.constructor;
      const {_content, hasErrors} = block;
      const blockData = {constructor, _content, hasErrors};
      return blockData;
    }

    return undefined;
  }

  /**
   * Reorders the blocks and puts the blocks
   * at the same distance.
  */
  reorder() {
    // TODO: find a way to render the branch with the right size
    this._parse(this.startBlock, (p)=> p.type != 'end', function(block) {
      if (block.previousBlock) {
        if (block.type == 'node') {
          if (block != block.nextBlock.node &&
            block.previousBlock2.type != 'condition') {
            block.posY = Math.max(
                block.previousBlock.posY + 50 + block.previousBlock.height,
                block.previousBlock2.posY + 50 + block.previousBlock2.height);
            block.posX = (block.previousBlock.posX + block.previousBlock2.posX) / 2;
          } else {
            block.posY = block.previousBlock.posY + 50 + block.previousBlock.height;
            block.posX = block.previousBlock.posX;
          }
        } else {
          block.posY = block.previousBlock.posY + 50 + block.previousBlock.height;
          block.posX = block.previousBlock.posX;
        }
        if (block.previousBlock.type == 'condition') {
          if (block.branchID > block.previousBlock.branchID) {
            block.posX -= block.previousBlock.secondaryBrenchWidth * 200;
          } else {
            block.posX += block.previousBlock.brenchWidth * 200;
          }
        }
      }
    });
  }

  /**
   * Select a block
   * @param {*} block
   */
  select(block) {
    if (this.selected) {
      this.selected.isSelected = false;
    }
    block.isSelected = true;
    this.selected = block;
  }

  /** */
  updateFlowchart() {
    this.errors = 0;
    this.instructions = 0;
    this.apply(this._updateFlowchart.bind(this));
    this.instructions -= 2;
    console.log(this.instructions);
    console.log(this.variablePool);
  }

  /**
   * @param {*} block
   *
  */
  _updateFlowchart(block) {
    if (block.type != 'insert') {
      this.instructions += 1;
    }

    if (block.hasErrors) {
      this.errors += 1;
    }

    if (block.type == 'define') {
      for (const definition of block.content.split(';')) {
        if (checkDefinitonRegex.test(definition)) {
          this.variablePool.add(checkDefinitonRegex.exec(definition)[1]);
        }
      }
    }
  }
}
