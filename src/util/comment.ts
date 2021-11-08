import { addAnnotation} from './helper'
import {Types} from '../const'

export function addComment(fixer, node) {
    if (Types.Identifier === node.type) {
        // 1. var a = 1
        if (
            Types.VariableDeclarator === node.parent.type &&
            Types.VariableDeclaration === node.parent.parent.type
        ) {
            // 排除 export var a = 1
            if (!node.parent.parent.parent || Types.ExportNamedDeclaration !== node.parent.parent.parent.type) {
                return addAnnotation(fixer, node.parent.parent)
            }
        }

        // 2. function c() {}
        if (Types.FunctionDeclaration === node.parent.type) {
            // 排除 export function c() {}
            if (!node.parent.parent || Types.ExportNamedDeclaration !== node.parent.parent.type) {
                return addAnnotation(fixer, node.parent)
            }
        }
    }
}