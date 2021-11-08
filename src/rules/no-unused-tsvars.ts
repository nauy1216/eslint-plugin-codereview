import { addAnnotation } from '../util/helper'
import {addComment} from '../util/comment'
import { Types } from '../const'
export default {
  meta: {
    type: "suggestion",
    docs: {
      description: "no-tsvars",
      category: "Possible Errors",
      recommended: false,
    },
    fixable: "code",
    // 定义参数的格式
    schema: [
      {
        type: "object",
        properties: {
          entry: {
            type: "string",
          },
        },
        additionalProperties: true,
      },
    ],
    // 定义消息模版
    messages: {
      // avoidName: "Avoid using variables named '{{ name }}'",
    },
  },
  create: function (context) {
    // ts
    const typeVars: any = []
    const usedTypeVars = new Set()


    // js
    const js = {
      // 声明的变量
      vars: new Map(),
      // 已经使用的变量
      usedVars: new Map()
  };
    return {
      // collect
      "Program:exit"(programNode): void {
        debugger
        /**
         * 1. context.getFilename() 文件的绝对路径
         * 2. context.options rules的参数
         * 3. context.getScope()
         * 4. context.report() 发布警告或错误
         */
        typeVars.forEach(type => {
          if (!usedTypeVars.has(type.name)) {
            context.report({
              node: type.parent,
              message: "未使用的type",
              // data: ,
              fix: function (fixer) {
                debugger;
                return addAnnotation(fixer, type.parent)
              },
            });
          }
        });
        typeVars.length = 0
        usedTypeVars.clear()


        js.vars.forEach((value, key) => {
          if (!js.usedVars.has(key)) {
            context.report({
              node: value,
              message: "未使用的变量声明",
              fix: function (fixer) {
                debugger;
                return addComment(fixer, value)
              },
            });
          }
        })
      },
      // ts-------------------------------
      //类型别名 type A 
      TSTypeAliasDeclaration(node) {
        debugger
        typeVars.push(node.id)

        // type A = B 标记B已使用
        if (node.typeAnnotation.type === Types.TSTypeReference) {
          usedTypeVars.add(node.typeAnnotation.typeName.name)
        } 
        
        // export A = any 标记A已使用
        if (Types.ExportNamedDeclaration === node.parent.type) {
          usedTypeVars.add(node.id.name)
        }
      },
      
      // js-------------------------------
      Identifier(node) {
        debugger
        js.vars.set(node.name, node)
      },

      onCodePathStart: function (codePath, node) {
        // console.log("onCodePathStart", codePath);
        // at the start of analyzing a code path
      },
      
      onCodePathEnd: function (codePath, node) {
        // at the end of analyzing a code path
      },
    };
  },
};
