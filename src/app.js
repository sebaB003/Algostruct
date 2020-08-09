import {Topbar} from './UI/Topbar';
import {Toolbar} from './UI/Toolbar';
import {Builder} from './UI/Builder';
import {Editor} from './UI/Editor';
import {Statusbar} from './UI/statusbar';
import {LogsView} from './UI/LogsView';
import {OutputView} from './UI/OutputView';
import {WatchesView} from './UI/WatchesView';
import {View} from './UI/View';
import {ProjectManager} from './Core/ProjectManager';

/**
 * This class contains is the core of Algostruct
 * Contains the connections to the other tools and components
 */
class App {
  /**
   *  Connect the app to tools and components of Algostruct
   */
  constructor() {
    this.loadingScreen = document.querySelector('.loading-wrapper');

    this.topbar = new Topbar(this);
    this.toolbar = new Toolbar(this, false);
    this.editor = new Editor();
    this.builder = new Builder();
    this.statusbar = new Statusbar();
    this.logsView = new LogsView();
    this.outputView = new OutputView();
    this.watchesView = new WatchesView();

    this.view = new View(this.editor,
        this.logsView,
        this.outputView,
        this.watchesView);

    this.project = undefined;
    this.projectManager = new ProjectManager();
  }

  /**
   * Create a new project and setup the environment
  */
  init() {
    this.projectManager.newProject(this.builder.screen);
    this.project = this.projectManager.project;
    this.builder.project = this.project;
    this.editor.project = this.project;
    this.editor.setRenderCallback(this.render.bind(this));
    this.editor.setVariablePool(this.project.flowchart.variablePool);
    this.builder.setSelectCallback(this.updateSelection.bind(this));
    this.statusbar.display(this.retrieveStatus());
    this.builder._deselect();
    this.editor.checkSelection();
    this.render();
  }

  /** */
  updateSelection() {
    this.project = this.builder.project;
    this.editor.loadBlock(this.project.flowchart.selected);
  }

  /** */
  updateView() {
    this.view.setView(this.project.preferences.view);
  }

  /** */
  render() {
    this.project.flowchart.updateFlowchart.call(this.project.flowchart);
    this.builder.render.call(this.builder);
    this.statusbar.display(this.retrieveStatus());
    this.editor.setVariablePool(this.project.flowchart.variablePool);
    this.watchesView.showWatches(this.project.flowchart.variablePool);
  }

  /** */
  retrieveStatus() {
    const instructions = this.project.flowchart.instructions;
    const errors = this.project.flowchart.errors;
    let statusLabel = 'Errors: 0';
    if (errors) {
      statusLabel = `Errors ${errors}`;
    }
    return statusLabel;
  }

  /** */
  async loadFile(file) {
    this.showLoadingScreen();

    try {
      await this.projectManager.loadFile(file);
    } catch (error) {
      console.log('An error occured while loading the project');
      console.log(`${error}`);
      this.topbar._createNewProject();
    }

    this.topbar.updateTopbarElements();
    this.updateView();
    this.render();
    this.hideLoadingScreen();
  }

  /** */
  showLoadingScreen() {
    this.loadingScreen.style.display = 'flex';
  }

  /** */
  hideLoadingScreen() {
    this.loadingScreen.style.display = 'none';
  }
}

const app = new App();
app.init();
