import {ModalManager} from './ModalManager';

/** */
export class AssignEditor {
  /**
   * @param {*} components
   * @param {*} variables
   * @param {*} modalManager
   */
  constructor(components, variables, modalManager, renderCallback) {
    this.variables = variables;
    this.container = document.createElement('div');

    [this.variable1='', this.operator='=', this.variable2=''] = components;

    this.operators = ['=', '+=', '-=', '*=', '/=', '%='];
    this.init();

    if (modalManager) {
      this.modalManager = modalManager;
    } else {
      this.modalManager = new ModalManager();
    }

    this.renderCallback = renderCallback;
  }

  /** */
  init() {
    this.generateUI();
  }

  /** */
  generateUI() {
    this.container.innerHTML = '';
    const variable1 = document.createElement('button');
    const operator = document.createElement('select');
    const variable2 = document.createElement('button');

    variable1.classList.add('btn', 'round-left', 'variable-selector', 'static');
    variable2.classList.add('btn', 'round-right', 'variable-selector', 'static');
    variable1.textContent = this.variable1;
    variable2.textContent = this.variable2;

    this.populateWithValue(operator, this.operators, false, false);

    operator.value = this.operator;
    this.setSelectorEventHandler(operator, 'operator');

    this.container.appendChild(variable1);
    this.container.appendChild(operator);
    this.container.appendChild(variable2);

    this.setModal(variable1, 'variable1');
    this.setModal(variable2, 'variable2');
  }

  /**
   * @param {*} target
   * @param {*} values
   * @param {*} allowNew
   * @param {*} generateVoid
   */
  populateWithValue(target, values, allowNew=true, generateVoid=true) {
    if (generateVoid) {
      values.add(' ');
    }
    if (allowNew) {
      values.add('New');
    }
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

    variableName.onkeypress = (event) => this.generateAutocomplete();
  }

  /** */
  generateAutocomplete() {
    console.log(this);
  }
}
