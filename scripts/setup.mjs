import { spawnSync } from 'node:child_process'

const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm'
const dotnetCommand = process.platform === 'win32' ? 'dotnet.exe' : 'dotnet'

function run(command, args) {
  const result = spawnSync(command, args, { stdio: 'inherit' })

  if (result.error) {
    console.error(`Unable to start ${command}: ${result.error.message}`)
    process.exit(1)
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
}

console.log('Installing root dependencies from the lock file...')
run(npmCommand, ['ci'])

console.log('Installing frontend dependencies from the lock file...')
run(npmCommand, ['ci', '--prefix', 'frontend'])

console.log('Restoring backend dependencies from the lock files...')
run(dotnetCommand, ['restore', 'backend/VueDotnet.sln', '--locked-mode'])

console.log('\nSetup complete. Start both applications with: npm run dev')
