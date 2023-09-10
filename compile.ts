import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import * as ts from 'typescript';

const source = readFileSync(join(__dirname, 'fileToCompile.tsx'), { encoding: 'utf-8' });
const visitClassDeclaration = classNode => {
  classNode.modifiers.shift();
  return ts.factory.updateClassDeclaration(classNode, classNode.modifiers, classNode.name, classNode.typeParameters, classNode.heritageClauses, classNode.members);
};

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

let result = ts.transpileModule(source, {
  compilerOptions: JSON.parse(
    '{"allowSyntheticDefaultImports":true,"esModuleInterop":true,"sourceMap":true,"isolatedModules":true,"suppressOutputPathCheck":true,"allowNonTsExtensions":true,"noLib":true,"noResolve":true,"module":1,"target":4}',
  ),
  transformers: {
    before: [removeClassModifiers],
  },
});

writeFileSync(join(__dirname, 'compiled.js'), result.outputText);
