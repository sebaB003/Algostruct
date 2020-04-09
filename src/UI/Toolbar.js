/**
 * This class manage the toolbar of the builder interface
*/
export class Toolbar {
  /**
   * The class constructor get the elements of the toolbar
   * and setup the event handlers
  */
  constructor() {
    this.toolbarEl = document.getElementById('builder-interface__tools');
    this.reduceToolbarButton = document.getElementById('reduce-toolBar');

    this.setupEventHandlers();
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
   * TODO: toggle labels
   * FIXME: fix the toolbar
  */
  reduceToolbarHandler() {
    this.toolbarEl.classList.toggle('small');
  }
}
