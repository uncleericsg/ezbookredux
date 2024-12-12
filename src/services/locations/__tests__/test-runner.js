import { spawn } from 'child_process';

const testProcess = spawn('npx', ['vitest', 'run', 'src/services/locations/__tests__/regions.test.ts'], {
  cwd: 'c:/Users/djxpi/OneDrive/Documents/2024_iAircon_EasyBooking_WINDSURF/CascadeProjects/windsurf-project/project',
  shell: true,
  stdio: 'inherit'
});

setTimeout(() => {
  testProcess.kill();
  console.log('Test execution stopped after 1 minute');
  process.exit(0);
}, 60000); // 1 minute timeout
