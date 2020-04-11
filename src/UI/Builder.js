import {SVGScreen} from '../Core/Graphic/SVGScreen';
import {StartBlock} from '../Core/Blocks/StartBlock';
import {Flowchart} from '../Core/Flowchart';
import {generateCRect, generateCircle, generateRect} from '../Core/Graphic/BlockGenerators';
import {InsertBlock} from '../Core/Blocks/InsertBlock';
import { ContextMenu } from './ContextMenu';
// import {EndBlock} from '../Core/Blocks/EndBlock';
// import {ContextMenu} from '.components/ContextMenu';

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
    this.project.flowchart.structure.reorderStructure();
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
        const element = generateCircle(this.screen.SVGScreenEl, block);
        element.addEventListener('click', (event) => new ContextMenu(event, {'try': console.log.bind(null, 'ok')}));
        break;
      case 'define':
      case 'action':
        generateRect(this.screen.SVGScreenEl, block);
        break;
    }
  }
}

/** */
function Project() {
  this.title = '';
  this.flowchart = new Flowchart();
}
