import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  server: {
    watch: {
      usePolling: true, // Используем polling для корректной работы в Docker
    },
    host: true, // Делаем приложение доступным изнутри контейнера
    port: 3003,
  },
  define: {
    'process.env': process.env, // Передаём переменные окружения в клиентский код
  },
});
