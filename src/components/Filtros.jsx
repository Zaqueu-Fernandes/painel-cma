import { useState, useEffect } from 'react';
import { buscarFiltrosDisponiveis, buscarAnosDisponiveis } from '../services/supabase';

// CORREÇÃO: Filtros com ordem ANO/MÊS e anos da base de dados
function Filtros({ filtros, setFiltros, onLimparFiltros, fazerLogout }) {
  const [opcoes, setOpcoes] = useState({
    categorias: [],
    credores: [],
    anos: [] // CORREÇÃO: Anos virão da base de dados
  });

  useEffect(() => {
    carregarOpcoesFiltros();
  }, []);

  const carregarOpcoesFiltros = async () => {
    const resultado = await buscarFiltrosDisponiveis();
    const anos = await buscarAnosDisponiveis();
    
    setOpcoes({
      categorias: resultado.categorias,
      credores: resultado.credores,
      anos: anos.length > 0 ? anos : [2025, 2024, 2023, 2022, 2021, 2020] // Fallback
    });
    
    console.log('Anos carregados:', anos);
  };

  const handleChange = (campo, valor) => {
    setFiltros(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const handleNaturezaChange = (valor) => {
    setFiltros(prev => ({
      ...prev,
      natureza: valor
    }));
  };

  const handleLimpar = () => {
    const filtrosLimpos = {
      dataInicial: '',
      dataFinal: '',
      mes: '',
      ano: '',
      natureza: 'TODOS',
      categoria: '',
      credor: '',
      docCaixa: '',
      descricao: ''
    };
    setFiltros(filtrosLimpos);
    if (onLimparFiltros) {
      onLimparFiltros();
    }
  };

  return (
    <div className="filtros-container">
      <div className="filtros-header">
        <h3>
          <i className="fas fa-filter"></i> Filtros
        </h3>
        <div className="filtros-acoes">
          <button onClick={handleLimpar} className="btn-limpar">
            <i className="fas fa-eraser"></i> Limpar Filtros
          </button>
          <a onClick={fazerLogout} className="link-sair">
            <i className="fas fa-sign-out-alt"></i> Sair
          </a>
        </div>
      </div>

      {/* PRIMEIRA LINHA: Período, Ano/Mês, Natureza, Categoria */}
      <div className="filtros-grid">
        {/* Filtro Período */}
        <div className="filtro-grupo filtro-grupo-periodo">
          <label>Período</label>
          <div className="periodo-inputs">
            <input
              type="date"
              name="dataInicial"
              value={filtros.dataInicial}
              onChange={(e) => handleChange('dataInicial', e.target.value)}
            />
            <span className="periodo-separator">até</span>
            <input
              type="date"
              name="dataFinal"
              value={filtros.dataFinal}
              onChange={(e) => handleChange('dataFinal', e.target.value)}
            />
          </div>
        </div>

        {/* CORREÇÃO: Filtro Ano/Mês (invertido - ANO primeiro) */}
        <div className="filtro-grupo filtro-grupo-ano-mes">
          <label>Ano/Mês</label>
          <div className="ano-mes-inputs">
            <select 
              name="ano" 
              value={filtros.ano} 
              onChange={(e) => handleChange('ano', e.target.value)}
            >
              <option value="">Ano</option>
              {opcoes.anos.map(ano => (
                <option key={ano} value={ano}>{ano}</option>
              ))}
            </select>
            <select 
              name="mes" 
              value={filtros.mes} 
              onChange={(e) => handleChange('mes', e.target.value)}
            >
              <option value="">Mês</option>
              <option value="1">Janeiro</option>
              <option value="2">Fevereiro</option>
              <option value="3">Março</option>
              <option value="4">Abril</option>
              <option value="5">Maio</option>
              <option value="6">Junho</option>
              <option value="7">Julho</option>
              <option value="8">Agosto</option>
              <option value="9">Setembro</option>
              <option value="10">Outubro</option>
              <option value="11">Novembro</option>
              <option value="12">Dezembro</option>
            </select>
          </div>
        </div>

        {/* Toggle Natureza */}
        <div className="filtro-grupo">
          <label>Natureza</label>
          <div className="toggle-natureza">
            <button
              type="button"
              className={`toggle-btn ${filtros.natureza === 'TODOS' ? 'active' : ''}`}
              onClick={() => handleNaturezaChange('TODOS')}
            >
              Todos
            </button>
            <button
              type="button"
              className={`toggle-btn ${filtros.natureza === 'RECEITA' ? 'active' : ''}`}
              onClick={() => handleNaturezaChange('RECEITA')}
            >
              Receita
            </button>
            <button
              type="button"
              className={`toggle-btn ${filtros.natureza === 'DESPESA' ? 'active' : ''}`}
              onClick={() => handleNaturezaChange('DESPESA')}
            >
              Despesa
            </button>
          </div>
        </div>

        {/* Categoria */}
        <div className="filtro-grupo">
          <label>Categoria</label>
          <select 
            name="categoria" 
            value={filtros.categoria} 
            onChange={(e) => handleChange('categoria', e.target.value)}
          >
            <option value="">Todas</option>
            {opcoes.categorias.map((cat, index) => (
              <option key={index} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* SEGUNDA LINHA: Credor, Doc. Caixa, Descrição (CENTRALIZADA) */}
      <div className="filtros-grid-segunda-linha">
        {/* Credor */}
        <div className="filtro-grupo">
          <label>Credor</label>
          <select 
            name="credor" 
            value={filtros.credor} 
            onChange={(e) => handleChange('credor', e.target.value)}
          >
            <option value="">Todos</option>
            {opcoes.credores.map((cred, index) => (
              <option key={index} value={cred}>
                {cred}
              </option>
            ))}
          </select>
        </div>

        {/* Doc. Caixa */}
        <div className="filtro-grupo">
          <label>Doc. Caixa</label>
          <input
            type="text"
            name="docCaixa"
            placeholder="Buscar..."
            value={filtros.docCaixa}
            onChange={(e) => handleChange('docCaixa', e.target.value)}
          />
        </div>

        {/* Descrição */}
        <div className="filtro-grupo">
          <label>Descrição</label>
          <input
            type="text"
            name="descricao"
            placeholder="Buscar..."
            value={filtros.descricao}
            onChange={(e) => handleChange('descricao', e.target.value)}
          />
        </div>
      </div>

      {/* REMOVIDO: Botão "Buscar" - agora filtra automaticamente */}
    </div>
  );
}

export default Filtros;