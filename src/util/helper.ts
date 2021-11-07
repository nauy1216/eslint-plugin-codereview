export function disableCode(fixer, unusedVar) {
    debugger
    let node = unusedVar.identifiers[0].parent
    if ('FunctionDeclaration' === node.type) {

    } else if ('ImportSpecifier' === node.type) {

    } else {
        node = node.parent
    }
    return addAnnotation(fixer, node)
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