import noDeadcode from './rules/no-deadcode';
import noUnusedVars  from './rules/no-unused-vars';
import noUnusedTsvars from './rules/no-unused-tsvars'
import noUnusedCode from './rules/no-unused-code'
export =  {
  rules: {
    'no-deadcode': noDeadcode,
    'no-unused-vars': noUnusedVars,
    'no-unused-tsvars': noUnusedTsvars,
    'no-unused-code': noUnusedCode
  },
  processors: {
    //
  }
};
