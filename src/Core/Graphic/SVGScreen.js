/** */
export class SVGScreen {
  /**
   * @param {string} svgScreeenId:
   * @param {string} zoomInButtonId:
   * @param {string} zoomOutButtonId:
   * @param {string} resetViewButtonId:
  */
  constructor(svgScreeenId,
      zoomInButtonId,
      zoomOutButtonId,
      resetViewButtonId) {
    this.SVGScreenEl = document.getElementById(svgScreeenId);
    this.zoomInButtonEl = document.getElementById(zoomInButtonId);
    this.zoomOutButtonEl = document.getElementById(zoomOutButtonId);
    this.resetViewButtonEl = document.getElementById(resetViewButtonId);

    this.screenData = {
      panX: 0,
      panY: 0,
      zoom: 1000,
    };

    this.init();
  }

  /** */
  get formattedScreenData() {
    // eslint-disable-next-line max-len
    return `${this.screenData.panX} ${this.screenData.panY} ${this.screenData.zoom} ${this.screenData.zoom}`;
  }

  /** */
  init() {
    console.log(this);
    this.setupView();
    this.setupEventListners();
  }

  /** */
  setupView() {
    this.applyViewTransforms();
  }

  /** */
  setupEventListners() {
    this.zoomInButtonEl.addEventListener('click', () => this.zoomIn());
    this.zoomOutButtonEl.addEventListener('click', () => this.zoomOut());
  }

  /** */
  applyViewTransforms() {
    this.SVGScreenEl.setAttribute('viewBox', this.formattedScreenData);
  }

  /** */
  zoomIn() {
    this.screenData.zoom -= 50;
    this.applyViewTransforms();
  }

  /** */
  zoomOut() {
    this.screenData.zoom += 50;
    this.applyViewTransforms();
  }
}
