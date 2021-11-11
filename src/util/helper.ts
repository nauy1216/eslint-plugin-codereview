import { Types } from '../const/index'

export function removeUnusedCode(fixer, unusedVar,sourceCode) {
    debugger
    let result = removeTypeCode(fixer, unusedVar, sourceCode)
    return result || removeJsCode(fixer, unusedVar, sourceCode)
}

function removeJsCode(fixer, unusedVar, sourceCode) {
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
    // import { A, C  , D } from 'B'
    if (node.type === Types.ImportSpecifier) {
        if (
            node.parent.specifiers.length === 1 && 
            node.parent.specifiers[0] === node
        ) {
            return fixer.replaceText(node.parent, addComment(sourceCode.getText(node.parent)))
        }
        // TODO: 正则有问题
        let code = sourceCode.getText(node.parent).replace(new RegExp(`${sourceCode.getText(node)}[\\s]*,?`), addComment)
        return fixer.replaceText(node.parent, code)
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

function removeTypeCode(fixer, unusedVar, sourceCode) {
    debugger
    // let node = unusedVar.identifiers[0].parent
    // // 1. type A = any
    // if (Types.TSTypeAliasDeclaration === node.type) {
    //     return addAnnotation(fixer, node)
    // }

    // // 2. interface A {} 
    // if (Types.TSInterfaceDeclaration === node.type) {
    //     return addAnnotation(fixer, node)
    // }

    // // 3. enum A {}
    // if (Types.TSEnumDeclaration === node.type) {
    //     return addAnnotation(fixer, node)
    // }

    return undefined
}


/**
 * @description 注释node
 * @param fixer 
 * @param node 
 * @returns 
 */
export function addAnnotation(fixer, node) {
    debugger
    // return fixer.remove(node)
    return [
        fixer.insertTextBefore(node, '/**DEAD_CODE '),
        fixer.insertTextAfter(node, '*/'),
    ]
}


function addComment(code) {
    return `/**__DEAD__ ${code}*/`
}