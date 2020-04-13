/**
 * Flowchart
 */
export class Flowchart {
  /**
   *
   */
  constructor() {
    this.structure;
  }

  /**
   * Interate trougth the flowchart and apply a function
   * @param {*} pointer: current position of the iterator in the flowchart
   * @param {*} condition: set when the iteration must end
   * @param {*} callback: the function to apply
   */
  _parse(pointer=this.structure,
      condition=(p)=> p.type != 'end',
      callback=null) {
    while (condition(pointer)) {
      if (pointer.type == 'conditional' && pointer.nextBlock2) {
        parse(pointer.nextBlock2, (p)=> p.type!='end', callback);
      }
      if (callback) {
        callback(pointer);
      }
      pointer = pointer.nextBlock;
    }
    if (callback) {
      callback(pointer);
    }
  }

  /**
   * Apply a function to the flowchart
   * @param {*} func: the function to apply
   */
  apply(func) {
    this._parse(this.structure, (p)=> p.type != 'end', func);
  }
}
