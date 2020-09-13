/* eslint-disable key-spacing */
import {Token} from './Token';

export const RESERVED_KEY = {
  'START' : new Token('START', 'START'),
  'END'   : new Token('END', 'END'),
  'EOB'   : new Token('EOB', null),
  'IN'    : new Token('IN', 'IN'),
  'OUT'   : new Token('OUT', 'OUT'),
  '^'     : new Token('POW', '^'),
  'int'   : new Token('INTEGER', 'int'),
  'float' : new Token('FLOAT', 'float'),
  'auto'  : new Token('AUTO', 'auto'),
};
