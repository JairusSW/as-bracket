import { Transform } from "assemblyscript/dist/transform.js";
import { BaseVisitor, SimpleParser } from "visitor-as/dist/index.js";
import { getName, toString } from "visitor-as/dist/utils.js";
console.log("Initializing AS-Bracket Transform");
class ClassData {
    constructor() {
        this.keys = [];
        this.types = [];
        this.name = "";
    }
}
/**
 * This transform implements bracket notation for AssemblyScript Classes.
 * The two core function that are added handle
 * 1. The fetching of data within the class
 * 2. The setting of data within the class
 *
 * With both these functions, we need to correct typing as we can only return a Variant and take a Variant as a parameter.
 * When the user has a line of code like this, for example
 * const vec: Vec2 = {
 *  x: 1.0,
 *  y: -3.1
 * }
 *
 * console.log("x: " + vec["x"].toString())
 *
 * We need to change it to this
 * const vec: Vec2 = {
 *  x: 1.0,
 *  y: -3.1
 * }
 *
 * console.log("x: " + vec["x"].get<f32>.toString())
 *
 * And the same with setting data, we need to wrap the right hand side in Variant.from() and save the type.
 *
 * vec["x"] = 5.4
 *
 * to
 *
 * vec["x"] = Variant.from<f32>(5.4)
 *
 * Currently, the transform adds this ability to ALL CLASSES, but eventually,
 * it should be narrowed down to only classes that utilize bracket notation to save binary size
 *
 * This project is still a WIP
 */
class AsBracketTransform extends BaseVisitor {
    constructor() {
        super(...arguments);
        this.classIndex = -1;
        this.classList = [];
        this.sources = [];
        this.currentClass = new ClassData();
        this.getStatements = `
    @operator("[]")
    __get(key: string): __Variant {
        `;
    }
    //private globalStatements: Statement[] = []
    visitFieldDeclaration(node) {
        super.visitFieldDeclaration(node);
        const name = getName(node);
        if (!node.type) {
            console.warn(`Field ${name} in class ${getName(this.currentClass.currentClass)} was not provided with a valid type`);
        }
        // Set property name inside of ClassList
        this.currentClass.keys.push(name);
        // Set property type inside of ClassList
        this.currentClass.types.push(getName(node.type));
        this.getStatements += `if (key == "${name}") return __Variant.from<${this.currentClass.types[this.currentClass.keys.indexOf(name)]}>(this.${name});
        else `;
    }
    visitClassDeclaration(node) {
        super.visitClassDeclaration(node);
        if (!node.members) {
            return;
        }
        this.getStatements += `throw new Error("Cannot provide value to invalid property \\"" + key + "\\"")
    }`;
        console.log("Added operator handler to class " + getName(node) + this.getStatements);
        const encodeMember = SimpleParser.parseClassMember(this.getStatements, node);
        node.members.push(encodeMember);
        //super.visitClassDeclaration(node);
        this.classIndex++;
        this.classList.push(new ClassData());
        this.currentClass = this.classList[this.classIndex];
        this.currentClass.currentClass = node;
        this.currentClass.name = getName(node);
        this.visit(node.members);
    }
    visitElementAccessExpression(node) {
        // should replace vec["x"] with vec["x"].get<type>()
        console.log("Element Access: " + toString(node));
    }
    visitSource(node) {
        super.visitSource(node);
        //const importStatement = SimpleParser.parseStatement("import * as __Variant from \"as-variant/assembly\"") as ImportStatement;
        //node.statements.unshift(importStatement);
    }
}
// Transform class
export default class BracketTransform extends Transform {
    // Trigger the transform after parse.
    afterParse(parser) {
        // Create new transform
        const transformer = new AsBracketTransform();
        // Loop over every source
        for (const source of parser.sources) {
            // Ignore all lib (std lib). Visit everything else.
            if (!source.isLibrary && !source.internalPath.startsWith(`~lib/`)) {
                transformer.visit(source);
            }
        }
    }
}
;
