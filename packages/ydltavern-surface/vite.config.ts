import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

// Library mode — produces a single browser-ready ESM bundle that surface
// hosts can import via dynamic import(). React and other deps are BUNDLED
// (not externalized) because the iframe sandbox cannot share modules with
// the parent.
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  resolve: {
    alias: {
      '@ydltavern/engine-core': resolve(__dirname, 'browser/engine-core.ts'),
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'YdlTavernSurface',
      formats: ['es'],
      fileName: () => 'bundle.mjs',
    },
    outDir: 'dist',
    emptyOutDir: false, // tsc output coexists with bundle
    sourcemap: true,
    target: 'es2022',
    rollupOptions: {
      // Don't externalize anything — full self-contained bundle
      external: [],
      output: {
        // Single file, no code splitting in lib mode
        inlineDynamicImports: true,
      },
    },
  },
});
