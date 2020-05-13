import {Topbar} from './UI/Topbar';
import {Toolbar} from './UI/Toolbar';
import {Builder} from './UI/Builder';
import {Editor} from './UI/Editor';
import { Statusbar } from './UI/statusbar';
import { WatchesView } from './UI/Watches';

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
    this.statusbar = new Statusbar();
    this.watchesView = new WatchesView();

    this.project = undefined;
  }

  /**
   * Create a new project and setup the environment
  */
  init() {
    this.project = this.builder.project;
    this.editor.setRenderCallback(this.render.bind(this));
    this.editor.setVariablePool(this.project.flowchart.variablePool);
    this.builder.setSelectCallback(this.updateSelection.bind(this));
  }

  /** */
  updateSelection() {
    this.project = this.builder.project;
    this.editor.loadBlock(this.project.flowchart.selected);
  }

  /** */
  render() {
    this.project.flowchart.updateFlowchart.call(this.project.flowchart);
    this.builder.render.call(this.builder);
    this.statusbar.display(this.retrieveStatus());
    this.watchesView.showWatches([{variableName: 1}]);
  }

  /** */
  retrieveStatus() {
    const instructions = this.project.flowchart.instructions;
    const errors = this.project.flowchart.errors;
    let statusLabel = '';
    if (errors) {
      statusLabel = `Errors ${errors}`;
    }
    return statusLabel;
  }
}

const app = new App();
app.init();
