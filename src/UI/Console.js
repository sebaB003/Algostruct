/**
 * This component allows to use a div element as
 * an output area.
*/
export class Console {
  /**
   * @param {*} element
  */
  constructor(element) {
    this.consoleEl = element;
  }

  /**
    * @param {*} out
    */
  log(out) {
    const p = document.createElement('p');
    const outEl = document.createElement('div');
    p.innerHTML = out.replace('\n', '<br>');
    outEl.appendChild(p);
    outEl.classList.add('cell');
    this.consoleEl.append(outEl);
    p.scrollIntoView();
  }

  /**
   * @param {*} error
   * @param {boolean} attach
   */
  error(error, attach=true) {
    const p = document.createElement('p');
    const lastChild = this.consoleEl.lastChild;
    p.innerHTML = `Error: ${error.replace('\n', '<br>')}`.fontcolor('#ff4800');

    if (lastChild && attach) {
      lastChild.appendChild(p);
    } else {
      this.consoleEl.appendChild(p);
    }
    p.scrollIntoView();
  }

  /**
   * @param {*} out
   */
  out(out) {
    const p = document.createElement('p');
    const lastChild = this.consoleEl.lastChild;

    p.innerHTML = out.replace('\n', '<br>');
    if (lastChild) {
      lastChild.appendChild(p);
    } else {
      this.consoleEl.appendChild(p);
    }
    p.scrollIntoView();
  }

  /** */
  input(message='') {
    const template = document.getElementById('input-entry');
    const inputEntryEl = document.importNode(template.content, true);

    const cellEl = inputEntryEl.querySelector('.cell');
    const labelEl = inputEntryEl.querySelector('label');
    const form = inputEntryEl.querySelector('form');

    let inputValue;
    form.addEventListener('submit', (event)=> {
      event.preventDefault();
      inputValue = event.srcElement[0].value;
      cellEl.textContent = `${message}${inputValue}`;
    });

    labelEl.textContent = message;
    this.consoleEl.appendChild(inputEntryEl);

    return inputValue;
  }

  /**
   * Clears the output area
  */
  clear() {
    this.consoleEl.innerHTML = '';
  }
}
