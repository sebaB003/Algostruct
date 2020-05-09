export const checkVariable = /(^[A-Za-z_][[A-Za-z0-9_]*$)/;
export const checkDecimal = /([0-9]+)/;
export const checkFloat = /([0-9]+\.[0-9]+)f?/;
export const checkBoolean = /true|false/;
export const checkBinary = /0b([01]+)/;
export const checkHex = /0x([0-9A-Fa-f]+)/;
export const checkOctal = /0o([0-7]+)/;

export const checkString = /(^\".*\"$)|(^\'.*\'$)/;
export const checkNumber = /(^0x[A-Fa-f0=9]+$|^0b[01]+$|^[0-9]+$|^[0-9]+\.{1}[0-9]+f?$)/;

export const checkAssignOperators = /(=|\+=|-=|\*=|\/=|%=)/;
export const checkOperators = /(\+|-|\*|\/|%)/;

export const checkAssignRegex = /^([A-Za-z_][[A-Za-z0-9_]*){0,1}?\s*(=|\+=|-=|\*=|\/=|%=){1}?\s*(([A-Za-z_][[A-Za-z0-9_]*)|(\".*\")|(\'.*\')|([0-9]+)){0,1}$/;
export const checkOperationRegex = /^([A-Za-z_][[A-Za-z0-9_]*){0,1}?\s*(=|\+=|-=|\*=|\/=|%=){1}?\s*(([A-Za-z_][[A-Za-z0-9_]*)|(\".*\")|(\'.*\')|([0-9]+)){0,1}\s*(\+|-|\*|\/|%){1}?\s*(([A-Za-z_][[A-Za-z0-9_]*)|(\".*\")|(\'.*\')|([0-9]+)){0,1}$/;


/** */
function stringifyReg(reg) {
  return reg.toString().slice(1, -1);
}
