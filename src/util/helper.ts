export function disableCode(fixer, unusedVar) {
    let node = unusedVar.identifiers[0].parent
    if ('FunctionDeclaration' === node.type) {

    } else if ('ImportSpecifier' === node.type) {

    } else {
        node = node.parent
    }
    return [
        fixer.insertTextBefore(node, '/**DEAD_CODE '),
        fixer.insertTextAfter(node, '*/'),
      ]
}