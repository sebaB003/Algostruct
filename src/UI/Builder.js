import {SVGScreen} from '../Core/Graphic/SVGScreen';
import {Flowchart} from '../Core/Flowchart';
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
import {moveBlockHandler} from '../Core/Utils/BlockBehaviour';

/** */
export class Builder {
  /** */
  constructor() {
    this.screen = new SVGScreen(
        'builder-interface__builder__screen',
        'js--zoom-in',
        'js--zoom-out',
        'js--reset-view');

    this.selectCallback = undefined;

    this.project;
    this.contextMenu = new ContextMenuManager(this);

    this.clipboard = 0;
    this.init();
  }

  /** */
  init() {
    this.setupEventHandlers();
    this.newProject();
    this.render();
  }

  /**
   */
  setupEventHandlers() {
    this.screen.SVGScreenEl.addEventListener('contextmenu',
        (event) => this.contextMenu.open(event, undefined, viewContextMenu));
  }

  /**
   * Create a new project
   * @param {string} title
   */
  newProject(title='untitled') {
    this.project = new Project();
    this.project.title = title;
    this.project.flowchart.init();
    this.project.flowchart.reorder();
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
    this.renderComments();
    this.project.flowchart.apply(this.generateBlock.bind(this));
  }

  /**
   * @param {BaseBlock} block
   */
  generateBlock(block) {
    if (block.posY < 1000 && block.posY > -100) {
      let element = undefined;
      switch (block.type) {
        case 'start':
        case 'end':
          element = generateCRect(this.screen.SVGScreenEl, block);
          element.addEventListener('mousedown', (event) => moveBlockHandler(event, this, block));
          break;
        case 'insert':
        case 'node':
          element = generateCircle(this.screen.SVGScreenEl, block);
          if (element) {
            element.addEventListener('mousedown', (event) => moveBlockHandler(event, this, block));
            if (block.type == 'insert') {
              element.addEventListener('click',
                  ()=>this.contextMenu.open(event, block, addBlocksContextMenu));
            }
          }
          break;
        case 'define':
        case 'action':
          element = generateRect(this.screen.SVGScreenEl, block);
          element.addEventListener('mousedown', (event) => moveBlockHandler(event, this, block));
          element.addEventListener('contextmenu',
              ()=>this.contextMenu.open(event, block, clipboardContextMenu));
          element.addEventListener('click', (event) => this._select(event, block));
          break;
        case 'input':
        case 'output':
          element = generateORect(this.screen.SVGScreenEl, block);
          element.addEventListener('mousedown', (event) => moveBlockHandler(event, this, block));
          element.addEventListener('contextmenu',
              ()=>this.contextMenu.open(event, block, clipboardContextMenu));
          element.addEventListener('click', (event) => this._select(event, block));
          break;
        case 'condition':
          element = generateDiamond(this.screen.SVGScreenEl, block);
          element.addEventListener('mousedown', (event) => moveBlockHandler(event, this, block));
          element.addEventListener('contextmenu',
              ()=>this.contextMenu.open(event, block, clipboardContextMenu));
          element.addEventListener('click', (event) => this._select(event, block));
          break;
      }
    }
  }

  /**
   * TODO: Create a function checkParent existence
  */
  renderComments() {
    for (const comment of this.project.flowchart.comments) {
      if (comment.previousBlock) {
        comment.posY = comment.previousBlock.posY - 70 + comment.offsetY;
        comment.posX = comment.previousBlock.posX + 300 + comment.offsetX;
        const element = generateComment(this.screen.SVGScreenEl, comment);
        element.addEventListener('mousedown', (event) => moveBlockHandler(event, this, comment));
        element.addEventListener('contextmenu',
            ()=>this.contextMenu.open(event, comment, clipboardContextMenu));
        element.addEventListener('click', (event) => this._select(event, comment));
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

/** */
function Project() {
  this.title = '';
  this.flowchart = new Flowchart();
}
