/** */
export class ModalManager {
  /** */
  constructor() {
    this.modal = undefined;
    this.closeModalFunction = this.closeModal.bind(this);
    this.isModalOpen = false;

    this.init();
  }

  /** */
  init() {
    this.modal = document.createElement('div');
    this.modal.classList.add('modal');
  }

  /**
   * @param {*} content
   */
  async showModal(content) {
    if (this.isModalOpen) {
      this.closeModalFunction();
    }
    this.modal.innerHTML = '';
    this.isModalOpen = true;
    if (content) {
      this.modal.appendChild(content);
    }
    document.body.appendChild(this.modal);

    await this.setupEventListener();
  }

  /**
   * @return {Promise} eventHandler
   */
  setupEventListener() {
    const eventHandler = new Promise(
        (resolve) => {
          setTimeout(
              this.modal.addEventListener('click', this.closeModalFunction),
              200,
          );
        },
    );

    return eventHandler;
  }

  /**
   * Close the modal
   * @param {Event} event
  */
  closeModal(event) {
    if (event.target == this.modal) {
      this._forceClose();
    }
  }

  /**
   * Returns the modal element
   * @return {*} modal
   */
  getModal() {
    return this.modal;
  }

  /** */
  _forceClose() {
    this.isModalOpen = false;
    this.modal.remove();
    this.modal.removeEventListener('click', this.closeModalFunction);
  }
}
