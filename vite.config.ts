import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev
export default defineConfig({
  base: '/lawyer-client-crm/',
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
