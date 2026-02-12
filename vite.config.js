//import react from '@vitejs/react-refresh' // Plugin anterior
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // Plugin atualizado

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/painel-cma/', // Garante que os caminhos dos arquivos fiquem corretos no GitHub Pages
})