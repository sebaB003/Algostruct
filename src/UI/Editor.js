import {AssignEditor} from './EditorComponents/AssignEditor';
import {OperationEditor} from './EditorComponents/OperationEditor';
import {ModalManager} from './EditorComponents/ModalManager';
import {checkAssignRegex} from '../Core/Utils/Regex';
import { ContentEditor } from './EditorComponents/ContentEditor';

/**
 * Generate the editor section of Algostruct
*/
export class Editor {
  /**
   * Initialize the HTML components
   * and some variables
  */
  constructor() {
    this.editorEl = document.querySelector(
        '#builder-interface__editor div');
    this.operationsContainer = document.createElement('div');

    this.blockOperations = [];

    this.currentSelected = undefined;

    this.renderCallback = undefined;

    // Initialize a modalManager
    this.modalManager = new ModalManager();
    this.variablePool = undefined;

    this.mode = TEXT;

    this.init();
  }

  /** */
  init() {
    this.setupEventHandlers();
  }

  /**
   * Sets the location of the flowchart variables
   * @param {Set} variablePool
  */
  setVariablePool(variablePool) {
    this.variablePool = variablePool;
  }

  /** */
  setupEventHandlers() {
    // this.editorEl.parentElement.addEventListener('mousedown', (event) => this.resize(event));
  }

  /**
   * Load the selected block data and
   * generates widget to modify the block
   * operations
   * @param {*} block
  */
  loadBlock(block) {
    if (this.currentSelected != block) {
      this.blockOperations = [];
      this.currentSelected = block;
      this.checkSelection();
    }
  }

  /**
   * Check if the selection exists and render the UI
   * otherwise reset the content of the editor
   */
  checkSelection() {
    if (this.currentSelected) {
      this.updateUI();
    } else {
      this.resetContent();
    }
  }

  /**
   * Reset the content of the editor
   */
  resetContent() {
    this.editorEl.innerHTML = '<h2>Content</h2>';
  }

  /**
   * Display the block data and generates widgets
   * to modify the block operations
  */
  updateUI() {
    this.resetContent();
    const title = document.createElement('p');
    title.innerHTML = 'Operations';
    this.editorEl.appendChild(title);
    this.operationsContainer.innerHTML = '';
    this.editorEl.appendChild(this.operationsContainer);

    this.showMode();
  }

  /**
   * Check the editor mode and switch
   * render the correct UI
   */
  showMode() {
    if (this.mode == TEXT) {
      this.renderTextMode();
    } else if (this.mode == VISUAL) {
      this.renderVisualMode();
    }
  }

  /**
   * Render the text mode UI
   */
  renderTextMode() {
    const contentEditor = new ContentEditor(this.currentSelected, this.renderCallback);
    this.operationsContainer.append(contentEditor.contentEditor);
  }


  /**
   * Render the visual mode UI
   */
  renderVisualMode() {
    this.parseContent();

    this.generateBlockContent();

    this.showCreateAssignEditorButton();
    this.showCreateOperationEditorButton();
  }

  /**
   * Parse the content of the selected block
   * and dynamically load and generates operation editors
  */
  parseContent() {
    const operations = this.currentSelected.content.split('; ');
    for (const operation of operations) {
      if (checkAssignRegex.test(operation)) {
        const regexResult = checkAssignRegex.exec(operation);
        this.createAssignEditor(regexResult[1], regexResult[2], regexResult[3]);
      } // } else if (operationRegex.test(operation)) {
      //   const regexResult = operationRegex.exec(operation);
      //   this.createOperationEditor(regexResult[1], regexResult[2], regexResult[3], regexResult[8], regexResult[9]);
      // }
    }
  }

  /**
   * Loads the add-template button return a
   * button to append in DOM
   * @param {*} text the text to display near the button
   * @param {*} func the function attached to the button
   * @return {*} loadedButton
   */
  _createAddButton(text, func) {
    const buttonTemplate = document.querySelector('#add-button');
    const loadedButton = document.importNode(buttonTemplate.content, true);
    const buttonContent = loadedButton.firstElementChild;
    const buttonText = buttonContent.querySelector('p');

    buttonContent.addEventListener('click', () => func());
    buttonText.textContent = text;

    return loadedButton;
  }

  /** */
  showCreateAssignEditorButton() {
    const createAssignEditorButton = this._createAddButton(
        'New assign',
        this.createAssignEditor.bind(this));
    this.editorEl.append(createAssignEditorButton);
  }

  /** */
  showCreateOperationEditorButton() {
    const createOperationEditorButton = this._createAddButton(
        'New operation',
        this.createOperationEditor.bind(this));
    this.editorEl.appendChild(createOperationEditorButton);
  }

  /**
   * Adds to the local operation dump a new operation object
   * @param {*} operation
  */
  addOperation(operation) {
    this.blockOperations.push(operation);
  }

  /**
   * Locate and remove from the local
   * operation dump a operation
   * @param {*} operation
  */
  removeOperation(operation) {
    const operationIndex = this.blockOperations.findIndex(
        (storedOperation) => storedOperation == operation);
    this.blockOperations.splice(operationIndex, 1);

    // Update block content and render changes
    this.generateBlockContent();
  }


  /**
   * Create a new AssignEditor and display it in the editor
  */
  createAssignEditor(...components) {
    const newOperation = new AssignEditor(components, this.variablePool, this.modalManager, this.generateBlockContent.bind(this), this.removeOperation.bind(this));
    this.addOperation(newOperation);
    this.operationsContainer.appendChild(newOperation.containerEl);
    this.generateBlockContent();
  }

  /**
   * Create a new OperationEditor and display it in the editor
  */
  createOperationEditor(...components) {
    const newOperation = new OperationEditor(components, this.variablePool, this.modalManager, this.generateBlockContent.bind(this), this.removeOperation.bind(this));
    this.addOperation(newOperation);
    this.operationsContainer.appendChild(newOperation.container);
    this.generateBlockContent();
  }

  /**
   * Analize the local operations dump and
   * generate a new block content
  */
  generateBlockContent() {
    this.currentSelected.content = '';
    for (const operation of this.blockOperations) {
      if (operation instanceof AssignEditor) {
        this.currentSelected.content += `${operation.variable1} ${operation.operator} ${operation.variable2}; `;
      }
    }

    this.renderCallback();
  }

  /**
   * Set a render callback
   * @param {*} callback
  */
  setRenderCallback(callback) {
    this.renderCallback = callback;
  }

  /**
   * Sets the editor mode
   * TEXT - directly edit the selected block content
   * VISUAL - edit the selected block content by the help of
   *          a visual editor
   * @param {Symbol} mode the editor mode (TEXT or VISUAL)
  */
  setMode(mode) {
    if (mode == TEXT) {
      this.mode = TEXT;
    } else if (mode == VISUAL) {
      this.mode = VISUAL;
    }
  }

  /**
   * Attach the mousemove handler
   * @param {Event} event
   */
  resize(event) {
    const resizable = this.editorEl.parentElement;

    let oldWidth = 0;
    let newWidth = resizable.getBoundingClientRect().width;

    if (event.button == 0) {
      window.addEventListener('mousemove', resizeX);
      event.preventDefault();
    }

    /**
     * Calculate the x-axis change
     * and calculate a new editor width
     * @param {Event} event
     */
    function resizeX(event) {
      if (event.buttons == 0) {
        if (newWidth <= 10) {
          resizable.style.display = 'none';
        }
        window.removeEventListener('mousemove', resizeX);
      } else {
        oldWidth = newWidth;
        newWidth = oldWidth + (resizable.getBoundingClientRect().left - event.pageX);
        newWidth = Math.min(parseInt(window.innerWidth), Math.max(10, newWidth));
        resizable.style.width = newWidth + 'px';
      }
    }
  }
}

const TEXT = Symbol('text');
const VISUAL = Symbol('visual');
