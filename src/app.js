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
    this.builder = new Builder();
    this.editor = new Editor(this.builder.project);
  }

  /**
   * Create a new project and setup the environment
  */
  init() {
    console.log('Hello world');
  }
}

const app = new App();
app.init();
