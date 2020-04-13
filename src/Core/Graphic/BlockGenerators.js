// Namespace to generate SVG
const SVGNS = 'http://www.w3.org/2000/svg';

/**
 * @param {*} screen
 * @param {*} block
 * @return {*} svgEl
 */
export function generateCRect(screen, block) {
  if (block.previousBlock) {
    generateConnector(screen, block.previousBlock, block);
  }
  const svgEl = document.createElementNS(SVGNS, 'g');
  const offsetX = block.width/2;
  svgEl.innerHTML = `<rect x=${block.posX - offsetX} y=${block.posY} width=${block.width} height=${block.height} style="${presets.crect}"/>`;

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
  if (block.previousBlock) {
    generateConnector(screen, block.previousBlock, block);
  }
  const svgEl = document.createElementNS(SVGNS, 'g');
  const offsetX = block.width/2;
  svgEl.innerHTML = `<rect x=${block.posX - offsetX} y=${block.posY} width=${block.width} height=${block.height} style="${presets.circle}"/>`;

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
  if (block.previousBlock) {
    generateConnector(screen, block.previousBlock, block);
  }
  const svgEl = document.createElementNS(SVGNS, 'g');
  const offsetX = block.width/2;
  svgEl.innerHTML = `<rect x=${block.posX - offsetX} y=${block.posY} width=${block.width} height=${block.height} style="${presets.rect}"/>`;

  _generateText(svgEl, block);

  screen.append(svgEl);
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
  if (block.type != 'insert') {
    svgEl.innerHTML += `<text x=${block.posX + textOffsetX} y=${block.posY + textOffsetY} font-family="Verdana" font-size=28 fill="#00A651">${block.content}</text>`;
  } else {
    svgEl.innerHTML += `<text x=${block.posX + textOffsetX - 24} y=${block.posY+24} font-family="Verdana" font-size=28 fill="#00A651">${block.content}</text>`;
  }
}


/**
 * @param {*} screen
 * @param {*} block1
 * @param {*} block2
 */
function generateConnector(screen, block1, block2) {
  const svgEl = document.createElementNS(SVGNS, 'polyline');
  svgEl.setAttribute('style', 'stroke:#00A651;stroke-width:3;fill:none');

  const centerX1 = block1.posX;
  const y1 = block1.posY + block1.height;
  const centerX2 = block2.posX;
  const middleY = y1 - ((y1 - block2.posY) / 2);

  if (block1.posY < block2.posY - block1.height) {
    if (block1.type == 'conditional') {
      const offsetY = block1.height / 2;
      svgEl.setAttribute('points', `${centerX1}, ${y1 - offsetY} ${centerX2}, ${y1 - offsetY} ${centerX2}, ${block2.posY}`);
    } else if (block2.type == 'node') {
      const offsetY = block2.height / 2;
      svgEl.setAttribute('points', `${centerX1}, ${y1} ${centerX1}, ${block2.posY +offsetY} ${centerX2}, ${block2.posY +offsetY}`);
    } else {
      svgEl.setAttribute('points', `${centerX1}, ${y1} ${centerX1}, ${middleY} ${centerX2}, ${middleY} ${centerX2}, ${block2.posY}`);
    }
  } else {
    const middleX = centerX1 - ((centerX1 - centerX2) / 2);
    const y2 = y1 + 50;
    const y3 = block2.posY - 50;
    svgEl.setAttribute('points', `${centerX1}, ${y1} ${centerX1}, ${y2} ${middleX}, ${y2} ${middleX}, ${y3} ${centerX2}, ${y3} ${centerX2}, ${block2.posY}`);
  }
  screen.append(svgEl);
  if (block2.type != 'insert' && block2.type != 'node') generateArrow(screen, centerX2, block2.posY);
}

/**
 * @param {*} screen
 * @param {*} x
 * @param {*} y
 */
function generateArrow(screen, x, y) {
  const arrow = document.createElementNS(SVGNS, 'polyline');
  arrow.setAttribute('style', 'stroke:#00A651;stroke-width:3;fill:none');
  arrow.setAttribute('points', `${x - 10}, ${y - 13} ${x}, ${y - 3} ${x + 10}, ${y - 13}`);
  screen.append(arrow);
}

const presets = {
  // Rect
  'rect': 'fill:#fff;stroke:#00A651;stroke-width:3',
  // Rounded rectangle
  'crect': 'rx:30;ry:30;fill:#fff;stroke:#00A651;stroke-width:3',
  // Circle
  'circle': 'rx:100%;ry:100%;fill:#fff;stroke:#00A651;stroke-width:3',
};
