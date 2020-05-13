/**
 * This class manage the statusbar of the builder interface
*/
export class Statusbar {
  /**
   * The class constructor get the elements of the statusbar
  */
  constructor() {
    this.statusbarEl = document.getElementById('status-bar');
  }

  /**
   * Init the toolbar event handlers and the state
   * @param {string} string the string to display
  */
  display(string) {
    this.statusbarEl.querySelector('p').innerHTML = string;
  }
}
