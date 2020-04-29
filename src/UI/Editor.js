/** */
export class Editor {
  /** */
  constructor() {
    this.currentSelected = undefined;
  }

  /**
   * @param {*} block
  */
  loadBlock(block) {
    if (this.currentSelected != block) {
      this.currentSelected = block;
      console.log(this.currentSelected);
      // this.updateUI();
    }
  }

  /** */
  updateUI() {
    console.log(this.currentSelected);
    // Load description
    // Load content
    // Load metadata
  }
}
