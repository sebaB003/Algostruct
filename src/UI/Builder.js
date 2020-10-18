import {SVGScreen} from '../Core/Graphic/SVGScreen';
import {generateCRect,
  generateCircle,
  generateRect,
  generateORect,
  generateDiamond,
  generateComment} from '../Core/Graphic/BlockGenerators';

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
    this.screen.clean();
    if (this.project.preferences.showComments) {
      this.renderComments();
    }
    this.project.flowchart.apply(this.generateBlock.bind(this));
  }

  /**
   * @param {BaseBlock} block
   * TODO: Update
   */
  generateBlock(block) {
    if ((block.posY - this.screen.screenData.panY) < this.screen.getComputedHeight() && (block.posY - this.screen.screenData.panY) > -100 && (block.posX - this.screen.screenData.panX) < this.screen.getComputedWidth() && (block.posX - this.screen.screenData.panX) > (-200 * this.screen.screenData.zoom) / 600) {
      let element = undefined;
      switch (block.type) {
        case 'start':
        case 'end':
          element = generateCRect(this.screen.SVGScreenEl, block);
          element.addEventListener('mousedown',
              (event) => moveBlockHandler(event, this, block,
                  this.screen.screenData.zoom));
          break;
        case 'insert':
        case 'node':
          element = generateCircle(this.screen.SVGScreenEl, block);
          if (element) {
            element.addEventListener('mousedown',
                (event) => moveBlockHandler(event, this, block,
                    this.screen.screenData.zoom));
            if (block.type == 'insert') {
              element.addEventListener('click',
                  ()=>this.contextMenu.open(event, block,
                      addBlocksContextMenu));
            }
          }
          break;
        case 'statement':
          element = generateRect(this.screen.SVGScreenEl, block);
          this.attachHandlers(element, block);
          break;
        case 'input':
        case 'output':
          element = generateORect(this.screen.SVGScreenEl, block);
          this.attachHandlers(element, block);
          break;
        case 'condition':
          element = generateDiamond(this.screen.SVGScreenEl, block);
          this.attachHandlers(element, block);
          break;
      }
    }
  }

  /**
   * @param {*} element
   * @param {BaseBlock} block
   */
  attachHandlers(element, block) {
    element.addEventListener('mousedown',
        (event) => moveBlockHandler(event, this, block,
            this.screen.screenData.zoom));
    element.addEventListener('contextmenu',
        ()=>this.contextMenu.open(event, block, clipboardContextMenu));
    element.addEventListener('click',
        (event) => this._select(event, block));
  }

  /**
  */
  renderComments() {
    for (const comment of this.project.flowchart.comments) {
      if (comment.previousBlock) {
        comment.posY = comment.previousBlock.posY - 70 + comment.offsetY;
        comment.posX = comment.previousBlock.posX + 300 + comment.offsetX;
        const element = generateComment(this.screen.SVGScreenEl, comment);
        element.addEventListener('mousedown',
            (event) => moveBlockHandler(event, this, comment, this.screen.screenData.zoom));
        element.addEventListener('contextmenu',
            ()=>this.contextMenu.open(event, comment, clipboardContextMenu));
        element.addEventListener('click',
            (event) => this._select(event, comment));
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
