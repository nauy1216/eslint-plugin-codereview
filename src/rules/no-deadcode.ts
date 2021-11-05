export default {
  meta: {
    type: "suggestion",
    docs: {
      description: "no-deadcode",
      category: "Possible Errors",
      recommended: true,
      url: "https://eslint.org/docs/rules/no-extra-semi",
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
      avoidName: "Avoid using variables named '{{ name }}'",
    },
  },
  create: function (context) {
    return {
      // collect
      "Program:exit"(programNode): void {
        /**
         * 1. context.getFilename() 文件的绝对路径
         * 2. context.options rules的参数
         * 3. context.getScope()
         * 4. context.report() 发布警告或错误
         */
         const program = context.getSourceCode().ast;
      },
      ReturnStatement: function (node) {
        debugger;

        console.log(context.getFilename());
        context.report({
          node: node,
          message: "deadcode: {{ identifier }}",
          data: {
            identifier: node.name,
          },
          fix: function (fixer) {
            debugger;
            return fixer.remove(node);
          },
        });
        // at a ReturnStatement node while going down
      },
      Identifier(node) {
        if (node.name === "foo") {
          context.report({
            node,
            messageId: "avoidName",
            data: {
              name: "foo",
            },
            fix: function (fixer) {
              return fixer.remove(node);
            },
          });
        }
      },
      onCodePathStart: function (codePath, node) {
        console.log("onCodePathStart", codePath);
        // at the start of analyzing a code path
      },
      onCodePathEnd: function (codePath, node) {
        // at the end of analyzing a code path
      },
    };
  },
};
