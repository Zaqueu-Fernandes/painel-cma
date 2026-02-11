import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // CORREÇÃO: base com o nome do repositório no GitHub
  // Troque 'painel-cma' pelo nome EXATO do seu repositório
  base: '/painel-cma/',
})
