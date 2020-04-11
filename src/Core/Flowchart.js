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
   *
   * @param {*} pointer
   * @param {*} condition
   * @param {*} callback
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
   * @param {*} func
   */
  apply(func) {
    this._parse(this.structure, (p)=> p.type != 'end', func);
  }
}
