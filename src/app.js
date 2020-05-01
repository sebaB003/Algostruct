import {Topbar} from './UI/Topbar';
import {Toolbar} from './UI/Toolbar';
import {Builder} from './UI/Builder';
import {Editor} from './UI/Editor';

/**
 * This class contains is the core of Algostruct
 * Contains the connections to the other tools and components
 */
class App {
  /**
   *  Connect the app to tools and components of Algostruct
   */
  constructor() {
    this.toolbar = new Toolbar();
    this.topbar = new Topbar();
    this.editor = new Editor();
    this.builder = new Builder();

    this.project = undefined;
  }

  /**
   * Create a new project and setup the environment
  */
  init() {
    this.project = this.builder.project;
    this.editor.setRenderCallback(this.builder.render.bind(this.builder));
    this.builder.setSelectCallback(this.update.bind(this));
  }

  /** */
  update() {
    this.project = this.builder.project;
    this.editor.loadBlock(this.project.flowchart.selected);
  }
}

const app = new App();
app.init();
