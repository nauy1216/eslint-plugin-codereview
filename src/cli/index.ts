// import * as eslint from "eslint"
// import path from 'path'
// import { exec, fork } from "child_process"
// export default function () {
//     console.log('hello ')
//     var cli = new eslint.ESLint({
//         overrideConfig: {
//             fix: true,
//             'plugins': [
//                 'codereview',
//             ],
//             'rules': {
//                 'indent': 'off',
//                 'codereview/no-unused-vars': 2,
//             },
//         }
//     });
//     debugger
//     cli.lintFiles([
//         path.resolve(process.cwd(), 'src/utils/web-monitor.ts')
//     ])
// }

export default function () {
    // const srcFiles = path.resolve(process.cwd(), 'src/utils/util.ts')
    // const configFile = path.resolve(process.cwd(), '.eslintrc.code.js')
    // exec(`eslint ${srcFiles} -c=${configFile} --fix`)
    // fork(
    //     path.resolve(process.cwd(), 'node_modules/eslint'),
    //     [
    //         srcFiles,
    //         `-c=${configFile}`,
    //         '--fix'
    //     ]
    // )
}