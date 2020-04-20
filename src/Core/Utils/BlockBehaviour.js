/**
 * @param {*} event
 * @param {*} parent
 * @param {*} element
 */
export function moveBlockHandler(event, parent, element) {
  let lastX = 0;
  let lastY = 0;

  if (event.button == 0) {
    lastX = event.pageX;
    lastY = event.pageY;
    event.stopPropagation();
    window.addEventListener('mousemove', moveBlock);
    event.preventDefault();
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
      element.moveStructure(event.pageX - lastX, event.pageY - lastY);
      parent.render();
      lastX = event.pageX;
      lastY = event.pageY;
    }
  }
}
