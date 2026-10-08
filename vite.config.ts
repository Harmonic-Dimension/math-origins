import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
export default defineConfig({
  plugins: [react(), {
    name:'static-directory-routes',
    configurePreviewServer(server) {
      server.middlewares.use((request,response,next)=>{
        const url=new URL(request.url || '/', 'http://localhost');
        const base=(process.env.BASE_PATH || '/').replace(/\/$/,'');
        const path=base && url.pathname.startsWith(base+'/')?url.pathname.slice(base.length):url.pathname;
        if(!path.endsWith('/') && existsSync(resolve('dist','.'+path,'index.html'))) {
          response.statusCode=308;response.setHeader('Location',url.pathname+'/'+url.search);response.end();
        } else next();
      });
    },
  }], base: process.env.BASE_PATH || '/',
  build: { manifest: true, rollupOptions: { output: { manualChunks(id) {
    if (id.includes('/node_modules/katex/')) return 'math-typesetting';
    if (id.includes('/node_modules/zod/')) return 'validation';
    if (id.includes('/node_modules/')) return 'libraries';
  } } } },
});
