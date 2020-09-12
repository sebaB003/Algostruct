import {Lexer} from './Lexer';
import {Parser} from './Parser';
/**
 * @param {*} block
 */
export function lex(block, logsView, outputView) {
  const lexer = new Lexer(block, logsView, outputView);
  const parser = new Parser(lexer, logsView, outputView);
  console.log(parser.flowchart());
}
