import {Topbar} from './UI/Topbar';
import {Toolbar} from './UI/Toolbar';
import {Builder} from './UI/Builder';
import {Editor} from './UI/Editor';
import {Statusbar} from './UI/statusbar';
import {LogsView} from './UI/LogsView';
import {OutputView} from './UI/OutputView';
import {WatchesView} from './UI/WatchesView';
import {readFile, checkFile, stringToObject} from './Core/Utils/FileActions';
import {View} from './UI/View';

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

    this.toolbar = new Toolbar();
    this.topbar = new Topbar(this);
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
  }

  /**
   * Create a new project and setup the environment
  */
  init() {
    this.project = this.builder.project;
    this.editor.setRenderCallback(this.render.bind(this));
    this.editor.setVariablePool(this.project.flowchart.variablePool);
    this.builder.setSelectCallback(this.updateSelection.bind(this));
    this.statusbar.display(this.retrieveStatus());
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
    this.editor.setVariablePool(this.project.flowchart.variablePool);
    this.builder.render.call(this.builder);
    this.statusbar.display(this.retrieveStatus());
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
      const fileContent = await readFile(file);
      const fileContentO = stringToObject(fileContent);

      if (checkFile(fileContentO)) {
        this.loadProject(fileContentO);
      } else {
        console.log('Invalid file content');
      }
    } catch (error) {
      console.log('An error occured while loading the project');
      console.log(`${error}`);
      this.topbar._createNewProject();
    }

    this.render();
    this.hideLoadingScreen();
  }

  /** */
  loadProject(fileContentO) {
    this._loadTitle(fileContentO.title);
    this._loadPreferences(fileContentO.preferences);

    this.project.flowchart.loadFlowchart(fileContentO.flowchart);

    this.topbar.updateTopbarElements();
    this.updateView();
  }

  /** */
  _loadTitle(title) {
    this.project.title = title;
  }

  /** */
  _loadPreferences(preferences) {
    this.project.preferences.showComments = preferences.showComments;
    this.project.preferences.singleMove = preferences.singleMove;
    this.project.preferences.view = preferences.view;
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
