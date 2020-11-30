import {Interpreter, lex} from '../Interpreter/Interpreter';
/**
 * This class manage the toolbar of the builder interface
*/
export class Toolbar {
  /**
   * The class constructor get the elements of the toolbar
   * and setup the event handlers
   *
   * @param {*} appComponents
   * @param {boolean} isToolbarOpen: Set the toolbar status on creation
  */
  constructor(appComponents, isToolbarOpen=false) {
    this.appComponents = appComponents;
    this.isToolbarOpen = isToolbarOpen;

    this.toolbarEl = document.getElementById('builder-interface__tools');
    this.reduceToolbarButton = document.getElementById('reduce-toolBar');

    this.runFlowchartBtn = document.getElementById('run-flowchart');
    this.stepFlowchartBtn = document.getElementById('step-flowchart');
    this.stopExecutionBtn = document.getElementById('stop-execution');
    this.pauseExecutionBtn = document.getElementById('pause-execution');
    this.newPojectBtn = document.getElementById('new-project');
    this.savePojectBtn = document.getElementById('save-project');

    this.interpreter;

    this.init();
  }

  /**
   * Init the toolbar event handlers and the state
  */
  init() {
    this.setupEventHandlers();

    if (!this.isToolbarOpen) {
      this.reduceToolbarHandler();
    }
  }

  /**
   * @param {*} interpreter
   */
  setInterpreter(interpreter) {
    this.interpreter = interpreter;
  }

  /**
   * Setup the event handlers for the tools
  */
  setupEventHandlers() {
    this.reduceToolbarButton.addEventListener(
        'click',
        () => this.reduceToolbarHandler());
    this.runFlowchartBtn.addEventListener(
        'click',
        () => {
          const isPaused = this.interpreter.isPaused;
          if (!isPaused) {
            // this.interpreter.stopExecution();
            this.interpreter.startExecution();
            try {
              const showLogs = this.appComponents.project.preferences.showInterpreterLogs;
              const logsView = showLogs ? this.appComponents.logsView : undefined;
              this.interpreter.reset(this.appComponents.project.flowchart.startBlock);
              this.interpreter.setLogsView(logsView);
              this.interpreter.interpret();
              this.appComponents.logsView.console.log('Execution completed');
            } catch (e) {
              console.log(e);
              this.interpreter.stopExecution();
              this.appComponents.logsView.console.log('Execution stopped');
            }
          } else {
            this.interpreter.continueExecution();
          }
        });
    this.stepFlowchartBtn.addEventListener(
        'click',
        () => {
          try {
            const showLogs = this.appComponents.project.preferences.showInterpreterLogs;
            const logsView = showLogs ? this.appComponents.logsView : undefined;
            this.interpreter.stepInterpret(this.appComponents.project.flowchart.startBlock, logsView);
            if (!this.interpreter.parser) {
              this.appComponents.logsView.console.log('Execution completed');
            }
          } catch (e) {
            console.log(e);
            this.interpreter.stopExecution();
            this.appComponents.logsView.console.log('Execution stopped');
          }
        });
    this.pauseExecutionBtn.addEventListener(
        'click',
        () => {
          this.interpreter.pauseExecution();
          this.appComponents.logsView.console.log('Execution paused');
        });
    this.stopExecutionBtn.addEventListener(
        'click',
        () => {
          this.interpreter.stopExecution();
          this.appComponents.logsView.console.log('Execution stopped');
        });
  }


  /**
   * Changes the size of the toolbar and tools label
  */
  reduceToolbarHandler() {
    const labels = this.toolbarEl.querySelectorAll('.tool-label');

    this.toolbarEl.classList.toggle('small');

    // Hide labels
    labels.forEach((label) => label.classList.toggle('hide'));

    // Change button icon
    this.reduceToolbarButton.classList.toggle('reverse');

    this.isToolbarOpen = !this.isToolbarOpen;
  }
}
