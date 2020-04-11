
/** */
export class ContextMenu {
  /**
   * @param {*} event
   * @param {*} functions
   */
  constructor(event, functions) {
    this.contextMenuElement;
    this.openContextMenu(event, functions);
  }

  /**
   * @param {*} event
   * @param {*} functions
   */
  openContextMenu(event, functions) {
    event.stopPropagation();
    event.preventDefault();
    this.createContextMenu(event.pageX, event.pageY);
    this.addFunctions(functions);
    window.addEventListener('click', this.closeContextMenu);
    document.body.appendChild(this.contextMenuElement);
  }

  /**
   * @param {*} posX
   * @param {*} posY
   */
  createContextMenu(posX, posY) {
    this.contextMenuElement = document.createElement('div');
    this.contextMenuElement.setAttribute('class', 'contextmenu');
    this.contextMenuElement.style.left = posX + 'px';
    this.contextMenuElement.style.top = posY + 'px';
  }

  /**
   * @param {*} functions
   */
  addFunctions(functions) {
    for (const func in functions) {
      if (functions[func]) {
        this._createEventHandler(func, functions[func]);
      }
    }
  }

  /**
   * @param {*} funcName
   * @param {*} func
   */
  _createEventHandler(funcName, func) {
    const element = document.createElement('button');
    element.textContent = funcName;
    element.addEventListener('click', func);
    this.contextMenuElement.appendChild(element);
  }

  /** */
  closeContextMenu() {
    this.contextMenuElement.remove();
    this.contextMenuElement = null;
    window.removeEventListener('click', this.contextMenuElement);
  }
}
