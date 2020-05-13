/** */
export class WatchesView {
  /**
   *
   */
  constructor() {
    this.watchesEl = document.getElementById('watches');
    this.watchesListEl = this.watchesEl.querySelector('.watches-list');

    this.init();
  }

  /** */
  init() {
    this.showWatches([]);
  }

  /**
   *
   */
  setupEventHandlers() {

  }

  /**
   * @param {*} variables
  */
  showWatches(variables) {
    this.watchesListEl.innerHTML = '';

    if (variables.length) {
      for (const variable of variables) {
        if (variable) {
          this.generateTableRow(variable);
        }
      }
    } else {
      this.watchesListEl.innerHTML = '<tr><td>Void memory</td></tr>';
    }
  }

  /**
   * @param {*} variable
  */
  generateTableRow(variable) {
    const row = document.createElement('tr');

    console.log(variable);

    const {variableName, variableType='Unknown', variableUsage='Unknown', variableValue=undefined} = variable;
    row.innerHTML = `
    <td>${variableName}</td>
    <td>${variableType}</td>
    <td>${variableUsage}</td>
    <td>${variableValue}</td>`;

    this.watchesListEl.appendChild(row);
  }
}
