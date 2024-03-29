export const checkVariable = /(^[A-Za-z_][[A-Za-z0-9_]*$)/;
export const checkDecimal = /(^[0-9]+$)/;
export const checkFloat = /(^[0-9]+\.[0-9]+)f?$/;
export const checkBoolean = /true|false/;
export const checkBinary = /^0b([01]+)$/;
export const checkHex = /^0x([0-9A-Fa-f]+)$/;
export const checkOctal = /^0o([0-7]+)$/;

export const checkString = /(^\".*\"$)|(^\'.*\'$)/;
export const checkNumber = /^(0x[A-Fa-f0-9]+$|0b[01]+$|[0-9]+$|0o([0-7]+)$)/;

export const checkAssignOperators = /(=|\+=|-=|\*=|\/=|%=)/;
export const checkOperators = /(\+|-|\*|\/|%)/;

export const checkDefinitonRegex = /^(int|float|bool|auto)\s([A-Za-z_][[A-Za-z0-9_]*)+(\s*,\s*([A-Za-z_][[A-Za-z0-9_]*))*$/;
export const checkOperationRegex = /^([A-Za-z_][[A-Za-z0-9_]*){1}\s*(=|\+=|-=|\*=|\/=|%=){1}\s*\(*\s*(([A-Za-z_][[A-Za-z0-9_]*)|(\".*\")|(\'.*\')|(0x[A-Fa-f0-9]+$|0b[01]+|(-?\d+(\.\d+)?))){1}\s*\)*(\s*(\+|-|\*|\/|%|\^|<|>|<=|>=|==|\|\||\&\&|!)\s*\(*\s*(([A-Za-z_][[A-Za-z0-9_]*)|(\".*\")|(\'.*\')|(0x[A-Fa-f0-9]+$|0b[01]+|(-?\d+(\.\d+)?)))\s*\)*)*$/;
export const checkStatementRegex = /^(int|float|bool|auto)\s([A-Za-z_][[A-Za-z0-9_]*)+(\s*,\s*([A-Za-z_][[A-Za-z0-9_]*))*$|^([A-Za-z_][[A-Za-z0-9_]*){1}\s*(=|\+=|-=|\*=|\/=|%=){1}\s*[\(\[\{]*\s*(([A-Za-z_][[A-Za-z0-9_]*)|(\".*\")|(\'.*\')|(0x[A-Fa-f0-9]+$|0b[01]+|(-?\d+(\.\d+)?))){1}\s*[\)\]\}]*(\s*(\+|-|\*|\/|%|\^|<|>|<=|>=|==|\|\||\&\&|!)\s*[\(\[\{]*\s*(([A-Za-z_][[A-Za-z0-9_]*)|(\".*\")|(\'.*\')|(0x[A-Fa-f0-9]+$|0b[01]+|(-?\d+(\.\d+)?)))\s*[\)\]\}]*)*$/;
export const checkConditionRegex = /^\(*\s*(([A-Za-z_][[A-Za-z0-9_]*)|(\".*\")|(\'.*\')|(0x[A-Fa-f0-9]+$|0b[01]+|(-?\d+(\.\d+)?))){1}\s*\)*(\s*(\+|-|\*|\/|%|\^|<|>|<=|>=|==|\|\||\&\&|!)\s*\(*\s*(([A-Za-z_][[A-Za-z0-9_]*)|(\".*\")|(\'.*\')|(0x[A-Fa-f0-9]+$|0b[01]+|(-?\d+(\.\d+)?)))\s*\)*)*$/;
export const checkOutputRegex = checkConditionRegex;
export const checkInputRegex = checkVariable;

/*
^([A-Za-z_][[A-Za-z0-9_]*){1}\s*(=|\+=|-=|\*=|\/=|%=){1}\s*[\(\[\{]*\s*(([A-Za-z_][[A-Za-z0-9_]*)|(\".*\")|(\'.*\')|(0x[A-Fa-f0-9]+$|^0b[01]+|(\d+(\.\d+)?))){1}(\s*(\+|-|\*|\/|%)\s*[\)\]\}]*\s*[\(\[\{]*(([A-Za-z_][[A-Za-z0-9_]*)|(\".*\")|(\'.*\')|(0x[A-Fa-f0-9]+$|^0b[01]+|(\d+(\.\d+)?))))*\s*[\)\]\}]*$
*/