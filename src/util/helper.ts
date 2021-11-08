import { Types } from '../const/index'
export function disableCode(fixer, unusedVar) {
    debugger
    if (unusedVar.isTypeVariable) {
        return disableTypeCode(fixer, unusedVar)
    }
    return disableJsCode(fixer, unusedVar)
}

function disableJsCode(fixer, unusedVar) {
    debugger
    let node
    // 1. 未使用的函数参数 
    // function test(a) {}
    if (unusedVar?.defs?.[0]?.type === Types.Parameter) {
        return addAnnotation(fixer, unusedVar.identifiers[0]);
    }

    node = unusedVar.identifiers[0].parent
    // 2. 未使用的函数声明 
    // 声明了function test() {}， 但是未调用test
    if (node.type === Types.FunctionDeclaration) {
        return addAnnotation(fixer, node)
    } 
    
    // 3. 未使用的import的解构
    // import { A } from 'B'
    // A未使用
    if (node.type === Types.ImportSpecifier) {
        return addAnnotation(fixer, node)
    } 

    // 4. 未使用的变量声明
    // let a = 1
    if (node.type === Types.VariableDeclarator) {
        node = node.parent
        return addAnnotation(fixer, node)
    }

    // 5. ClassNameDefinition
    if (Types.ClassNameDefinition === node.type) {

    }
    
    return undefined
}

function disableTypeCode(fixer, unusedVar) {
    debugger
    let node = unusedVar.identifiers[0].parent
    // 1. type A = any
    if (Types.TSTypeAliasDeclaration === node.type) {
        return addAnnotation(fixer, node)
    }

    // 2. interface A {} 
    if (Types.TSInterfaceDeclaration === node.type) {
        return addAnnotation(fixer, node)
    }

    // 3. enum A {}
    if (Types.TSEnumDeclaration === node.type) {
        return addAnnotation(fixer, node)
    }
}


/**
 * @description 注释node
 * @param fixer 
 * @param node 
 * @returns 
 */
export function addAnnotation(fixer, node) {
    return [
        fixer.insertTextBefore(node, '/**DEAD_CODE '),
        fixer.insertTextAfter(node, '*/'),
    ]
}


export function addExportNamedDeclarationAnnotation(fixer, node) {
    return [
        fixer.insertTextBefore(node, '/**DEAD_CODE '),
        fixer.insertTextAfter(node, '*/'),
    ]
}