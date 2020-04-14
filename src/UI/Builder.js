import {SVGScreen} from '../Core/Graphic/SVGScreen';
import {StartBlock} from '../Core/Blocks/StartBlock';
import {Flowchart} from '../Core/Flowchart';
import {generateCRect,
  generateCircle,
  generateRect,
  generateORect,
  generateDiamond} from '../Core/Graphic/BlockGenerators';
import {InsertBlock} from '../Core/Blocks/InsertBlock';
import {ContextMenuManager} from './ContextMenu';
import {addBlocksContextMenu} from '../Core/Utils/ContextMenusPresets';

/** */
export class Builder {
  /** */
  constructor() {
    this.screen = new SVGScreen(
        'builder-interface__builder__screen',
        'js--zoom-in',
        'js--zoom-out',
        'js--reset-view');

    this.project;
    this.contextMenu = new ContextMenuManager(this);

    this.init();
  }

  /** */
  init() {
    this.newProject();
    this.render();
  }

  /**
   * Create a new project
   * @param {string} title
   */
  newProject(title='untitled') {
    this.project = new Project;
    this.project.title = title;
    this.project.flowchart.structure = new StartBlock(
        this.screen.getWidth() / 2, 100);
    this.project.flowchart.structure.insert(new InsertBlock);
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
    this.project.flowchart.reorder();
    this.project.flowchart.apply(this.generateBlock.bind(this));
  }

  /**
   * @param {BaseBlock} block
   */
  generateBlock(block) {
    switch (block.type) {
      case 'start':
      case 'end':
        generateCRect(this.screen.SVGScreenEl, block);
        break;
      case 'insert':
      case 'node':
        const element = generateCircle(this.screen.SVGScreenEl, block);
        if (block.type == 'insert') {
          element.addEventListener('click',
              ()=>this.contextMenu.open(event, block, addBlocksContextMenu));
        }
        break;
      case 'define':
      case 'action':
        generateRect(this.screen.SVGScreenEl, block);
        break;
      case 'input':
      case 'output':
        generateORect(this.screen.SVGScreenEl, block);
        break;
      case 'condition':
        generateDiamond(this.screen.SVGScreenEl, block);
        break;
    }
  }
}

/** */
function Project() {
  this.title = '';
  this.flowchart = new Flowchart();
}
