/** */
export class Editor {
  /** */
  constructor() {
    this.editorEl = document.querySelector(
        '#builder-interface__editor div');
    this.currentSelected = undefined;

    this.renderCallback = undefined;

    this.init();
  }

  /** */
  init() {
    this.setupEventHandlers();
  }

  /** */
  setupEventHandlers() {
    this.editorEl.parentElement.addEventListener('mousedown', (event) => this.resize(event));
  }

  /**
   * @param {*} block
  */
  loadBlock(block) {
    if (this.currentSelected != block) {
      this.currentSelected = block;
      this.updateUI();
    }
  }

  /** */
  updateUI() {
    this.editorEl.innerHTML = '';
    const typeLabel = document.createElement('p');
    typeLabel.innerHTML = `Type: ${this.currentSelected.type}`;
    const contentEditor = document.createElement('input');
    contentEditor.setAttribute('type', 'text');
    contentEditor.setAttribute('value', this.currentSelected.content);
    this.editorEl.appendChild(typeLabel);
    this.editorEl.appendChild(contentEditor);
    contentEditor.onkeyup = (event) => {
      this.currentSelected.content = event.target.value;
      this.renderCallback();
    };
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
        lastX = event.pageX;
      }
    }
  }
}
