import {SVGScreen} from '../Core/Graphic/SVGScreen';
/** */
export class Builder {
  /** */
  constructor() {
    this.screen = new SVGScreen('builder-interface__builder__screen',
        'js--zoom-in',
        'js--zoom-out',
        'js--reset-view');
  }
}
