/**
 * @param {*} event
 * @param {*} parent
 * @param {*} element
 * @param {*} zoom
 */
export function moveBlockHandler(event, parent, element, screenData) {
  let lastX = 0;
  let lastY = 0;

  if (event.button == 0) {
    lastX = event.pageX;
    lastY = event.pageY;
    event.stopPropagation();
    console.log(parent);
    if (parent.project.preferences.singleMove) {
      window.addEventListener('mousemove', moveBlock);
    } else {
      window.addEventListener('mousemove', moveTopDownBlock);
    }
    event.preventDefault();
  }

  /**
   *
   * @param {*} event
   */
  function moveTopDownBlock(event) {
    // window.style.cursor = 'grabbing';
    if (event.buttons == 0) {
      // window.style.cursor = 'default';
      window.removeEventListener('mousemove', moveTopDownBlock);
    } else {
      if (element.type == 'comment') {
        element.offsetX += applyZoomVariation(zoom, event.pageX - lastX);
        element.offsetY += applyZoomVariation(zoom, event.pageY - lastY);
      } else {
        const newX = applyZoomVariation(screenData, event.pageX - lastX);
        const newY = applyZoomVariation(screenData, event.pageY - lastY);
        element.moveStructure(newX, newY);
      }
      parent.render();
      lastX = event.pageX;
      lastY = event.pageY;
    }
  }

  /**
   *
   * @param {*} event
   */
  function moveBlock(event) {
    // window.style.cursor = 'grabbing';
    if (event.buttons == 0) {
      // window.style.cursor = 'default';
      window.removeEventListener('mousemove', moveBlock);
    } else {
      if (element.type == 'comment') {
        element.offsetX += applyZoomVariation(zoom, event.pageX - lastX);
        element.offsetY += applyZoomVariation(zoom, event.pageY - lastY);
      } else {
        const newX = applyZoomVariation(screenData, event.pageX - lastX);
        const newY = applyZoomVariation(screenData, event.pageY - lastY);
        element.posX += newX;
        element.posY += newY;
      }
      parent.render();
      lastX = event.pageX;
      lastY = event.pageY;
    }
  }
}


/**
 * Attach the mousemove handler
 * @param {Event} event
 * @param {screen} screen
 */
export function moveBuilderView(event, screen) {
  let lastX = 0;
  let lastY = 0;
  if (event.button == 0) {
    lastX = event.clientX;
    lastY = event.clientY;
    screen.SVGScreenEl.addEventListener('mousemove', moveView);
    event.preventDefault();
  }
  /**
   * Calculate the x and y change in the axis
   * and apply it to the view
   * @param {Event} event
   */
  function moveView(event) {
    screen.SVGScreenEl.style.cursor = 'grabbing';
    if (event.buttons == 0) {
      screen.SVGScreenEl.style.cursor = 'default';
      screen.SVGScreenEl.removeEventListener('mousemove', moveView);
    } else {
      const panX = applyZoomVariation(screen.screenData,
          lastX - event.clientX);
      const panY = applyZoomVariation(screen.screenData,
          lastY - event.clientY);
      screen.applyPan(panX, panY);
      lastX = event.clientX;
      lastY = event.clientY;
    }
  }
}

/**
 * Calculate the appropriate coordinate change
 * on the base of the scrren zoom
 * @param {*} screenData
 * @param {*} value
 * @return {float} value
 */
function applyZoomVariation(screenData, value) {
  return (value * (screenData.zoom / screenData.width));
}
