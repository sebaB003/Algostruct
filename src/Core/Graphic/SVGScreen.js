/**
 * Manage the svg element
*/
export class SVGScreen {
  /**
   * @param {string} svgScreeenId
   * @param {string} zoomInButtonId
   * @param {string} zoomOutButtonId
   * @param {string} resetViewButtonId
  */
  constructor(svgScreeenId,
      zoomInButtonId,
      zoomOutButtonId,
      resetViewButtonId) {
    this.SVGScreenEl = document.getElementById(svgScreeenId);
    this.zoomInButtonEl = document.getElementById(zoomInButtonId);
    this.zoomOutButtonEl = document.getElementById(zoomOutButtonId);
    this.resetViewButtonEl = document.getElementById(resetViewButtonId);

    this.screenData = {};

    this.init();
  }

  /**
   * Return a formatted string of parameters to apply
   * at the viewbox attribute
  */
  get formattedScreenData() {
    // eslint-disable-next-line max-len
    return `${this.screenData.panX} ${this.screenData.panY} ${this.screenData.zoom} ${this.screenData.zoom}`;
  }

  /**
   * Init the eventListners and the view
  */
  init() {
    this.setupView();
    this.setupEventListeners();
  }

  /**
   * Set the view to default values
   */
  setupView() {
    this.resetView();
  }

  /**
   * Assign events handlers to the components
  */
  setupEventListeners() {
    this.SVGScreenEl.addEventListener('mousedown',
        (event) => this.moveBuilderView(event));

    this.SVGScreenEl.addEventListener('wheel', (event) => this.wheelHandler(event));

    // Prevent to open contextmenu
    this.SVGScreenEl.addEventListener('contextmenu',
        (event) => event.preventDefault());

    this.zoomInButtonEl.addEventListener('click', () => this.zoomIn());
    this.zoomOutButtonEl.addEventListener('click', () => this.zoomOut());
    this.resetViewButtonEl.addEventListener('click', ()=> this.resetView());

    window.addEventListener('keydown', (event) => this.keysHandler(event));
  }

  /**
   * Manage the mouse wheel events
   * @param {Event} event
   */
  wheelHandler(event) {
    if (event.deltaY == -100) {
      this.zoomIn();
    } else {
      this.zoomOut();
    }
  }

  /**
   * Mangae the screen schortcuts
   * @param {Event} event
   */
  keysHandler(event) {
    if (event.code == 'BracketRight' && (event.ctrlKey || event.metaKey)) {
      this.zoomIn();
      event.preventDefault();
    } else if (event.code == 'Slash' && (event.ctrlKey || event.metaKey)) {
      this.zoomOut();
      event.preventDefault();
    }
  }

  /**
   * Set the viewbox attribute with
   * the values of screenData
  */
  applyViewTransforms() {
    this.SVGScreenEl.setAttribute('viewBox', this.formattedScreenData);
  }

  /**
   * Add the pan change to screenData pan values
   * to move the view
   * @param {number} panX: change in x axis
   * @param {number} panY: change in y axis
   */
  applyPan(panX, panY) {
    this.screenData.panX += panX;
    this.screenData.panY += panY;
    this.applyViewTransforms();
  }

  /**
   * Reset view pan and zoom the default values
   */
  resetView() {
    this.centerView(false);
    this.screenData.zoom = 1000;
    this.applyViewTransforms();
  }

  /**
   * @param {boolean} apply: if true the view will centered
  */
  centerView(apply=true) {
    this.screenData.panX = 0;
    this.screenData.panY = 0;
    if (apply) {
      this.applyViewTransforms();
    }
  }

  /**
   * Increase the zoom of the screen
  */
  zoomIn() {
    this.screenData.zoom -= 50;
    this.applyViewTransforms();
  }

  /**
   * Decrease the zoom of the screen
   */
  zoomOut() {
    this.screenData.zoom += 50;
    this.applyViewTransforms();
  }

  /**
   * Attach the mousemove handler
   * @param {Event} event
   */
  moveBuilderView(event) {
    let lastX = 0;
    let lastY = 0;
    const screen = this;
    if (event.button == 0) {
      lastX = event.clientX;
      lastY = event.clientY;
      screen.SVGScreenEl.addEventListener('mousemove', moveView);
      event.preventDefault();
    }

    /**
     * Calculate the x and y change in the axis
     * and apply it to the view
     * @param {Event} event
     */
    function moveView(event) {
      screen.SVGScreenEl.style.cursor = 'grabbing';
      if (event.buttons == 0) {
        screen.SVGScreenEl.style.cursor = 'default';
        screen.SVGScreenEl.removeEventListener('mousemove', moveView);
      } else {
        const panX = lastX - event.clientX;
        const panY = lastY - event.clientY;
        screen.applyPan(panX, panY);
        lastX = event.clientX;
        lastY = event.clientY;
      }
    }
  }

  /**
   * Returns svg element width
   * @return {number} width:
  */
  getWidth() {
    const width = this.SVGScreenEl.getBoundingClientRect().width;
    return width;
  }

  /**
   * Remove all the elemnts
   */
  clean() {
    this.SVGScreenEl.innerHTML = '';
  }
}
