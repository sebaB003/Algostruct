import {Lexer} from './Lexer';
import {Parser} from './Parser';
/**
 * @param {*} block
 */
export function lex(block) {
  const lexer = new Lexer(block);
  const parser = new Parser(lexer);
  console.log(parser.flowchart());
}
