import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Login from './components/Login';
import Cadastro from './components/Cadastro';
import Confirmacao from './components/Confirmacao';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  const [usuario, setUsuario] = useState(null);

  // Componente de proteção de rota
  const RotaProtegida = ({ children }) => {
    return usuario ? children : <Navigate to="/login" />;
  };

  return (
    <HashRouter>
      <div className="app">
        {/* Header em todas as páginas */}
        <header className="header">
          <div className="header-content">
            <img 
              src="https://i.ibb.co/yFHW1DxL/Gemini-CMA-logo-Photoroom.png" 
              alt="Logo CMA" 
              className="logo"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div className="header-titles">
              <h1>Painel do Gestor - Câmara Municipal de Araripe</h1>
              <h2>Gestão de documentos digitalizados</h2>
            </div>
          </div>
        </header>

        {/* Conteúdo das rotas */}
        <main className="main-content">
          <Routes>
            <Route path="/login" element={<Login setUsuario={setUsuario} />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/confirmacao" element={<Confirmacao />} />
            <Route 
              path="/dashboard" 
              element={
                <RotaProtegida>
                  <Dashboard usuario={usuario} setUsuario={setUsuario} />
                </RotaProtegida>
              } 
            />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </main>

        {/* Footer em todas as páginas */}
        <footer className="footer">
          <p>Copyright © 2026 | Zaqueu Fernandes | Suporte Técnico</p>
          <p>
            WhatsApp:{' '}
            <a href="https://wa.me/5588994014262" target="_blank" rel="noopener noreferrer">
              88 9 9401-4262
            </a>
          </p>
        </footer>
      </div>
    </HashRouter>
  );
}

export default App;
