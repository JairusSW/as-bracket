import { Parser } from "assemblyscript/dist/assemblyscript";
import { Transform } from "assemblyscript/dist/transform.js";
export default class BracketTransform extends Transform {
    afterParse(parser: Parser): void;
}
