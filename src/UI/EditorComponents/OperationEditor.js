/** */
export class OperationEditor {
  /**
   * @param {*} variables
   */
  constructor(variables) {
    this.variables = variables;
    this.container = undefined;

    this.assignmentOperators = ['=', '+=', '-=', '*=', '/=', '%='];
    this.operators = ['-', '+', '*', '/', '%', '^'];
    this.init();
  }

  /** */
  init() {
    this.generateUI();
  }

  /** */
  generateUI() {
    this.container = document.createElement('div');
    const variable1 = document.createElement('select');
    const operator1 = document.createElement('select');
    const variable2 = document.createElement('select');
    const operator2 = document.createElement('select');
    const variable3 = document.createElement('select');

    this.populateWithValue(variable1, this.variables);
    this.populateWithValue(operator1, this.assignmentOperators, false, false);
    this.populateWithValue(variable2, this.variables);
    this.populateWithValue(operator2, this.operators, false);
    this.populateWithValue(variable3, this.variables);

    this.container.appendChild(variable1);
    this.container.appendChild(operator1);
    this.container.appendChild(variable2);
    this.container.appendChild(operator2);
    this.container.appendChild(variable3);

    variable1.onchange = (event) => {};
    variable2.onchange = (event) => {};
    variable3.onchange = (event) => {};
  }

  /**
   * @param {*} target
   * @param {*} values
   * @param {*} allowNew
   * @param {*} generateVoid
   */
  populateWithValue(target, values, allowNew=true, generateVoid=true) {
    if (allowNew) {
      values.add('New');
    }
    if (generateVoid) {
      const optionEl = document.createElement('option');
      optionEl.setAttribute('value', 'void');
      optionEl.innerHTML = '';
      target.insertAdjacentHTML('afterBegin', optionEl.outerHTML);
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
}
