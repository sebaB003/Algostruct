// Namespace to generate SVG
const SVGNS = 'http://www.w3.org/2000/svg';

/**
 * This class is used to generates the SVG elements
 */
export class BlockGenerator {
  /**
   * @param {*} screen
   */
  constructor(screen) {
    this.screen = screen;

    this.textColor = "#00A561";
    this.fillColor = "#FFF";
    this.lineColor = "#00A561";
    this.fontFamily = "Verdana";
    this.lineWidth = 3;

    this.presets = {
      // Rect
      'rect': `fill:${this.fillColor};`,
      // Rounded rectangle
      'crect': `rx:30;ry:30;fill:${this.fillColor};`,
      // Circle
      'circle': `rx:100%;ry:100%;fill:${this.fillColor};`,
    };
  }

  /**
   * @param {*} block 
   */
  generateDiamond(block) {
    if (block.nextBlock) {
      this.generateConnector(block, block.nextBlock);
    }
    if (block.nextBlock2) {
      this.generateConnector(block, block.nextBlock2);
    }

    let svgEl;
    if (this.isInView(block)) {
      svgEl = document.createElementNS(SVGNS, 'g');
      const offsetX = block.width/2;
      const centerY = block.height / 2;
      const centerX = block.width / 2;
    
      svgEl.innerHTML = `<path transform="translate(${block.posX - offsetX}, ${block.posY})" d="M0,${centerY} L${centerX},0 L${block.width},${centerY} L${centerX},${block.height}z" style="${this.presets.rect}"/>`;
      this.showSelected(block, svgEl);
      this.setOutlineColor(block, svgEl);
    
      this.generateText(svgEl, block);
    
      svgEl.id = `block${block.id}`;
      this.screen.SVGScreenEl.append(svgEl);
    }
    return svgEl;
  }

  /**
 * @param {*} block
 * @return {*} svgEl
 */
  generateCircle(block) {
    if (block.nextBlock) {
      this.generateConnector(block, block.nextBlock);
    }

    let svgEl;
    if (this.isInView(block)) {
      svgEl = document.createElementNS(SVGNS, 'g');
      const offsetX = block.width/2;
      svgEl.innerHTML = `<rect x=${block.posX - offsetX} y=${block.posY} width=${block.width} height=${block.height} style="${this.presets.circle}"/>`;
      this.showSelected(block, svgEl);
      this.setOutlineColor(block, svgEl);

      this.generateText(svgEl, block);

      svgEl.id = `block${block.id}`;
      this.screen.SVGScreenEl.append(svgEl);

      this.screen.SVGScreenEl.append(svgEl);
    }
    return svgEl;
  }
  /**
   * @param {*} block
   * @return {*} svgEl
   */
  generateCRect(block) {
    if (block.nextBlock) {
      this.generateConnector(block, block.nextBlock);
    }

    let svgEl;
    if (this.isInView(block)) {
      svgEl = document.createElementNS(SVGNS, 'g');
      const offsetX = block.width/2;
      svgEl.innerHTML = `<rect x=${block.posX - offsetX} y=${block.posY} width=${block.width} height=${block.height} style="${this.presets.crect}"/>`;
      this.showSelected(block, svgEl);
      this.setOutlineColor(block, svgEl);

      this.generateText(svgEl, block);

      svgEl.id = `block${block.id}`;
      this.screen.SVGScreenEl.append(svgEl);

      this.screen.SVGScreenEl.append(svgEl);
    }
    return svgEl;
  }

  /**
   * @param {*} block
   * @return {*} svgEl
   */
  generateRect(block) {
    if (block.nextBlock) {
      this.generateConnector(block, block.nextBlock);
    }
    let svgEl;
    if (this.isInView(block)) {
      svgEl = document.createElementNS(SVGNS, 'g');
      const offsetX = block.width/2;
      svgEl.innerHTML = `<rect x=${block.posX - offsetX} y=${block.posY} width=${block.width} height=${block.height} style="${this.presets.rect}"/>`;
      this.showSelected(block, svgEl);
      this.setOutlineColor(block, svgEl);

      this.generateText(svgEl, block);

      svgEl.id = `block${block.id}`;
      this.screen.SVGScreenEl.append(svgEl);

      this.screen.SVGScreenEl.append(svgEl);
    }

    return svgEl;
  }

  /**
   * @param {*} block
   * @return {*} svgEl
   */
  generateORect(block) {
    if (block.nextBlock) {
      this.generateConnector(block, block.nextBlock);
    }

    let svgEl;
    if (this.isInView(block)) {
      svgEl = document.createElementNS(SVGNS, 'g');
      const offsetX = block.width/2;
      svgEl.innerHTML = `<path transform="translate(${block.posX - offsetX}, ${block.posY})" d="M10,0 L${block.width+10},0 L${block.width-10},${block.height} L-10,${block.height}z" style="${this.presets.rect}"/>`;
      svgEl.innerHTML += `<text x=${block.posX + block.width/2} y=${block.posY + block.height} font-family=${this.fontFamily} font-size=28 fill=${this.textColor}>${block.type[0].toUpperCase()}</text>`;
      this.showSelected(block, svgEl);
      this.setOutlineColor(block, svgEl);

      this.generateText(svgEl, block);

      svgEl.id = `block${block.id}`;
      this.screen.SVGScreenEl.append(svgEl);

      this.screen.SVGScreenEl.append(svgEl);
    }
    return svgEl;
  }

  /**
   * @param {*} block
   * @return {*} svgEl
   */
  generateComment(block) {
    let svgEl;
    if (this.isInView(block)) {
      svgEl = document.createElementNS(SVGNS, 'g');
      this.generateText(svgEl, block);

      const commentLine = document.createElementNS(SVGNS, 'polyline');
      commentLine.setAttribute('style',
          'stroke:#000;stroke-width:1;fill:none');

      commentLine.setAttribute('points',
          `${block.previousBlock.posX + block.previousBlock.height/2}, ${block.previousBlock.posY + block.previousBlock.height / 2} ${block.posX}, ${block.posY + 5} ${block.posX + block.width}, ${block.posY + 5}`);

      this.screen.SVGScreenEl.append(svgEl);
      this.screen.SVGScreenEl.append(commentLine);
    }

    return svgEl;
  }
  
  /**
 * @param {*} svgEl
 * @param {*} block
 */
  generateText(svgEl, block) {
    if (this.screen.screenData.optimizeText) {
      this._generateFakeText(svgEl, block);
    } else {
      this._generateText(svgEl, block);
    }
  }

  /**
 * @param {*} svgEl
 * @param {*} block
 */
  _generateFakeText(svgEl, block) {
    if (block.type != 'comment') {
      svgEl.innerHTML += `<rect x=${block.posX - (block.width / 2) + 80} y=${block.posY + block.height / 2 - 10} width=${Math.max(0, block.width - 160)} height=${15} style="fill:${this.textColor}"/>`;
    } else {
      svgEl.innerHTML += `<rect x=${block.posX} y=${block.posY - 20} width=${Math.max(0, block.width - 160)} height=${15} style="fill:#000"/>`;
    }
  }

  /**
 * @param {*} svgEl
 * @param {*} block
 */
  _generateText(svgEl, block) {
    const textOffsetY = block.height / 2;

    let color = undefined;
    if (block.type == 'comment') {
      color = '#000';
    } else {
      color = this.textColor;
    }
    if (block.type == 'comment') {
      svgEl.innerHTML += `<text x=${block.posX} y=${block.posY} font-family=${this.fontFamily} font-size=28 fill=${color}>${block.content}</text>`;
    } else {
      svgEl.innerHTML += `<text x=${block.posX} y=${block.posY + textOffsetY} font-family=${this.fontFamily} font-size=28 fill=${color} text-anchor="middle" alignment-baseline="middle">${block.content}</text>`;
    }
  }

  /**
 * @param {*} block1
 * @param {*} block2
 * TODO: divide in multiple functions
 */
  generateConnector(block1, block2) {
    if (this.isInView(block1) || this.isInView(block2)) {
      let svgEl = document.createElementNS(SVGNS, 'polyline');
      svgEl.setAttribute('style', `stroke:${this.lineColor};stroke-width:${this.lineWidth};fill:none`);
  
      if (block1.posY < block2.posY - block1.height) {
        svgEl = this._verticalConnector(svgEl, block1, block2);
      } else {
        if (block1.nextBlock && block2.nextBlock) {
          if (block1.type == 'condition' && block1.node == block2 ||
            block2 == block2.nextBlock.node) {
            svgEl = this._cShapeConnector(svgEl, block1, block2);
          } else {
            svgEl = this._sShapeConnector(svgEl, block1, block2);
          }
        } else {
          svgEl = this._sShapeConnector(svgEl, block1, block2);
        }
      }
      this.screen.SVGScreenEl.append(svgEl);
  
      const centerX2 = block2.posX;
      if (block2.type != 'insert' && block2.type != 'node') {
        this.generateArrow(centerX2, block2.posY);
      }
    }
  }

  /**
 * @param {*} svgEl
 * @param {*} block1
 * @param {*} block2
 * @return {*} svgEl
 */
  _cShapeConnector(svgEl, block1, block2) {
    const centerX1 = block1.posX;
    const y1 = block1.posY + block1.height;
    const centerX2 = block2.posX;
    const offsetY1 = block1.height / 2;
    const offsetY2 = block2.height / 2;
    const offsetX = block1.posX > block2.posX ?
      centerX1 - Math.abs(centerX2 - centerX1) - 200 :
      centerX1 - 200;
    svgEl.setAttribute('points', `${centerX1}, ${y1 - offsetY1}
    ${offsetX}, ${y1 - offsetY1} ${offsetX}, ${block2.posY + offsetY2}
    ${centerX2}, ${block2.posY + offsetY2}`);
    return svgEl;
  }

  /**
 * @param {*} svgEl
 * @param {*} block1
 * @param {*} block2
 * @return {*} svgEl
 */
  _sShapeConnector(svgEl, block1, block2) {
    const centerX1 = block1.posX;
    const y1 = block1.posY + block1.height;
    const centerX2 = block2.posX;
    const middleX = centerX1 - ((centerX1 - centerX2) / 2);
    const y2 = y1 + 50;
    const y3 = block2.posY - 50;
    svgEl.setAttribute('points', `${centerX1}, ${y1} ${centerX1}, ${y2} 
    ${middleX}, ${y2} ${middleX}, ${y3} ${centerX2}, ${y3} 
    ${centerX2}, ${block2.posY}`);

    return svgEl;
  }
  /**
  * @param {*} svgEl
  * @param {*} block1
  * @param {*} block2
  * @return {*} svgEl
  */
  _verticalConnector(svgEl, block1, block2) {
    const centerX1 = block1.posX;
    const y1 = block1.posY + block1.height;
    const centerX2 = block2.posX;
    const middleY = y1 - ((y1 - block2.posY) / 2);

    if (block1.type == 'condition') {
      const offsetY = block1.height / 2;
      svgEl.setAttribute('points',
          `${centerX1}, ${y1 - offsetY} ${centerX2}, ${y1 - offsetY}
          ${centerX2}, ${block2.posY}`);
    } else if (block2.type == 'node') {
      const offsetY = block2.height / 2;
      svgEl.setAttribute('points',
          `${centerX1}, ${y1} ${centerX1}, ${block2.posY + offsetY}
          ${centerX2}, ${block2.posY + offsetY}`);
    } else {
      svgEl.setAttribute('points',
          `${centerX1}, ${y1} ${centerX1}, ${middleY}
          ${centerX2}, ${middleY} ${centerX2}, ${block2.posY}`);
    }
    return svgEl;
  }

  /**
 * @param {*} x
 * @param {*} y
 */
  generateArrow(x, y) {
    const arrow = document.createElementNS(SVGNS, 'polyline');
    arrow.setAttribute('style', `stroke:${this.lineColor};stroke-width:${this.lineWidth};fill:none`);
    arrow.setAttribute('points',
        `${x - 10}, ${y - 13} ${x}, ${y - 3} ${x + 10}, ${y - 13}`);
    this.screen.SVGScreenEl.append(arrow);
  }

  /**
   * @param {*} block
   * @param {*} el
   */
  showSelected(block, el) {
    if (block.isSelected) {
      el.firstChild.setAttribute('stroke-width', (this.lineWidth + 2));
    } else {
      el.firstChild.setAttribute('stroke-width', this.lineWidth);
    }
  }
  /**
  * Set the outline color
  * @param {*} block
  * @param {*} el
  */
  setOutlineColor(block, el) {
    if (block.hasErrors) {
      el.firstChild.setAttribute('stroke', '#F00');
    } else {
      el.firstChild.setAttribute('stroke', this.lineColor);
    }
  }

  /** */
  isInView(block) {
    return block.posX + (block.width / 2) > this.screen.screenData.panX && block.posY + block.height > this.screen.screenData.panY;
  }
}
