const DEFAULT_KEYS = ['flowchart', 'preferences', 'title'];

/**
 *
 * @param {*} content
 */
export function downloadJSON(content, title) {
  const linkEl = document.createElement('a');
  const url = URL.createObjectURL(
      new Blob(
          [content],
          {type: 'application/json'}));

  linkEl.href = url;
  linkEl.download = `${title}.algostruct.json`;
  linkEl.click();
}

/** */
export function readFile(file) {
  return new Promise((resolve, reject) => {
    const read = new FileReader();

    read.readAsBinaryString(file);

    read.onloadend = function() {
      resolve(read.result);
    };

    read.onerror = function() {
      reject(new Error('An error occured!'));
    };
  });
}

/** */
export function getFileExtension(file) {
  const fileName = file.name.toString();
  const fileNameParts = fileName.split('.');
  return fileNameParts[fileNameParts.length - 1];
}

/** */
export function stringToObject(string) {
  return JSON.parse(string);
}

/** */
export function checkFile(fileContent) {
  const fileKeys = Object.keys(fileContent).sort();
  return JSON.stringify(fileKeys) === JSON.stringify(DEFAULT_KEYS);
}
