import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir:'tests/browser', fullyParallel:true, workers:2, retries:0,
  use:{baseURL:'http://127.0.0.1:4173',trace:'retain-on-failure'},
  webServer:{command:'npm run preview -- --port 4173 --strictPort',url:'http://127.0.0.1:4173',reuseExistingServer:!process.env.CI},
  projects:[{name:'desktop',use:{...devices['Desktop Chrome'],viewport:{width:1440,height:1000}}},{name:'tablet',use:{...devices['Desktop Chrome'],viewport:{width:768,height:1024}}},{name:'mobile',use:{...devices['iPhone 13'],viewport:{width:390,height:844},defaultBrowserType:'chromium'}}],
});
