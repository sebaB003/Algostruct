import {Toolbar} from './UI/Toolbar';

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
