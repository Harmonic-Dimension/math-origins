import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir:'tests/browser', fullyParallel:true, workers:2, retries:0,
  use:{baseURL:'http://127.0.0.1:4173',trace:'retain-on-failure'},
  webServer:{command:'npm run preview -- --port 4173 --strictPort',url:'http://127.0.0.1:4173',reuseExistingServer:!process.env.CI},
  projects:[{name:'desktop',use:{...devices['Desktop Chrome']}},{name:'mobile',use:{...devices['iPhone 13'],defaultBrowserType:'chromium'}}],
});
