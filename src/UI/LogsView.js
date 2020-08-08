/** */
export class LogsView {
  /**
   *
   */
  constructor() {
    this.logsEl = document.getElementById('logs');
    this.grabbableEl = this.logsEl.querySelector('.grabbable');

    this._state = OPEN;
    this.state = OPEN;

    this.init();
  }

  /** */
  init() {
    this.setupEventHandlers();
  }

  /**
   *
   */
  setupEventHandlers() {
    this.grabbableEl.addEventListener('mousedown', (event) => this.resize(event));
    this.logsEl.querySelector('button').addEventListener('click', () => this.close());
  }

  /** */
  close() {
    this.logsEl.style.display = 'none';
  }

  /** */
  open() {
    this.logsEl.style.display = 'flex';
    this.logsEl.style.width = '100%';
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
    const logsView = this;

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
          logsView.setClose();
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
