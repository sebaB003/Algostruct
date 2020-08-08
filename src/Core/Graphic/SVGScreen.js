import {moveBuilderView} from '../Utils/MoveBehaviour';

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

    this.renderCallback = null;
    this.screenData = {};

    this.init();
  }

  /**
   * Allow to set a render callback
   * @param {*} callback the callback function
   */
  setRenderCallback(callback) {
    this.renderCallback = callback;
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
        (event) => moveBuilderView(event, this, {once: true}));

    this.SVGScreenEl.addEventListener('wheel',
        (event) => this.wheelHandler(event));

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
    if (this.renderCallback) {
      this.renderCallback();
    }
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
    if (this.renderCallback) {
      this.renderCallback();
    }
  }

  /**
   * Increase the zoom of the screen
  */
  zoomIn() {
    if ((this.screenData.zoom - 50) > 0) {
      this.screenData.zoom -= 50;
      this.applyViewTransforms();
    }
    if (this.renderCallback) {
      this.renderCallback();
    }
  }

  /**
   * Decrease the zoom of the screen
   */
  zoomOut() {
    if (this.screenData.zoom + 50 < 4000) {
      this.screenData.zoom += 50;
      this.applyViewTransforms();
    }
    if (this.renderCallback) {
      this.renderCallback();
    }
  }

  /**
   * Returns svg element width
   * @return {number} width
  */
  getWidth() {
    const width = this.SVGScreenEl.getBoundingClientRect().width;
    return width;
  }

  /**
   * Returns svg element height
   * @return {number} height
  */
  getHeight() {
    const height = this.SVGScreenEl.getBoundingClientRect().height;
    return height;
  }

  /**
   * Returns svg element width computed with the zoom
   * @return {number} computed width
  */
  getComputedWidth() {
    return (this.getWidth() * this.screenData.zoom) / 700;
  }

  /**
   * Returns svg element height computed with the zoom
   * @return {number} computed height
  */
  getComputedHeight() {
    console.log( this.screenData.zoom, this.getHeight());
    return (this.getHeight() * this.screenData.zoom) / 600;
  }

  /**
   * Remove all the elemnts
   */
  clean() {
    this.SVGScreenEl.innerHTML = '';
  }
}
