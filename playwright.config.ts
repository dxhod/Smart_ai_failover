import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  workers: 1,
  webServer: {
    command: 'npm run dev -- -p 3100',
    url: 'http://127.0.0.1:3100',
    reuseExistingServer: true,
    env: {
      E2E_MOCK_API: 'true',
    },
  },
  use: {
    baseURL: 'http://127.0.0.1:3100',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
