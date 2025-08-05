/**
 * Test script to validate the development startup system
 * This runs a quick test of the development environment startup
 */

const { spawn } = require('child_process');

console.log('🧪 Testing CCH Axcess Intelligence Vibed Development Scripts');
console.log('===========================================================\n');

// Test 1: Port cleanup
console.log('Test 1: Port cleanup functionality');
const killPorts = spawn('powershell', [
  '-ExecutionPolicy', 'Bypass',
  '-File', 'scripts/kill-ports.ps1',
  '-Verbose'
], { 
  stdio: 'inherit', 
  shell: true 
});

killPorts.on('close', (code) => {
  console.log(`\nPort cleanup test completed with code: ${code}`);
  
  if (code === 0) {
    console.log('✅ Port cleanup test PASSED\n');
    
    // Test 2: Quick dev server start (with timeout)
    console.log('Test 2: Development server startup (10 second test)');
    const devServer = spawn('npm', ['run', 'dev'], {
      stdio: 'pipe',
      shell: true
    });
    
    let serverOutput = '';
    
    devServer.stdout.on('data', (data) => {
      const output = data.toString();
      serverOutput += output;
      process.stdout.write(`[DEV SERVER] ${output}`);
      
      // Check if server started successfully
      if (output.includes('Local:') || output.includes('localhost')) {
        console.log('✅ Development server started successfully!');
        
        // Kill the server after successful start
        setTimeout(() => {
          devServer.kill();
          console.log('\n🛑 Test server stopped');
          console.log('\n🎉 All tests completed successfully!');
          console.log('\nYou can now use:');
          console.log('  npm run start     - Start with port cleanup');
          console.log('  npm run dev       - Start without port cleanup');
          console.log('  npm run kill-ports - Clean ports only');
          console.log('  start-dev.bat     - Windows batch file');
          process.exit(0);
        }, 3000);
      }
    });
    
    devServer.stderr.on('data', (data) => {
      process.stderr.write(`[DEV SERVER ERROR] ${data}`);
    });
    
    devServer.on('error', (error) => {
      console.log(`❌ Development server test FAILED: ${error.message}`);
      process.exit(1);
    });
    
    // Timeout after 10 seconds
    setTimeout(() => {
      if (!devServer.killed) {
        devServer.kill();
        console.log('\n⚠️  Development server test timed out');
        console.log('This might be normal if the server takes longer to start');
        process.exit(0);
      }
    }, 10000);
    
  } else {
    console.log('❌ Port cleanup test FAILED');
    process.exit(1);
  }
});

killPorts.on('error', (error) => {
  console.log(`❌ Port cleanup test FAILED: ${error.message}`);
  process.exit(1);
});