import {AssignEditor} from './EditorComponents/AssignEditor';
import {OperationEditor} from './EditorComponents/OperationEditor';
import {ModalManager} from './EditorComponents/ModalManager';

/** */
export class Editor {
  /** */
  constructor() {
    this.editorEl = document.querySelector(
        '#builder-interface__editor div');
    this.operationsContainer = document.createElement('div');
    this.blockOperations = [];

    this.currentSelected = undefined;

    this.renderCallback = undefined;

    this.modalManager = new ModalManager();
    this.variablePool = undefined;

    this.init();
  }

  /** */
  init() {
    this.setupEventHandlers();
  }

  /** */
  setVariablePool(variablePool) {
    this.variablePool = variablePool;
  }

  /** */
  setupEventHandlers() {
    // this.editorEl.parentElement.addEventListener('mousedown', (event) => this.resize(event));
  }

  /**
   * @param {*} block
  */
  loadBlock(block) {
    if (this.currentSelected != block) {
      this.blockOperations = [];
      this.currentSelected = block;
      this.updateUI();
    }
  }

  /** */
  updateUI() {
    this.editorEl.innerHTML = '';
    const title = document.createElement('p');
    title.innerHTML = 'Operations';
    this.editorEl.appendChild(title);
    this.operationsContainer.innerHTML = '';
    this.editorEl.appendChild(this.operationsContainer);

    this.parseContent();
    this.generateBlockContent();

    this.showCreateAssignEditorButton();
    this.showCreateOperationEditorButton();
  }

  /** */
  parseContent() {
    const operations = this.currentSelected.content.split('; ');
    const assignRegex = /^([A-Za-z_][[A-Za-z0-9_]*){0,1}?\s*(=|\+=|-=|\*=|\/=|%=){1}?\s*(([A-Za-z_][[A-Za-z0-9_]*)|(\".*\")|(\'.*\')|([0-9]+)){0,1}$/;
    const operationRegex = /^([A-Za-z_][[A-Za-z0-9_]*){0,1}?\s*(=|\+=|-=|\*=|\/=|%=){1}?\s*(([A-Za-z_][[A-Za-z0-9_]*)|(\".*\")|(\'.*\')|([0-9]+)){0,1}\s*(\+|-|\*|\/|%){1}?\s*(([A-Za-z_][[A-Za-z0-9_]*)|(\".*\")|(\'.*\')|([0-9]+)){0,1}$/;
    for (const operation of operations) {
      if (assignRegex.test(operation)) {
        const regexResult = assignRegex.exec(operation);
        this.createAssignEditor(regexResult[1], regexResult[2], regexResult[3]);
      } else if (operationRegex.test(operation)) {
        const regexResult = operationRegex.exec(operation);
        this.createOperationEditor(regexResult[1], regexResult[2], regexResult[3], regexResult[8], regexResult[9]);
      }
    }
  }

  /** */
  showCreateAssignEditorButton() {
    const createAssignEditorButton = document.createElement('button');
    createAssignEditorButton.innerHTML = 'New assign operation';
    createAssignEditorButton.onclick = () => this.createAssignEditor();
    this.editorEl.appendChild(createAssignEditorButton);
  }

  /** */
  showCreateOperationEditorButton() {
    const createOperationEditorButton = document.createElement('button');
    createOperationEditorButton.innerHTML = 'New operation';
    createOperationEditorButton.onclick = () => this.createOperationEditor();
    this.editorEl.appendChild(createOperationEditorButton);
  }

  /** */
  createAssignEditor(...components) {
    console.log(this.variablePool);
    const newOperation = new AssignEditor(components, this.variablePool, this.modalManager, this.generateBlockContent.bind(this));
    this.blockOperations.push(newOperation);
    this.operationsContainer.appendChild(newOperation.container);
    this.generateBlockContent();
  }

  /** */
  createOperationEditor(...components) {
    const newOperation = new OperationEditor(components, this.variablePool, this.modalManager, this.generateBlockContent.bind(this));
    this.blockOperations.push(newOperation);
    this.operationsContainer.appendChild(newOperation.container);
    this.generateBlockContent();
  }

  /** */
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
   * @param {*} callback
  */
  setRenderCallback(callback) {
    this.renderCallback = callback;
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
     * Calculate the x and y change in the axis
     * and apply it to the view
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
