import path from 'path'
import { exec } from "child_process"
import minimist from 'minimist'

export default function () {
    debugger
    // codereview --config=.eslintrc.js --src=./src
    const argv = minimist(process.argv.slice(2))
    const srcFiles = argv.src// path.resolve(process.cwd(), argv.src)
    const configFile = path.resolve(process.cwd(), argv.config)
    const eslintExe = path.resolve(process.cwd(), 'node_modules/eslint/bin/eslint.js')
    exec(`${eslintExe} ${srcFiles}  --ext .ts,.tsx -c=${configFile} --fix`, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
    })
}