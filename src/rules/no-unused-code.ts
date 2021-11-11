/**
 * @fileoverview Rule to flag declared but unused variables
 * @author Ilya Volodin
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

import astUtils from '../../node_modules/eslint/lib/rules/utils/ast-utils'
import { removeUnusedCode } from '../util/helper'
//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

export default {
    meta: {
        type: "problem",

        docs: {
            description: "disallow unused variables",
            category: "Variables",
            recommended: true,
            url: "https://eslint.org/docs/rules/no-unused-vars"
        },
        fixable: 'code',
        schema: [
            {
                oneOf: [
                    {
                        enum: ["all", "local"]
                    },
                    {
                        type: "object",
                        properties: {
                            vars: {
                                enum: ["all", "local"]
                            },
                            varsIgnorePattern: {
                                type: "string"
                            },
                            args: {
                                enum: ["all", "after-used", "none"]
                            },
                            ignoreRestSiblings: {
                                type: "boolean"
                            },
                            argsIgnorePattern: {
                                type: "string"
                            },
                            caughtErrors: {
                                enum: ["all", "none"]
                            },
                            caughtErrorsIgnorePattern: {
                                type: "string"
                            }
                        }
                    }
                ]
            }
        ]
    },

    create(context) {
        debugger
        console.log('【context.getFilename()】', context.getFilename())
        const sourceCode = context.getSourceCode();

        const REST_PROPERTY_TYPE = /^(?:RestElement|(?:Experimental)?RestProperty)$/u;

        const config = {
            vars: "all",
            args: "after-used",
            ignoreRestSiblings: false,
            caughtErrors: "none"
        };

        const firstOption = context.options[0];

        if (firstOption) {
            if (typeof firstOption === "string") {
                config.vars = firstOption;
            } else {
                config.vars = firstOption.vars || config.vars;
                config.args = firstOption.args || config.args;
                config.ignoreRestSiblings = firstOption.ignoreRestSiblings || config.ignoreRestSiblings;
                config.caughtErrors = firstOption.caughtErrors || config.caughtErrors;

                if (firstOption.varsIgnorePattern) {
                    config.varsIgnorePattern = new RegExp(firstOption.varsIgnorePattern, "u");
                }

                if (firstOption.argsIgnorePattern) {
                    config.argsIgnorePattern = new RegExp(firstOption.argsIgnorePattern, "u");
                }

                if (firstOption.caughtErrorsIgnorePattern) {
                    config.caughtErrorsIgnorePattern = new RegExp(firstOption.caughtErrorsIgnorePattern, "u");
                }
            }
        }

        /**
         * Generate the warning message about the variable being
         * defined and unused, including the ignore pattern if configured.
         * @param {Variable} unusedVar eslint-scope variable object.
         * @returns {string} The warning message to be used with this unused variable.
         */
        function getDefinedMessage(unusedVar) {
            const defType = unusedVar.defs && unusedVar.defs[0] && unusedVar.defs[0].type;
            let type;
            let pattern;

            if (defType === "CatchClause" && config.caughtErrorsIgnorePattern) {
                type = "args";
                pattern = config.caughtErrorsIgnorePattern.toString();
            } else if (defType === "Parameter" && config.argsIgnorePattern) {
                type = "args";
                pattern = config.argsIgnorePattern.toString();
            } else if (defType !== "Parameter" && config.varsIgnorePattern) {
                type = "vars";
                pattern = config.varsIgnorePattern.toString();
            }

            const additional = type ? ` Allowed unused ${type} must match ${pattern}.` : "";

            return `'{{name}}' is defined but never used.${additional}`;
        }

        /**
         * Generate the warning message about the variable being
         * assigned and unused, including the ignore pattern if configured.
         * @returns {string} The warning message to be used with this unused variable.
         */
        function getAssignedMessage() {
            const additional = config.varsIgnorePattern ? ` Allowed unused vars must match ${config.varsIgnorePattern.toString()}.` : "";

            return `'{{name}}' is assigned a value but never used.${additional}`;
        }

        //--------------------------------------------------------------------------
        // Helpers
        //--------------------------------------------------------------------------

        const STATEMENT_TYPE = /(?:Statement|Declaration)$/u;

        /**
         * Determines if a given variable is being exported from a module.
         * @param {Variable} variable eslint-scope variable object.
         * @returns {boolean} True if the variable is exported, false if not.
         * @private
         */
        function isExported(variable) {

            const definition = variable.defs[0];

            if (definition) {

                let node = definition.node;

                if (node.type === "VariableDeclarator") {
                    node = node.parent;
                } else if (definition.type === "Parameter") {
                    return false;
                }

                return node.parent.type.indexOf("Export") === 0;
            }
            return false;

        }

        /**
         * Determines if a variable has a sibling rest property
         * @param {Variable} variable eslint-scope variable object.
         * @returns {boolean} True if the variable is exported, false if not.
         * @private
         */
        function hasRestSpreadSibling(variable) {
            if (config.ignoreRestSiblings) {
                return variable.defs.some(def => {
                    const propertyNode = def.name.parent;
                    const patternNode = propertyNode.parent;

                    return (
                        propertyNode.type === "Property" &&
                        patternNode.type === "ObjectPattern" &&
                        REST_PROPERTY_TYPE.test(patternNode.properties[patternNode.properties.length - 1].type)
                    );
                });
            }

            return false;
        }

        /**
         * Determines if a reference is a read operation.
         * @param {Reference} ref An eslint-scope Reference
         * @returns {boolean} whether the given reference represents a read operation
         * @private
         */
        function isReadRef(ref) {
            return ref.isRead();
        }

        /**
         * Determine if an identifier is referencing an enclosing function name.
         * @param {Reference} ref The reference to check.
         * @param {ASTNode[]} nodes The candidate function nodes.
         * @returns {boolean} True if it's a self-reference, false if not.
         * @private
         */
        function isSelfReference(ref, nodes) {
            let scope = ref.from;

            while (scope) {
                if (nodes.indexOf(scope.block) >= 0) {
                    return true;
                }

                scope = scope.upper;
            }

            return false;
        }

        /**
         * Gets a list of function definitions for a specified variable.
         * @param {Variable} variable eslint-scope variable object.
         * @returns {ASTNode[]} Function nodes.
         * @private
         */
        function getFunctionDefinitions(variable) {
            const functionDefinitions = [];

            variable.defs.forEach(def => {
                const { type, node } = def;

                // FunctionDeclarations
                if (type === "FunctionName") {
                    functionDefinitions.push(node);
                }

                // FunctionExpressions
                if (type === "Variable" && node.init &&
                    (node.init.type === "FunctionExpression" || node.init.type === "ArrowFunctionExpression")) {
                    functionDefinitions.push(node.init);
                }
            });
            return functionDefinitions;
        }

        /**
         * Checks the position of given nodes.
         * @param {ASTNode} inner A node which is expected as inside.
         * @param {ASTNode} outer A node which is expected as outside.
         * @returns {boolean} `true` if the `inner` node exists in the `outer` node.
         * @private
         */
        function isInside(inner, outer) {
            return (
                inner.range[0] >= outer.range[0] &&
                inner.range[1] <= outer.range[1]
            );
        }

        /**
         * If a given reference is left-hand side of an assignment, this gets
         * the right-hand side node of the assignment.
         *
         * In the following cases, this returns null.
         *
         * - The reference is not the LHS of an assignment expression.
         * - The reference is inside of a loop.
         * - The reference is inside of a function scope which is different from
         *   the declaration.
         * @param {eslint-scope.Reference} ref A reference to check.
         * @param {ASTNode} prevRhsNode The previous RHS node.
         * @returns {ASTNode|null} The RHS node or null.
         * @private
         */
        function getRhsNode(ref, prevRhsNode) {
            const id = ref.identifier;
            const parent = id.parent;
            const granpa = parent.parent;
            const refScope = ref.from.variableScope;
            const varScope = ref.resolved.scope.variableScope;
            const canBeUsedLater = refScope !== varScope || astUtils.isInLoop(id);

            /*
             * Inherits the previous node if this reference is in the node.
             * This is for `a = a + a`-like code.
             */
            if (prevRhsNode && isInside(id, prevRhsNode)) {
                return prevRhsNode;
            }

            if (parent.type === "AssignmentExpression" &&
                granpa.type === "ExpressionStatement" &&
                id === parent.left &&
                !canBeUsedLater
            ) {
                return parent.right;
            }
            return null;
        }

        /**
         * Checks whether a given function node is stored to somewhere or not.
         * If the function node is stored, the function can be used later.
         * @param {ASTNode} funcNode A function node to check.
         * @param {ASTNode} rhsNode The RHS node of the previous assignment.
         * @returns {boolean} `true` if under the following conditions:
         *      - the funcNode is assigned to a variable.
         *      - the funcNode is bound as an argument of a function call.
         *      - the function is bound to a property and the object satisfies above conditions.
         * @private
         */
        function isStorableFunction(funcNode, rhsNode) {
            let node = funcNode;
            let parent = funcNode.parent;

            while (parent && isInside(parent, rhsNode)) {
                switch (parent.type) {
                    case "SequenceExpression":
                        if (parent.expressions[parent.expressions.length - 1] !== node) {
                            return false;
                        }
                        break;

                    case "CallExpression":
                    case "NewExpression":
                        return parent.callee !== node;

                    case "AssignmentExpression":
                    case "TaggedTemplateExpression":
                    case "YieldExpression":
                        return true;

                    default:
                        if (STATEMENT_TYPE.test(parent.type)) {

                            /*
                             * If it encountered statements, this is a complex pattern.
                             * Since analyzeing complex patterns is hard, this returns `true` to avoid false positive.
                             */
                            return true;
                        }
                }

                node = parent;
                parent = parent.parent;
            }

            return false;
        }

        /**
         * Checks whether a given Identifier node exists inside of a function node which can be used later.
         *
         * "can be used later" means:
         * - the function is assigned to a variable.
         * - the function is bound to a property and the object can be used later.
         * - the function is bound as an argument of a function call.
         *
         * If a reference exists in a function which can be used later, the reference is read when the function is called.
         * @param {ASTNode} id An Identifier node to check.
         * @param {ASTNode} rhsNode The RHS node of the previous assignment.
         * @returns {boolean} `true` if the `id` node exists inside of a function node which can be used later.
         * @private
         */
        function isInsideOfStorableFunction(id, rhsNode) {
            const funcNode = astUtils.getUpperFunction(id);

            return (
                funcNode &&
                isInside(funcNode, rhsNode) &&
                isStorableFunction(funcNode, rhsNode)
            );
        }

        /**
         * Checks whether a given reference is a read to update itself or not.
         * @param {eslint-scope.Reference} ref A reference to check.
         * @param {ASTNode} rhsNode The RHS node of the previous assignment.
         * @returns {boolean} The reference is a read to update itself.
         * @private
         */
        function isReadForItself(ref, rhsNode) {
            const id = ref.identifier;
            const parent = id.parent;
            const granpa = parent.parent;

            return ref.isRead() && (

                // self update. e.g. `a += 1`, `a++`
                (// in RHS of an assignment for itself. e.g. `a = a + 1`
                    ((
                        parent.type === "AssignmentExpression" &&
                        granpa.type === "ExpressionStatement" &&
                        parent.left === id
                    ) ||
                        (
                            parent.type === "UpdateExpression" &&
                            granpa.type === "ExpressionStatement"
                        ) || rhsNode &&
                        isInside(id, rhsNode) &&
                        !isInsideOfStorableFunction(id, rhsNode)))
            );
        }

        /**
         * Determine if an identifier is used either in for-in loops.
         * @param {Reference} ref The reference to check.
         * @returns {boolean} whether reference is used in the for-in loops
         * @private
         */
        function isForInRef(ref) {
            let target = ref.identifier.parent;


            // "for (var ...) { return; }"
            if (target.type === "VariableDeclarator") {
                target = target.parent.parent;
            }

            if (target.type !== "ForInStatement") {
                return false;
            }

            // "for (...) { return; }"
            if (target.body.type === "BlockStatement") {
                target = target.body.body[0];

                // "for (...) return;"
            } else {
                target = target.body;
            }

            // For empty loop body
            if (!target) {
                return false;
            }

            return target.type === "ReturnStatement";
        }

        /**
         * Determines if the variable is used.
         * @param {Variable} variable The variable to check.
         * @returns {boolean} True if the variable is used
         * @private
         */
        function isUsedVariable(variable) {
            const functionNodes = getFunctionDefinitions(variable),
                isFunctionDefinition = functionNodes.length > 0;
            let rhsNode = null;

            return variable.references.some(ref => {
                if (isForInRef(ref)) {
                    return true;
                }

                const forItself = isReadForItself(ref, rhsNode);

                rhsNode = getRhsNode(ref, rhsNode);

                return (
                    isReadRef(ref) &&
                    !forItself &&
                    !(isFunctionDefinition && isSelfReference(ref, functionNodes))
                );
            });
        }

        /**
         * Checks whether the given variable is after the last used parameter.
         * @param {eslint-scope.Variable} variable The variable to check.
         * @returns {boolean} `true` if the variable is defined after the last
         * used parameter.
         */
        function isAfterLastUsedArg(variable) {
            const def = variable.defs[0];
            const params = context.getDeclaredVariables(def.node);
            const posteriorParams = params.slice(params.indexOf(variable) + 1);

            // If any used parameters occur after this parameter, do not report.
            return !posteriorParams.some(v => v.references.length > 0 || v.eslintUsed);
        }


        function isUnusedTsType(variable): boolean {
            if (
                variable.isTypeVariable &&
                // 排除类似class的声明
                variable.identifiers[0].parent.type.indexOf('TS') === 0
            ) {
                return variable.references.length === 0
            }
            return false
        }

        /**
         * Gets an array of variables without read references.
         * @param {Scope} scope an eslint-scope Scope object.
         * @param {Variable[]} unusedVars an array that saving result.
         * @returns {Variable[]} unused variables of the scope and descendant scopes.
         * @private
         */
        function collectUnusedVariables(scope, unusedVars) {
            const variables = scope.variables;
            const childScopes = scope.childScopes;
            let i, l;

            if (scope.type !== "global" || config.vars === "all") {
                for (i = 0, l = variables.length; i < l; ++i) {
                    const variable = variables[i];

                    // skip a variable of class itself name in the class scope
                    if (scope.type === "class" && scope.block.id === variable.identifiers[0]) {
                        continue;
                    }

                    // skip function expression names and variables marked with markVariableAsUsed()
                    if (scope.functionExpressionScope || variable.eslintUsed) {
                        continue;
                    }

                    // skip implicit "arguments" variable
                    if (scope.type === "function" && variable.name === "arguments" && variable.identifiers.length === 0) {
                        continue;
                    }

                    // explicit global variables don't have definitions.
                    // variable.defs声明变量的地方， 如果是全局变量defs为空。
                    // variable.references变量使用的地方，就算是声明但未使用的变量，references也会报存使用的地方。
                    const def = variable.defs[0];

                    if (def) {
                        debugger

                        const type = def.type;

                        // skip catch variables
                        if (type === "CatchClause") {
                            if (config.caughtErrors === "none") {
                                continue;
                            }

                            // skip ignored parameters
                            if (config.caughtErrorsIgnorePattern && config.caughtErrorsIgnorePattern.test(def.name.name)) {
                                continue;
                            }
                        }

                        if (type === "Parameter") {

                            // skip any setter argument
                            if ((def.node.parent.type === "Property" || def.node.parent.type === "MethodDefinition") && def.node.parent.kind === "set") {
                                continue;
                            }

                            // if "args" option is "none", skip any parameter
                            if (config.args === "none") {
                                continue;
                            }

                            // skip ignored parameters
                            if (config.argsIgnorePattern && config.argsIgnorePattern.test(def.name.name)) {
                                continue;
                            }

                            // if "args" option is "after-used", skip used variables
                            if (config.args === "after-used" && astUtils.isFunction(def.name.parent) && !isAfterLastUsedArg(variable)) {
                                continue;
                            }
                        } else {
                            // 跳过忽略的变量
                            if (
                                config.varsIgnorePattern &&
                                config.varsIgnorePattern.test(def.name.name)
                            ) {
                                continue;
                            }
                        }
                    }

                    const isUsedVariableRes = isUsedVariable(variable)
                    const isExportedRes = isExported(variable)
                    const hasRestSpreadSiblingRes = hasRestSpreadSibling(variable)
                    
                    if (
                        !isUsedVariableRes &&
                        !isExportedRes &&
                        !hasRestSpreadSiblingRes
                        || (!isExportedRes && isUnusedTsType(variable))
                    ) {
                        unusedVars.push(variable);
                    }
                }
            }

            // 递归子作用域
            for (i = 0, l = childScopes.length; i < l; ++i) {
                collectUnusedVariables(childScopes[i], unusedVars);
            }

            return unusedVars;
        }

        //--------------------------------------------------------------------------
        // Public
        //--------------------------------------------------------------------------

        return {
            "Program:exit"(programNode) {
                debugger
                const unusedVars = collectUnusedVariables(context.getScope(), []);

                for (let i = 0, l = unusedVars.length; i < l; ++i) {
                    const unusedVar = unusedVars[i];

                    // Report the first declaration.
                    // 删除第一个声明
                    if (unusedVar.defs.length > 0) {
                        context.report({
                            node: unusedVar.identifiers[0],
                            message: unusedVar.references.some(ref => ref.isWrite())
                                ? getAssignedMessage()
                                : getDefinedMessage(unusedVar),
                            data: unusedVar,
                            fix: function (fixer) {
                                return removeUnusedCode(fixer, unusedVar, sourceCode)
                            },
                        });

                        // If there are no regular declaration, report the first `/*globals*/` comment directive.
                    } else if (unusedVar.eslintExplicitGlobalComments) {
                        const directiveComment = unusedVar.eslintExplicitGlobalComments[0];

                        context.report({
                            node: programNode,
                            loc: astUtils.getNameLocationInGlobalDirectiveComment(sourceCode, directiveComment, unusedVar.name),
                            message: getDefinedMessage(unusedVar),
                            data: unusedVar
                        });
                    }
                }
            }
        };

    }
};
