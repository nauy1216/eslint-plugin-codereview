# 调试
npm link

# 在使用eslint的项目配置rules，执行npm run lint即可开始调试


# 遍历ast
- /Users/liuchengyuan/Documents/github/typescript-eslint/packages/scope-manager/src/referencer/VisitorBase.ts

# eslint-rule-composer
# 收集未使用的变量
- /Users/liuchengyuan/Documents/github/typescript-eslint/packages/eslint-plugin/src/util/collectUnusedVariables.ts
```ts
  public static collectUnusedVariables<
    TMessageIds extends string,
    TOptions extends readonly unknown[],
  >(
    context: TSESLint.RuleContext<TMessageIds, TOptions>,
  ): ReadonlySet<TSESLint.Scope.Variable> {
    debugger
    const program = context.getSourceCode().ast;
    const cached = this.RESULTS_CACHE.get(program);
    if (cached) {
      return cached;
    }

    const visitor = new this(context);
    visitor.visit(program);

    const unusedVars = visitor.collectUnusedVariables(
      visitor.getScope(program),
    );
    this.RESULTS_CACHE.set(program, unusedVars);
    return unusedVars;
  }
```

# todo
1. import { /**DEAD_CODE create_store*/, store } from './redux/store';
1. src/constants.tsx
2. src/root.tsx
3. src/api/achievementManage/type.ts