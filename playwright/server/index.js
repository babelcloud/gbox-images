import { chromium } from 'playwright';
import path from 'path';

async function run() {
  console.log('Starting Playwright persistent context server...');
  const port = 9223;

  try {
    // Launch persistent context with user data directory for state persistence
    const userDataDir = path.join(process.cwd(), 'user-data');
    await chromium.launchPersistentContext(userDataDir, {
      headless: true,
      args: [
        `--remote-debugging-port=${port}`,
        '--remote-debugging-address=0.0.0.0',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
      ],
      // Additional options for container environment
      ignoreDefaultArgs: ['--enable-automation'],
      chromiumSandbox: false,
    });

    console.log('Playwright persistent context started successfully');
    console.log(`Chrome DevTools Protocol available at: http://0.0.0.0:${port}`);
    console.log('User data directory:', userDataDir);

    // Keep the process alive
    await new Promise(() => {});
  } catch (error) {
    console.error('Failed to start Playwright persistent context:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('Received SIGINT, shutting down gracefully...');
  process.exit(0);
});

// Start the server
run();
