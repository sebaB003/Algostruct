/**
 * This class manage the toolbar of the builder interface
*/
export class Toolbar {
  /**
   * The class constructor get the elements of the toolbar
   * and setup the event handlers
   *
   * @param {boolean} isToolbarOpen: Set the toolbar status on creation
  */
  constructor(isToolbarOpen=false) {
    this.isToolbarOpen = isToolbarOpen;

    this.toolbarEl = document.getElementById('builder-interface__tools');
    this.reduceToolbarButton = document.getElementById('reduce-toolBar');

    this.init();
  }

  /**
   * Init the toolbar event handlers and the state
  */
  init() {
    this.setupEventHandlers();

    if (!this.isToolbarOpen) {
      this.reduceToolbarHandler();
    }
  }
  /**
   * Setup the event handlers for the tools
  */
  setupEventHandlers() {
    this.reduceToolbarButton.addEventListener(
        'click',
        () => this.reduceToolbarHandler());
  }


  /**
   * Changes the size of the toolbar and tools label
  */
  reduceToolbarHandler() {
    const labels = this.toolbarEl.querySelectorAll('.tool-label');

    this.toolbarEl.classList.toggle('small');

    // Hide labels
    labels.forEach((label) => label.classList.toggle('hide'));

    // Change button icon
    this.reduceToolbarButton.classList.toggle('reverse');

    this.isToolbarOpen = !this.isToolbarOpen;
  }
}
