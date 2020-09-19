/* eslint-disable key-spacing */
import {Token} from './Token';

export const RESERVED_KEY = {
  'START'   : new Token('START', 'START'),
  'END'     : new Token('END', 'END'),
  'EOB'     : new Token('EOB', null),
  'IN'      : new Token('IN', 'IN'),
  'OUT'     : new Token('OUT', 'OUT'),
  'IF'      : new Token('IF', 'IF'),
  'ELSE'    : new Token('ELSE', 'ELSE'),
  'ENDIF'   : new Token('ENDIF', 'ENDIF'),
  'DO'      : new Token('DO', 'DO'),
  'LOOP'    : new Token('LOOP', 'LOOP'),
  'ENDLOOP' : new Token('ENDLOOP', 'ENDLOOP'),
  'pow'     : new Token('POW', 'pow'),
  'int'     : new Token('INTEGER', 'int'),
  'float'   : new Token('FLOAT', 'float'),
  'bool'    : new Token('BOOL', 'bool'),
  'auto'    : new Token('AUTO', 'auto'),
  'true'    : new Token('TRUE_CONST', true),
  'false'   : new Token('FALSE_CONST', false),
};
