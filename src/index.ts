/**
 * @fileoverview delete dead code.
 * @author liuchengyuan
 */
import noDeadcode from './rules/no-deadcode';
import noUnusedVars  from './rules/no-unused-vars';
import noUnusedExpressions  from './rules/no-unused-expressions';
debugger
export =  {
  rules: {
    'no-deadcode': noDeadcode,
    'no-unused-vars': noUnusedVars,
    'no-unused-expressions': noUnusedExpressions,
  },
  processors: {
    //
  }
};
