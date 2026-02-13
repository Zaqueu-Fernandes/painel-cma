# App com React + Vite + Supabase

📝 Checklist Definitiva: Deploy React + Vite no GitHub Pages

## Deploy no GitHub Pages

Passo a passo para atualizar o app no GitHub Pages:
1. Ajustar `package.json` e `vite.config.js`...
2. Testar local com `npm run dev`...
3. Commit e push...
4. Deploy com `npm run deploy`...

1️⃣ Criar repositório remoto no GitHub

Acesse o GitHub → New Repository.

Nome do repositório: mesmo nome do seu projeto (ex: painel-cma)

Isso evita problemas com URL e basename.

Não marque:

README

.gitignore

License

Queremos um repositório vazio.

Clique em Create repository.

2️⃣ Conectar o projeto local ao GitHub

No VSCode, dentro da pasta do seu projeto (onde está o package.json):

git init           # só se ainda não tiver inicializado
git remote remove origin  # remove qualquer vínculo antigo
git remote add origin https://github.com/SEU_USUARIO/painel-cma.git
git branch -M main  # garante que a branch principal se chame main

3️⃣ Ajustar package.json

Homepage: garante que o GitHub Pages saiba onde está o app.

"homepage": "https://SEU_USUARIO.github.io/painel-cma/"


Scripts:

"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}


Dependência de deploy:

npm install gh-pages --save-dev

4️⃣ Ajustar vite.config.js

Para que os assets funcionem no GitHub Pages:

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/painel-cma/',  // nome do repositório
});

5️⃣ Ajustar App.jsx (React Router)

Para evitar 404 em rotas diferentes:

import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
// substitua BrowserRouter por HashRouter


Envolva a app inteira no <HashRouter>.

Mantém todas as rotas iguais.

Com HashRouter, as URLs ficam tipo: /#/dashboard → GitHub ignora o hash, React lê.

6️⃣ Commit inicial
git add .
git commit -m "Projeto inicial React + Vite pronto para GitHub Pages"
git push -u origin main


Isso garante que o repositório remoto está limpo e sincronizado.

7️⃣ Deploy da primeira vez
npm run deploy


Isso cria automaticamente a branch gh-pages.

Publica a pasta dist (build final) lá.

8️⃣ Configurar GitHub Pages

No repositório:

Settings → Pages → Build and deployment → Deploy from a branch

Branch: gh-pages

Folder: /(root)

Salvar

Aguarde 30-60 segundos para o site ficar online.

9️⃣ Testar o site

Abra em qualquer navegador:

https://SEU_USUARIO.github.io/painel-cma/


Deve abrir sem /index.html

Todas as rotas devem funcionar (graças ao HashRouter)

10️⃣ Próximos deploys

Sempre que fizer alterações:

git add .
git commit -m "Descrição do que foi feito"
git push
npm run deploy


Nunca mais mexer na branch gh-pages manualmente.
GitHub Pages vai ler apenas essa branch.

✅ Com isso, você tem processo reproduzível, limpo e à prova de erros.
