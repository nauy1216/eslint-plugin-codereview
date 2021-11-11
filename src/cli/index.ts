import path from 'path'
import { exec } from "child_process"
import minimist from 'minimist'

export default function () {
    // codereview --config=.eslintrc.js --src=./src/1.ts
    const argv = minimist(process.argv.slice(2))

    if (!argv.config) {
        throw new Error('config参数未传。用于eslint设置选项。')
    }

    if (!argv.src) {
        throw new Error('src参数未传。用于指定eslint检测的文件或目录。')
    }

    const srcFiles = argv.src// path.resolve(process.cwd(), argv.src)
    // const configFile = path.resolve(process.cwd(), argv.config)
    const configFile = path.resolve(__dirname, '../../config/.eslintrc.default.js')
    const eslintExe = path.resolve(__dirname, '../../node_modules/eslint/bin/eslint.js')
    
    exec(`${eslintExe} -v`, (error, stdout) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        console.log(`eslint: ${stdout}`);
    })

    exec(`${eslintExe} ${srcFiles}  --ext .ts,.tsx -c=${configFile} --fix`, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
    })
}