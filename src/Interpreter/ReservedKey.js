/* eslint-disable key-spacing */
import {Token} from './Token';

export const RESERVED_KEY = {
  'START' : new Token('START', 'START'),
  'END'   : new Token('END', 'END'),
  'EOB'   : new Token('EOB', null),
  'var'   : new Token('VAR', 'var'),
  'in'    : new Token('IN', 'in'),
  'out'   : new Token('OUT', 'out'),
  'int'   : new Token('INTEGER', 'int'),
  'float' : new Token('FLOAT', 'float'),
  'auto'  : new Token('AUTO', 'auto'),
};
