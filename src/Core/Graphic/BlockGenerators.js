// Namespace to generate SVG
const SVGNS = 'http://www.w3.org/2000/svg';

/**
 * @param {*} screen
 * @param {*} block
 * @return {*} svgEl
 */
export function generateDiamond(screen, block) {
  if (block.nextBlock) {
    generateConnector(screen, block, block.nextBlock);
  }
  if (block.nextBlock2) {
    generateConnector(screen, block, block.nextBlock2);
  }
  const svgEl = document.createElementNS(SVGNS, 'g');
  const offsetX = block.width/2;
  const centerY = block.height / 2;
  const centerX = block.width / 2;

  svgEl.innerHTML = `<path transform="translate(${block.posX - offsetX}, ${block.posY})" d="M0,${centerY} L${centerX},0 L${block.width},${centerY} L${centerX},${block.height}z" style="${presets.rect}"/>`;
  showSelected(block, svgEl);
  setOutlineColor(block, svgEl);

  _generateText(svgEl, block);

  screen.append(svgEl);
  return svgEl;
}

/**
 * @param {*} screen
 * @param {*} block
 * @return {*} svgEl
 */
export function generateCircle(screen, block) {
  if (block.nextBlock) {
    generateConnector(screen, block, block.nextBlock);
  }
  const svgEl = document.createElementNS(SVGNS, 'g');
  const offsetX = block.width/2;
  svgEl.innerHTML = `<rect x=${block.posX - offsetX} y=${block.posY} width=${block.width} height=${block.height} style="${presets.circle}"/>`;
  showSelected(block, svgEl);
  setOutlineColor(block, svgEl);

  _generateText(svgEl, block);

  screen.append(svgEl);
  return svgEl;
}

/**
 * @param {*} screen
 * @param {*} block
 * @return {*} svgEl
 */
export function generateCRect(screen, block) {
  if (block.nextBlock) {
    generateConnector(screen, block, block.nextBlock);
  }
  const svgEl = document.createElementNS(SVGNS, 'g');
  const offsetX = block.width/2;
  svgEl.innerHTML = `<rect x=${block.posX - offsetX} y=${block.posY} width=${block.width} height=${block.height} style="${presets.crect}"/>`;
  showSelected(block, svgEl);
  setOutlineColor(block, svgEl);

  _generateText(svgEl, block);

  screen.append(svgEl);
  return svgEl;
}


/**
 * @param {*} screen
 * @param {*} block
 * @return {*} svgEl
 */
export function generateRect(screen, block) {
  if (block.nextBlock) {
    generateConnector(screen, block, block.nextBlock);
  }
  const svgEl = document.createElementNS(SVGNS, 'g');
  const offsetX = block.width/2;
  svgEl.innerHTML = `<rect x=${block.posX - offsetX} y=${block.posY} width=${block.width} height=${block.height} style="${presets.rect}"/>`;
  showSelected(block, svgEl);
  setOutlineColor(block, svgEl);

  _generateText(svgEl, block);

  screen.append(svgEl);
  return svgEl;
}

/**
 * @param {*} screen
 * @param {*} block
 * @return {*} svgEl
 */
export function generateORect(screen, block) {
  if (block.nextBlock) {
    generateConnector(screen, block, block.nextBlock);
  }
  const svgEl = document.createElementNS(SVGNS, 'g');
  const offsetX = block.width/2;
  svgEl.innerHTML = `<path transform="translate(${block.posX - offsetX}, ${block.posY})" d="M10,0 L${block.width+10},0 L${block.width-10},${block.height} L-10,${block.height}z" style="${presets.rect}"/>`;
  svgEl.innerHTML += `<text x=${block.posX + block.width/2} y=${block.posY + block.height} font-family="Verdana" font-size=28 fill="#00A651">${block.type[0].toUpperCase()}</text>`;
  showSelected(block, svgEl);
  setOutlineColor(block, svgEl);

  _generateText(svgEl, block);

  screen.append(svgEl);
  return svgEl;
}

/**
 * @param {*} screen
 * @param {*} block
 * @return {*} svgEl
 */
export function generateComment(screen, block) {
  const svgEl = document.createElementNS(SVGNS, 'g');
  _generateText(svgEl, block);

  const commentLine = document.createElementNS(SVGNS, 'polyline');
  commentLine.setAttribute('style',
      'stroke:#000;stroke-width:1;fill:none');

  commentLine.setAttribute('points',
      `${block.previousBlock.posX + block.previousBlock.height/2}, ${block.previousBlock.posY + block.previousBlock.height / 2} ${block.posX}, ${block.posY + 5} ${block.posX + block.width}, ${block.posY + 5}`);

  screen.append(svgEl);
  screen.append(commentLine);
  return svgEl;
}

/**
 * @param {*} svgEl
 * @param {*} block
 */
function _generateText(svgEl, block) {
  const offsetX = block.width/2;
  const textOffsetX = (block.width/4) + 20 - offsetX;
  const textOffsetY = (block.height/2) + 10;

  let color = undefined;
  if (block.type == 'comment') {
    color = '#000';
  } else {
    color = '#00A651';
  }
  if (block.type == 'comment') {
    svgEl.innerHTML += `<text x=${block.posX} y=${block.posY} font-family="Verdana" font-size=28 fill=${color}>${block.content}</text>`;
  } else if (block.type != 'insert') {
    svgEl.innerHTML += `<text x=${block.posX + textOffsetX} y=${block.posY + textOffsetY} font-family="Verdana" font-size=28 fill=${color}>${block.content}</text>`;
  } else {
    svgEl.innerHTML += `<text x=${block.posX + textOffsetX - 24} y=${block.posY+24} font-family="Verdana" font-size=28 fill="#00A651">${block.content}</text>`;
  }
}

/**
 * @param {*} screen
 * @param {*} block1
 * @param {*} block2
 * TODO: divide in multiple functions
 */
function generateConnector(screen, block1, block2) {
  let svgEl = document.createElementNS(SVGNS, 'polyline');
  svgEl.setAttribute('style', 'stroke:#00A651;stroke-width:3;fill:none');

  if (block1.posY < block2.posY - block1.height) {
    svgEl = _verticalConnector(svgEl, block1, block2);
  } else {
    if (block1.nextBlock && block2.nextBlock) {
      if (block1.type == 'condition' && block1.node == block2 ||
        block2 == block2.nextBlock.node) {
        svgEl = _cShapeConnector(svgEl, block1, block2);
      } else {
        svgEl = _sShapeConnector(svgEl, block1, block2);
      }
    } else {
      svgEl = _sShapeConnector(svgEl, block1, block2);
    }
  }
  screen.append(svgEl);

  const centerX2 = block2.posX;
  if (block2.type != 'insert' && block2.type != 'node') {
    generateArrow(screen, centerX2, block2.posY);
  }
}

/**
 * @param {*} svgEl
 * @param {*} block1
 * @param {*} block2
 * @return {*} svgEl
 */
function _cShapeConnector(svgEl, block1, block2) {
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
function _sShapeConnector(svgEl, block1, block2) {
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
function _verticalConnector(svgEl, block1, block2) {
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
 * @param {*} screen
 * @param {*} x
 * @param {*} y
 */
function generateArrow(screen, x, y) {
  const arrow = document.createElementNS(SVGNS, 'polyline');
  arrow.setAttribute('style', 'stroke:#00A651;stroke-width:3;fill:none');
  arrow.setAttribute('points',
      `${x - 10}, ${y - 13} ${x}, ${y - 3} ${x + 10}, ${y - 13}`);
  screen.append(arrow);
}

/**
 * @param {*} block
 * @param {*} el
 */
function showSelected(block, el) {
  if (block.isSelected) {
    el.firstChild.setAttribute('stroke-width', '5');
  } else {
    el.firstChild.setAttribute('stroke-width', '3');
  }
}

/**
 * Set the outline color
 * @param {*} block
 * @param {*} el
*/
function setOutlineColor(block, el) {
  if (block.hasErrors) {
    el.firstChild.setAttribute('stroke', '#F00');
  } else {
    el.firstChild.setAttribute('stroke', '#00A651');
  }
}

const presets = {
  // Rect
  'rect': 'fill:#fff;',
  // Rounded rectangle
  'crect': 'rx:30;ry:30;fill:#fff;',
  // Circle
  'circle': 'rx:100%;ry:100%;fill:#fff;',
};
