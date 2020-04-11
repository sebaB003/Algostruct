// Namespace to generate SVG
const SVGNS = 'http://www.w3.org/2000/svg';

/**
 * @param {*} screen
 * @param {*} block
 * @return {*} svgEl
 */
export function generateCRect(screen, block) {
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
  const svgEl = document.createElementNS(SVGNS, 'g');
  const offsetX = block.width/2;
  svgEl.innerHTML = `<rect x=${block.posX - offsetX} y=${block.posY} width=${block.width} height=${block.height} style="${presets.circle}"/>`;

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

const presets = {
  // Rect
  'rect': 'fill:#fff;stroke:#00A651;stroke-width:3',
  // Rounded rectangle
  'crect': 'rx:30;ry:30;fill:#fff;stroke:#00A651;stroke-width:3',
  // Circle
  'circle': 'rx:100%;ry:100%;fill:#fff;stroke:#00A651;stroke-width:3',
};
