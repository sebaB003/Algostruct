import {SVGScreen} from '../Core/Graphic/SVGScreen';
import {BlockGenerator} from '../Core/Graphic/BlockGenerators';

import {ContextMenuManager} from './ContextMenu';
import {addBlocksContextMenu,
  viewContextMenu} from '../Core/Utils/ContextMenusPresets';

import {clipboardContextMenu} from '../Core/Utils/ContextMenusPresets';
import {moveBlockHandler} from '../Core/Utils/MoveBehaviour';

/** */
export class Builder {
  /** */
  constructor() {
    this.screen = new SVGScreen(
        'builder-interface__builder__screen',
        'js--zoom-in',
        'js--zoom-out',
        'js--reset-view');

    this.screen.setRenderCallback(() => this.render());
    this.blockGenerator = new BlockGenerator(this.screen);

    this.selectCallback = undefined;

    this.project;
    this.contextMenu = new ContextMenuManager(this);

    this.clipboard = 0;
    this.init();
  }

  /** */
  init() {
    this.setupEventHandlers();
  }

  /**
   */
  setupEventHandlers() {
    this.screen.SVGScreenEl.addEventListener('contextmenu',
        (event) => this.contextMenu.open(event, undefined, viewContextMenu));
  }

  /**
   * Change the name of the project
   * @param {string} title
   */
  setProjectTitle(title) {
    this.project.title = title;
  }

  /**
   * Parse the flowchart and render the elements
   */
  render() {
    this.screen.updateData();
    this.screen.clean();
    if (this.project.preferences.showComments) {
      this.renderComments();
    }
    this.project.flowchart.render(this.generateBlock.bind(this));
  }

  /**
   * @param {BaseBlock} block
   * TODO: Update
   */
  generateBlock(block) {
    let element = undefined;
    switch (block.type) {
      case 'start':
      case 'end':
        element = this.blockGenerator.generateCRect(block);
        if (element) {
          element.addEventListener('mousedown',
              (event) => moveBlockHandler(event, this, block,
                  this.screen.screenData));
        }
        break;
      case 'insert':
      case 'node':
        element = this.blockGenerator.generateCircle(block);
        if (element) {
          element.addEventListener('mousedown',
              (event) => moveBlockHandler(event, this, block,
                  this.screen.screenData));
          if (block.type == 'insert') {
            element.addEventListener('click',
                ()=>this.contextMenu.open(event, block,
                    addBlocksContextMenu));
          }
        }
        break;
      case 'statement':
        element = this.blockGenerator.generateRect(block);
        this.attachHandlers(element, block);
        break;
      case 'input':
      case 'output':
        element = this.blockGenerator.generateORect(block);
        this.attachHandlers(element, block);
        break;
      case 'condition':
        element = this.blockGenerator.generateDiamond(block);
        this.attachHandlers(element, block);
        break;
    }
  }

  /**
   * @param {*} element
   * @param {BaseBlock} block
   */
  attachHandlers(element, block) {
    if (element) {
      element.addEventListener('mousedown',
          (event) => moveBlockHandler(event, this, block,
              this.screen.screenData));
      element.addEventListener('contextmenu',
          ()=>this.contextMenu.open(event, block, clipboardContextMenu));
      element.addEventListener('click',
          (event) => this._select(event, block));
    }
  }

  /**
  */
  renderComments() {
    for (const comment of this.project.flowchart.comments) {
      if (comment.previousBlock) {
        comment.posY = comment.previousBlock.posY - 70 + comment.offsetY;
        comment.posX = comment.previousBlock.posX + 300 + comment.offsetX;
        const element = this.blockGenerator.generateComment(comment);
        this.attachHandlers(element, comment);
      } else {
        this.project.flowchart.comments.delete(comment.id);
      }
    }
  }

  /**
   * @param {*} event
   * @param {*} block
   */
  _select(event, block) {
    event.preventDefault();
    event.stopPropagation();

    this.project.flowchart.select(block);
    if (this.selectCallback) {
      this.selectCallback(block);
    }
    this.render();
  }

  /**
   *
  */
  _deselect() {
    this.project.flowchart.selected = null;
    if (this.selectCallback) {
      this.selectCallback();
    }
    this.render();
  }

  /**
   * @param {*} callback
  */
  setSelectCallback(callback) {
    this.selectCallback = callback;
  }
}
