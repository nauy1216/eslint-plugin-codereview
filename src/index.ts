import noDeadcode from './rules/no-deadcode';
import noUnusedVars  from './rules/no-unused-vars';
import noUnusedTsvars from './rules/no-unused-tsvars'

export =  {
  rules: {
    'no-deadcode': noDeadcode,
    'no-unused-vars': noUnusedVars,
    'no-unused-tsvars': noUnusedTsvars,
  },
  processors: {
    //
  }
};
