import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import * as ts from 'typescript';

ts.setOriginalNode
/**
 * Inspired from https://github.com/ionic-team/stencil/blob/a1ab21bdebdbbfebc31bdf8a6dd8eac5ed560be7/src/compiler/transformers/decorators-to-static/convert-decorators.ts#L87
 */
const visitClassDeclaration = classNode => {
  classNode.modifiers.shift();
  const newNode = ts.factory.createClassDeclaration(classNode.modifiers, classNode.name, classNode.typeParameters, classNode.heritageClauses, classNode.members);
  ts.setOriginalNode(classNode, newNode);
  ts.setTextRange(classNode, newNode);
  return newNode;
};

/**
 * Inspired from https://github.com/ionic-team/stencil/blob/a1ab21bdebdbbfebc31bdf8a6dd8eac5ed560be7/src/compiler/transformers/decorators-to-static/convert-decorators.ts#L43
 */
const removeClassModifiers = transformCtx => {
  const visit = node => {
    if (ts.isClassDeclaration(node)) {
      return visitClassDeclaration(node);
    }
    return ts.visitEachChild(node, visit, transformCtx);
  };
  return tsSourceFile => {
    return ts.visitEachChild(tsSourceFile, visit, transformCtx);
  };
};


const source = readFileSync(join(__dirname, 'fileToCompile.tsx'), { encoding: 'utf-8' });

/**
 * https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API#a-simple-transform-function
 */
let result = ts.transpileModule(source, {
  compilerOptions: JSON.parse(
    '{"allowSyntheticDefaultImports":true,"esModuleInterop":true,"sourceMap":true,"isolatedModules":true,"suppressOutputPathCheck":true,"allowNonTsExtensions":true,"noLib":true,"noResolve":true,"module":1,"target":4}',
  ),
  transformers: {
    before: [removeClassModifiers],
  },
});


writeFileSync(join(__dirname, 'compiled.js'), result.outputText);
