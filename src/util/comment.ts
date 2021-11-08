import { addAnnotation} from './helper'
import {Types} from '../const'

export function addComment(fixer, node) {
    if (Types.Identifier === node.type) {
        if (
            Types.VariableDeclarator === node.parent.type &&
            Types.VariableDeclaration === node.parent.parent.type
        ) {
            return addAnnotation(fixer, node.parent.parent)
        }
    }
}