import {ModalManager} from './EditorComponents/ModalManager';
import {downloadJSON, getFileExtension, readFile} from '../Core/Utils/FileActions';
/**
*/
export class Topbar {
  /**
   * The constructor retrive all the dropdown elements to
   * attach the functions
   * @param {*} appComponents the app parent
  */
  constructor(appComponents) {
    this.newProjectBtn = document.getElementById('js--dropdown-new');
    this.openProjectBtn = document.getElementById('js--dropdown-open');
    this.saveProjectBtn = document.getElementById('js--dropdown-save');
    this.renameProjectBtn = document.getElementById('js--dropdown-rename');

    this.copyComponentBtn = document.getElementById('js--dropdown-copy');
    this.cutComponentBtn = document.getElementById('js--dropdown-cut');
    this.deleteComponentBtn = document.getElementById('js--dropdown-delete');

    this.showCommentsBtn = document.getElementById('js--dropdown-show-comments');
    this.moveModeBtn = document.getElementById('js--dropdown-move-mode');
    this.showBlockDescBtn = document.getElementById('js--dropdown-show-block-description');
    this.showInterpreterLogsBtn = document.getElementById('js--dropdown-show-interpreter-logs');
    this.enableDisableSyntaxCheckerBtn = document.getElementById('js--dropdown-syntax-checker');

    this.resetDefaultViewBtn = document.getElementById('js--dropdown-reset-default');
    this.editorViewBtn = document.getElementById('js--dropdown-only-editor');
    this.allToolsViewBtn = document.getElementById('js--dropdown-all-tools');
    this.debugViewBtn = document.getElementById('js--dropdown-debug');
    this.executionViewBtn = document.getElementById('js--dropdown-execution');

    this.reorderBtn = document.getElementById('js--dropdown-reorder');
    this.openEditorBtn = document.getElementById('js--dropdown-editor');
    this.openLogsViewBtn = document.getElementById('js--dropdown-logs');
    this.openOutputViewBtn = document.getElementById('js--dropdown-output');
    this.openWatchesViewBtn = document.getElementById('js--dropdown-watches');

    this.projectTitleEl = document.getElementById('project-title');

    this.appComponents = appComponents;
    this.modalManager = new ModalManager();
    this.init();
  }

  /**
   * Init the topbar
   */
  init() {
    this.setupEventHandlers();
  }

  /** */
  updateTopbarElements() {
    this.updateProjectName();
    this.updateButtons();
  }

  /**
   * Call the functions to setup the event handlers
   */
  setupEventHandlers() {
    this.setupFileDropdownEventHandlers();
    this.setupEditDropdownEventHandlers();
    this.setupPreferencesDropdownEventHandlers();
    this.setupViewDropdownEventHandlers();
    this.setupToolsDropdownEventHandlers();
  }

  /**
   * Setup the event handlers for the file dropdown
  */
  setupFileDropdownEventHandlers() {
    this.newProjectBtn.addEventListener('click',
        () => this.modalManager.showModal(this._newProjectConfirmationModal()));
    this.openProjectBtn.addEventListener('click',
        () => this.modalManager.showModal(this._openProjectModal()));
    this.saveProjectBtn.addEventListener('click',
        () => this.modalManager.showModal(this._saveProject()));
    this.renameProjectBtn.addEventListener('click',
        () => this.modalManager.showModal(this._renameProjectModal()));
  }

  /**
   * Setup the event handlers for the edit dropdown
  */
  setupEditDropdownEventHandlers() {
    this.copyComponentBtn.addEventListener('click',
        () => this._copyComponent());
    this.cutComponentBtn.addEventListener('click',
        () => this._cutComponent());
    this.deleteComponentBtn.addEventListener('click',
        () => this._deleteComponent());
  }

  /**
   * Setup the event handlers for the preferences dropdown
  */
  setupPreferencesDropdownEventHandlers() {
    this.showCommentsBtn.addEventListener('click',
        () => this._showHideComments());
    this.moveModeBtn.addEventListener('click',
        () => this._changeMovementMode());
    this.showBlockDescBtn.addEventListener('click',
        () => this._showHideBlockDesc());
    this.showInterpreterLogsBtn.addEventListener('click',
        () => this._showInterpreterLogs());
    this.enableDisableSyntaxCheckerBtn.addEventListener('click',
        () => this._enableDisableSyntaxChecker());
  }

  /**
   * Setup the event handlers for the view dropdown
  */
  setupViewDropdownEventHandlers() {
    this.resetDefaultViewBtn.addEventListener('click',
        () => this._setDefaultView());
    this.executionViewBtn.addEventListener('click',
        () => this._setExecutionView());
    this.editorViewBtn.addEventListener('click',
        () => this._setEditorView());
    this.allToolsViewBtn.addEventListener('click',
        () => this._setAllToolsView());
    this.debugViewBtn.addEventListener('click',
        () => this._setDebugView());
  }

  /**
   * Setup the event handlers for the tools dropdown
  */
  setupToolsDropdownEventHandlers() {
    this.reorderBtn.addEventListener('click',
        () => this._reorder());
    this.openEditorBtn.addEventListener('click',
        () => this._openEditor());
    this.openLogsViewBtn.addEventListener('click',
        () => this._openLogsView());
    this.openOutputViewBtn.addEventListener('click',
        () => this._openOutputView());
    this.openWatchesViewBtn.addEventListener('click',
        () => this._openWatchesView());
  }

  // FILE DROPDOWN FUNCTIONS

  /**
   * Generates and display a modal to confirm the creation aof a new project
   * @return {*} modalContent
  */
  _newProjectConfirmationModal() {
    const modalTemplate = document.querySelector('#confirmationModal');
    const modalContent = document.importNode(modalTemplate.content, true);

    modalContent.getElementById(
        'confirmationModal-message').innerHTML = 'Are you shure to create a new project?';

    // const closeButton = modalContent.getElementById(
    //    'confirmationModal-button1');
    const confirmButton = modalContent.getElementById(
        'confirmationModal-button2');

    // closeButton.innerHTML = 'No';
    confirmButton.innerHTML = 'Take me to a new project';

    // closeButton.addEventListener('click',
    //    () => this.modalManager._forceClose());
    confirmButton.addEventListener('click',
        () => this._createNewProject());

    return modalContent;
  }

  /**
   * Create a new project and clear the work area
   */
  _createNewProject() {
    this.appComponents.init();
    this.updateTopbarElements();
    this.appComponents.updateView();
    this.modalManager._forceClose();
  }

  /** */
  _saveProject() {
    this.appComponents.showLoadingScreen();
    this.appComponents.projectManager.saveProject();
    this.appComponents.hideLoadingScreen();
  }

  /** */
  _openProjectModal() {
    const modalTemplate = document.querySelector('#openProjectModal');
    const modalContent = document.importNode(modalTemplate.content, true);

    const dropAreaEl = modalContent.querySelector('.drop-area');
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach((eventName) => {
      modalContent.querySelector('.drop-area').addEventListener(eventName, this.preventDefaults, false);
    });

    dropAreaEl.onclick = () => this._openFileDialog();

    dropAreaEl.addEventListener('drop', (event) => this._selectFile(event));
    return modalContent;
  }

  /** */
  preventDefaults(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  /** */
  _openFileDialog() {
    const inputEl = document.createElement('input');
    inputEl.type = 'file';
    inputEl.accept = '.json,application/json';
    inputEl.click();

    inputEl.onchange = (event) => this._selectFile(event);
  }

  /** */
  _selectFile(event) {
    let file = undefined;

    if (event.dataTransfer) {
      file = event.dataTransfer.files[0];
    } else {
      file = event.target.files[0];
    }

    this._openProject(file);
  }

  /** */
  async _openProject(file) {
    if (getFileExtension(file) == 'json') {
      this.appComponents.showLoadingScreen();
      this.appComponents.loadFile(file);
      this.appComponents.hideLoadingScreen();
      this.modalManager._forceClose();
    }
  }

  /**
   * Generates and display a modal to rename the project
   * @return {*} modalContent
  */
  _renameProjectModal() {
    const modalTemplate = document.querySelector('#renameProjectModal');
    const modalContent = document.importNode(modalTemplate.content, true);

    const nameInput = modalContent.querySelector('input');
    const errorMessageEl = modalContent.querySelector('.error');
    nameInput.setAttribute('placeholder',
        this.appComponents.project.title);

    modalContent.querySelector('button').addEventListener('click',
        () => this._renameProject(nameInput.value, errorMessageEl));
    return modalContent;
  }

  /**
   * Rename the project
   * @param {*} newTitle new project title
   * @param {*} errorMessageEl the element to display the error message
   */
  _renameProject(newTitle, errorMessageEl) {
    if (newTitle != '') {
      this.appComponents.projectManager.setProjectTitle(newTitle);
      this.updateProjectName();
      this.modalManager._forceClose();
    } else {
      errorMessageEl.innerHTML = 'Invalid name';
    }
  }


  /** */
  updateProjectName() {
    this.projectTitleEl.innerHTML = this.appComponents.project.title;
  }

  // EDIT DROPDOWN FUNCTIONS

  /**
   * If a block is selected in the clipboard the function allow
   * to copy it
  */
  _copyComponent() {
    const block = this.appComponents.project.flowchart.selected;
    const parent = this.appComponents.builder;

    if (block) {
      parent.clipboard = parent.project.flowchart.copy(block);
    }
  }

  /**
   * If a block is selected in the clipboard the function allow
   * to cut it
  */
  _cutComponent() {
    const block = this.appComponents.project.flowchart.selected;
    const parent = this.appComponents.builder;

    if (block) {
      if (block.type != 'comment') {
        parent.project.flowchart.delete(block);
        parent.clipboard = parent.project.flowchart.copy(block);
        parent.clipboard.isSelected = true;
        parent.project.flowchart.updateFlowchart();
        parent.render();
      } else {
        const commentIndex = parent.project.flowchart.comments.indexOf(block);
        parent.project.flowchart.comments.splice(commentIndex, 1);
        parent.clipboard = block;
        parent.render();
      }
    }
  }

  /**
   * If a block is selected in the clipboard the function handle
   * its delition
  */
  _deleteComponent() {
    const block = this.appComponents.project.flowchart.selected;
    const parent = this.appComponents.builder;

    if (block) {
      if (block.type != 'comment') {
        parent.project.flowchart.delete(block);
        parent.project.flowchart.updateFlowchart();
      } else {
        parent.project.flowchart.comments.delete(block.id);
      }

      if (block == parent.project.flowchart.selected) {
        parent._deselect();
      }

      parent.render();
    }
  }


  // EDIT DROPDOWN FUNCTIONS

  /**
   * Allow to hide and show the comments
  */
  _showHideComments() {
    this.appComponents.project.preferences.showComments = !this.appComponents.project.preferences.showComments;
    this.updateButtons();
    this.appComponents.render();
  }

  /**
   * Change the way blocks are moved
   * Top down move - the blocks from the moved one to the end move
   * Single move   - only the interessed block moves
  */
  _changeMovementMode() {
    this.appComponents.project.preferences.singleMove = !this.appComponents.project.preferences.singleMove;
    this.updateButtons();
  }

  /** 
   * Allow to hide and show the block description
  */
  _showHideBlockDesc() {
    this.appComponents.project.preferences.showBlockDescription = !this.appComponents.project.preferences.showBlockDescription;
    this.updateButtons();
    this.appComponents.editor.checkSelection();
    this.appComponents.render();
  }

  /** 
   * Allow to hide and show the block description
  */
 _showInterpreterLogs() {
    this.appComponents.project.preferences.showInterpreterLogs = !this.appComponents.project.preferences.showInterpreterLogs;
    this.updateButtons();
    this.appComponents.editor.checkSelection();
    this.appComponents.render();
  }

  /**
   * Allow to hide and show the block description
  */
  _enableDisableSyntaxChecker() {
    this.appComponents.project.preferences.syntaxChecker = !this.appComponents.project.preferences.syntaxChecker;
    this.updateButtons();
    this.appComponents.editor.enableDisableSyntaxChecker(this.appComponents.project.preferences.syntaxChecker);
    this.appComponents.editor.checkSelection();
    this.appComponents.render();
  }

  /**
   * Sets the button label to the correct state
  */
  updateButtons() {
    this.showCommentsBtn.innerHTML = this.appComponents.project.preferences.showComments ? 'Hide comments' : 'Show comments';
    this.moveModeBtn.innerHTML = this.appComponents.project.preferences.singleMove ? 'Single move' : 'Top down move';
    this.showBlockDescBtn.innerHTML = this.appComponents.project.preferences.showBlockDescription ? 'Hide blocks description' : 'Show blocks description';
    this.showInterpreterLogsBtn.innerHTML = this.appComponents.project.preferences.showInterpreterLogs ? 'Hide interpreter logs' : 'Show interpreter logs';
    this.enableDisableSyntaxCheckerBtn.innerHTML = this.appComponents.project.preferences.syntaxChecker ? 'Disable syntax checker' : 'Enable syntax checker';
  }

  // VIEW DROPDOWN FUNCTIONS

  /**
   * Display the default view
  */
  _setDefaultView() {
    this.appComponents.project.preferences.view = 0;
    this.appComponents.view.setView(0);
  }

  /**
   * Display the execution view
  */
  _setExecutionView() {
    this.appComponents.project.preferences.view = 1;
    this.appComponents.view.setView(1);
  }

  /**
   * Display the editor view
  */
  _setEditorView() {
    this.appComponents.project.preferences.view = 2;
    this.appComponents.view.setView(2);
  }

  /**
   * Display all the tools
  */
  _setAllToolsView() {
    this.appComponents.project.preferences.view = 3;
    this.appComponents.view.setView(3);
  }

  /**
   * Display the debug view

  */
  _setDebugView() {
    this.appComponents.project.preferences.view = 4;
    this.appComponents.view.setView(4);
  }

  // TOOLS DROPDOWN FUNCTIONS

  /**
   * Allows to reorder the flowchart from the topbar
  */
  _reorder() {
    this.appComponents.project.flowchart.reorder();
    this.appComponents.render();
  }

  /**
   * Opens the editor view if closed
  */
  _openEditor() {
    this.appComponents.editor.setOpen();
  }

  /**
   * Opens the logs view if closed
  */
  _openLogsView() {
    this.appComponents.logsView.setOpen();
  }
  /**
   * Opens the output view if closed
  */
  _openOutputView() {
    this.appComponents.outputView.setOpen();
  }

  /**
   * Opens the watches view if closed
  */
  _openWatchesView() {
    this.appComponents.watchesView.setOpen();
  }
}
