import {ModalManager} from './ModalManager';

/** */
export class AssignEditor {
  /**
   * @param {*} components
   * @param {*} variables
   * @param {*} modalManager
   * @param {*} renderCallback
   * @param {*} removeCallback
   */
  constructor(components, variables, modalManager, renderCallback, removeCallback) {
    this.containerEl = document.createElement('div');
    this.containerEl.classList.add('operation-container');
    this.deleteBtn = document.createElement('button');

    // Variables for the autocomplete interface
    this.variables = variables;

    // Setup loaded content
    [this.variable1='', this.operator='=', this.variable2=''] = components;

    // Define the oprtators allowed
    this.operators = ['=', '+=', '-=', '*=', '/=', '%='];

    // Init modal manager
    if (modalManager) {
      this.modalManager = modalManager;
    } else {
      this.modalManager = new ModalManager();
    }

    // Set callbacks
    this.renderCallback = renderCallback;
    this.removeCallback = removeCallback;

    this.init();
  }

  /**
   * Render UI and setup remove button
  */
  init() {
    this.generateUI();
    this.setupRemoveButton();
  }

  /**
   * Generates the widget
  */
  generateUI() {
    this.containerEl.innerHTML = '';
    const variable1 = document.createElement('button');
    const operator = document.createElement('select');
    const variable2 = document.createElement('button');

    // Define the new elements classes
    variable1.classList.add('btn', 'round-left', 'variable-selector', 'static');
    variable2.classList.add('btn', 'round-right', 'variable-selector', 'static');

    // Set an inital content
    variable1.textContent = this.variable1;
    variable2.textContent = this.variable2;

    this.populateWithValue(operator, this.operators);

    operator.value = this.operator;
    this.setSelectorEventHandler(operator, 'operator');

    this.containerEl.appendChild(variable1);
    this.containerEl.appendChild(operator);
    this.containerEl.appendChild(variable2);
    this.containerEl.appendChild(this.deleteBtn);

    this.setModal(variable1, 'variable1');
    this.setModal(variable2, 'variable2');
  }

  /**
   * Populates a select element
   * @param {*} target the select element
   * @param {*} values the valuse to populet the select elemnt with
   */
  populateWithValue(target, values) {
    for (const value of values) {
      if (value) {
        const optionEl = document.createElement('option');
        optionEl.setAttribute('value', value);
        optionEl.innerHTML = value;
        target.appendChild(optionEl);
      }
    }
  }

  /** */
  setSelectorEventHandler(selector, target) {
    const modal = this;
    selector.onchange = () => {
      modal[target] = selector.value;
      modal.renderCallback();
    };
  }

  /** */
  setModal(elemet, target) {
    elemet.onclick = (event) => {
      this.modalManager.showModal(this._addVariableModal(target));
    };
  }

  /** */
  _addVariableModal(target) {
    const modalTemplate = document.querySelector('#createVariableModal');
    const modalContent = document.importNode(modalTemplate.content, true);

    this._attachCreateVariableFunction(modalContent, target);
    this.setupAutocomplete(modalContent);

    return modalContent;
  }

  /**
   * @param {*} modalContent
  */
  _attachCreateVariableFunction(modalContent, target) {
    const variableName = modalContent.querySelector('input');
    variableName.value = this[target];
    const confirmButton = modalContent.querySelector('button');
    const errorMessage = modalContent.querySelector('.error');
    const modal = this;

    confirmButton.addEventListener('click', _crateVaraiable);

    /** */
    function _crateVaraiable() {
      if (target == 'variable1') {
        if (/^[A-Za-z_][[A-Za-z0-9_]*/.test(variableName.value.trim())) {
          if (!modal.variables.has(variableName.value.trim()) && modal.operator == '=') {
            modal.variables.add(variableName.value.trim());
            modal[target] = variableName.value;
            modal.renderCallback();
            modal.modalManager._forceClose();
            modal.generateUI();
          } else if (modal.variables.has(variableName.value.trim())) {
            modal[target] = variableName.value;
            modal.renderCallback();
            modal.modalManager._forceClose();
            modal.generateUI();
          } else {
            errorMessage.textContent = 'You must define it first';
          }
        } else {
          errorMessage.textContent = 'Invalid variable name';
        }
      } else {
        if (/^(([A-Za-z_][[A-Za-z0-9_]*)|(\".*\")|(\'.*\')|([0-9]+))/.test(variableName.value.trim())) {
          if (/^([A-Za-z_][[A-Za-z0-9_]*)/.test(variableName.value.trim())) {
            if (modal.variables.has(variableName.value.trim())) {
              modal.variables.add(variableName.value.trim());
              modal[target] = variableName.value;
              modal.renderCallback();
              modal.modalManager._forceClose();
              modal.generateUI();
            } else {
              errorMessage.textContent = 'You must define it first';
            }
          } else {
            modal[target] = variableName.value;
            modal.renderCallback();
            modal.modalManager._forceClose();
            modal.generateUI();
          }
        } else {
          errorMessage.textContent = 'Invalid value';
        }
      }
    };
  }

  /**
   * @param {*} modalContent
   */
  setupAutocomplete(modalContent) {
    const variableName = modalContent.querySelector('input');
    const hintsContainer = modalContent.querySelector('.autocomplete-box-hints');
    hintsContainer.style.display = 'none';
    variableName.onkeypress = async (event) => await this.generateAutocomplete(event, variableName.value, hintsContainer);
  }

  /** */
  generateAutocomplete(event, value, container) {
    return new Promise(
        (resolve) => {
          container.innerHTML = '';
          let isHintFound = false;
          if (/^([A-Za-z_][[A-Za-z0-9_]*)/.test(value)) {
            for (const variable of this.variables) {
              console.log(variable);
              if (variable.search(value) != -1) {
                const hintButton = document.createElement('button');
                hintButton.textContent = variable;
                hintButton.onclick = (event) => {
                  container.previousElementSibling.value = event.target.textContent;
                  container.style.display = 'none';
                };
                container.appendChild(hintButton);
                isHintFound = true;
              }
            }
          }

          if (isHintFound) {
            container.style.display = 'block';
          }
        },
    );
  }

  /** */
  setupRemoveButton() {
    this.deleteBtn.classList.add('delete-operation');
    this.deleteBtn.innerHTML = 'X';

    this.deleteBtn.addEventListener('click', (event) => {
      event.target.parentElement.remove();
      this.removeCallback(this);
    });
  }
}
