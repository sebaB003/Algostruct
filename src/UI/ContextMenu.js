/**
 * Allow to open and close custom context menus
*/
export class ContextMenuManager {
  /**
   * @param {*} parent: The context menu related object
   */
  constructor(parent) {
    this.contextMenuElement;
    this.closeContextMenuHandler = this.close.bind(this);
    this.isContextMenuOpen = false;
    this.parent = parent;
  }

  /**
   * Close previous instances and next create a new one
   * @param {*} event
   * @param {*} block: the caller object
   * @param {*} functions: the object that contains the labels and the functions
   */
  open(event, block, functions) {
    event.stopPropagation();
    event.preventDefault();
    this.close();
    this.createContextMenu(event.pageX, event.pageY);
    this.addFunctions(block, functions);
    window.addEventListener('click', this.closeContextMenuHandler);
    document.body.appendChild(this.contextMenuElement);
    this.isContextMenuOpen = true;
  }

  /**
   * Create the context menu container and position it
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
   * Iterate the functions object and create the buttons
   * @param {*} block: the caller object
   * @param {*} functions: the object that contains the labels and the functions
   */
  addFunctions(block, functions) {
    for (const func in functions) {
      if (functions[func]) {
        this._createEventHandler(func, block, functions[func]);
      }
    }
  }

  /**
   * Creates a labeled button with a binded function
   * @param {string} funcName: function name to display
   * @param {*} block: the caller object
   * @param {*} func: the function to attach
   */
  _createEventHandler(funcName, block, func) {
    const element = document.createElement('button');
    element.textContent = funcName;
    element.addEventListener('click', () => func(block, this.parent));
    this.contextMenuElement.appendChild(element);
  }

  /**
   * This function close the active context menu
  */
  close() {
    if (this.isContextMenuOpen) {
      this.contextMenuElement.remove();
      this.contextMenuElement = null;
      window.removeEventListener('click', this.closeContextMenuHandler);
      this.isContextMenuOpen = false;
    }
  }
}
