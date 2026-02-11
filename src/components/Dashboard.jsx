import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Digitalizacao from './Digitalizacao';
import AnaliseFinanceira from './AnaliseFinanceira';

function Dashboard({ usuario, setUsuario }) {
  const navigate = useNavigate();
  const [abaAtiva, setAbaAtiva] = useState('digitalizacao');
  
  // FILTROS COMPARTILHADOS ENTRE ABAS (Problema 8 resolvido)
  const [filtros, setFiltros] = useState({
    dataInicial: '',
    dataFinal: '',
    mes: '',
    ano: '',
    natureza: 'TODOS',
    categoria: '',
    credor: '',
    docCaixa: '',
    descricao: ''
  });

  const fazerLogout = () => {
    setUsuario(null);
    navigate('/login');
  };

  return (
    <div className="dashboard">
      {/* Menu Abas - SEM header aqui, pois já está no App.jsx */}
      <div className="menu-abas-container">
        <div className="menu-abas">
          <button
            className={`aba-btn ${abaAtiva === 'digitalizacao' ? 'active' : ''}`}
            onClick={() => setAbaAtiva('digitalizacao')}
          >
            <i className="fas fa-file-alt"></i> Digitalização
          </button>
          <button
            className={`aba-btn ${abaAtiva === 'analise' ? 'active' : ''}`}
            onClick={() => setAbaAtiva('analise')}
          >
            <i className="fas fa-chart-bar"></i> Análise Financeira
          </button>
        </div>
      </div>

      {/* Conteúdo das Abas - Passando filtros compartilhados */}
      {abaAtiva === 'digitalizacao' && (
        <Digitalizacao 
          fazerLogout={fazerLogout} 
          filtros={filtros}
          setFiltros={setFiltros}
        />
      )}
      {abaAtiva === 'analise' && (
        <AnaliseFinanceira 
          fazerLogout={fazerLogout}
          filtros={filtros}
          setFiltros={setFiltros}
        />
      )}
    </div>
  );
}

export default Dashboard;