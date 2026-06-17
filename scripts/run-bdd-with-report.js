const { spawnSync } = require('child_process');

const args = process.argv.slice(2);

function runCommand(command, commandArgs) {
  const result = spawnSync(command, commandArgs, {
    shell: true,
    stdio: 'inherit'
  });

  if (result.error) {
    console.error(`Failed to start ${command} ${commandArgs.join(' ')}`);
    return { success: false, status: 1 };
  }

  return { success: result.status === 0, status: result.status };
}

let exitCode = 0;

const cucumber = runCommand('npx', ['cucumber-js', ...args]);
if (!cucumber.success) {
  exitCode = cucumber.status || 1;
}

const report = runCommand('npm', ['run', 'report']);
if (!report.success && exitCode === 0) {
  exitCode = report.status || 1;
}

const openReport = runCommand('npm', ['run', 'open-report']);
if (!openReport.success && exitCode === 0) {
  exitCode = openReport.status || 1;
}

process.exit(exitCode);
