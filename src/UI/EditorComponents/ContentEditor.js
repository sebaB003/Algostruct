import {SyntaxChecker} from '../../Core/SyntaxChecker';

/** */
export class ContentEditor {
  /**
   * @param {*} block
   * @param {*} renderCallback
   */
  constructor(block, renderCallback) {
    this.contentEditor = document.createElement('div');

    this.contentInput = undefined;
    this.errorMessage = undefined;

    this.block = block;
    this.blockEl = document.getElementById(`block${this.block.id}`);
    this.renderCallback = renderCallback;
    this.error = false;

    this.isSyntaxCheckerEnabled = true;

    this.init();
  }

  /** */
  init() {
    this.contentEditor.value = this.block.content;
    this.setupContentInput();
    this.setupErrorMessage();
    this.setupEventListeners();
  }

  /**
   * Create a DOM element to contain the content input
  */
  setupContentInput() {
    const title = document.createElement('p');
    title.innerHTML = 'Operations';
    this.contentEditor.appendChild(title);
    this.contentInput = document.createElement('input');
    this.contentInput.setAttribute('type', 'text');
    this.contentInput.value = this.block.content;
    this.contentEditor.append(this.contentInput);
  }

  /**
   * Create a DOM element to contain the error message
  */
  setupErrorMessage() {
    this.errorMessage = document.createElement('p');
    this.errorMessage.classList.add('error');

    this.contentEditor.append(this.errorMessage);
  }

  /** */
  setupEventListeners() {
    this.contentInput.onkeyup = (event) => {
      this.block.content = event.target.value;
      if (this.isSyntaxCheckerEnabled) {
        if (!SyntaxChecker.checkBlockSyntax(this.block)) {
          this.block.hasErrors = true;
          this.createErrorMessage('Invalid syntax!');
        } else {
          this.block.hasErrors = false;
          this.hideErrorMessage();
        }
      } else {
        this.block.hasErrors = false;
        this.hideErrorMessage();
      }

      this.renderCallback();
    };
  }

  /**
   * Display an error message
   * @param {*} message the message that the error should display
   */
  createErrorMessage(message) {
    this.errorMessage.innerText = message;
    this.errorMessage.style.display = 'block';
  }

  /**
   * Hide an error message
  */
  hideErrorMessage() {
    this.errorMessage.style.display = 'none';
  }
}
