/** */
export class WatchesView {
  /**
   *
   */
  constructor() {
    this.watchesEl = document.getElementById('watches');
    this.grabbableEl = this.watchesEl.querySelector('.grabbable');
    this.watchesListEl = this.watchesEl.querySelector('.watches-list');

    this._state = OPEN;
    this.state = HIDDEN;

    this.init();
  }

  /** */
  init() {
    this.showWatches([]);
    this.setupEventHandlers();
  }

  /**
   *
   */
  setupEventHandlers() {
    this.grabbableEl.addEventListener('mousedown', (event) => this.resize(event));
    this.watchesEl.querySelector('button').addEventListener('click', () => this.close());
  }

  /**
   * @param {*} variables
  */
  showWatches(variables) {
    this.watchesListEl.innerHTML = '';

    if (variables.length) {
      for (const variable of variables) {
        if (variable) {
          this.generateTableRow(variable);
        }
      }
    } else {
      this.watchesListEl.innerHTML = '<tr><td>Void memory</td></tr>';
    }
  }

  /**
   * @param {*} variable
  */
  generateTableRow(variable) {
    const row = document.createElement('tr');

    const {variableName, variableType='Unknown', variableUsage='Unknown', value=undefined} = variable;
    row.innerHTML = `
    <td>${variableName}</td>
    <td>${variableType}</td>
    <td>${variableUsage}</td>
    <td>${value}</td>`;

    this.watchesListEl.appendChild(row);
  }

  /** */
  close() {
    this.watchesEl.style.display = 'none';
  }

  /** */
  open() {
    this.watchesEl.style.display = 'flex';
    this.watchesEl.style.width = '100%';
  }

  /** */
  setOpen() {
    this.state = OPEN;
  }

  /** */
  setClose() {
    this.state = HIDDEN;
  }

  /** */
  set state(value) {
    this._state = value;
    if (value == OPEN) {
      this.open();
    } else if (value == HIDDEN) {
      this.close();
    }
  }

  /**
   * @param {*} event
   */
  resize(event) {
    const resizable = this.grabbableEl.parentElement;
    const watches = this;

    let oldWidth = 0;
    let newWidth = resizable.getBoundingClientRect().width;

    if (event.button == 0) {
      event.preventDefault();
      event.stopPropagation();
      window.addEventListener('mousemove', resizeX);
    }

    /**
     * Calculate the x-axis change
     * and calculate a new width
     * @param {Event} event
     */
    function resizeX(event) {
      if (event.buttons == 0) {
        if (newWidth <= 10) {
          watches.setClose();
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

const OPEN = Symbol('open');
const HIDDEN = Symbol('hidden');
