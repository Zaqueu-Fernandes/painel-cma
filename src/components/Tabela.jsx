import { useState, useEffect } from 'react';

function Tabela({ dados }) {
  const [dadosOrdenados, setDadosOrdenados] = useState([]);
  const [ordenacao, setOrdenacao] = useState({ coluna: 'data', ordem: 'asc' });
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 20;

  useEffect(() => {
    ordenarDados(dados, ordenacao.coluna, ordenacao.ordem);
  }, [dados]);

  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor || 0);
  };

  const formatarData = (data) => {
    if (!data) return '-';
    const d = new Date(data);
    return d.toLocaleDateString('pt-BR');
  };

  const ordenarDados = (dados, coluna, ordem) => {
    const dadosClone = [...dados];
    
    dadosClone.sort((a, b) => {
      let valorA = a[coluna];
      let valorB = b[coluna];

      // Tratamento especial para datas
      if (coluna === 'data') {
        valorA = new Date(valorA);
        valorB = new Date(valorB);
      }

      if (ordem === 'asc') {
        return valorA > valorB ? 1 : -1;
      } else {
        return valorA < valorB ? 1 : -1;
      }
    });

    setDadosOrdenados(dadosClone);
    setPaginaAtual(1); // Resetar para primeira página ao ordenar
  };

  const handleOrdenar = (coluna) => {
    const novaOrdem = ordenacao.coluna === coluna && ordenacao.ordem === 'asc' ? 'desc' : 'asc';
    setOrdenacao({ coluna, ordem: novaOrdem });
    ordenarDados(dadosOrdenados, coluna, novaOrdem);
  };

  // Paginação
  const totalPaginas = Math.ceil(dadosOrdenados.length / itensPorPagina);
  const inicio = (paginaAtual - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;
  const dadosPagina = dadosOrdenados.slice(inicio, fim);

  const mudarPagina = (novaPagina) => {
    if (novaPagina >= 1 && novaPagina <= totalPaginas) {
      setPaginaAtual(novaPagina);
    }
  };

  const renderPaginacao = () => {
    if (totalPaginas <= 1) return null;

    const botoes = [];
    const maxBotoes = 5;
    let inicio = Math.max(1, paginaAtual - Math.floor(maxBotoes / 2));
    let fim = Math.min(totalPaginas, inicio + maxBotoes - 1);

    if (fim - inicio < maxBotoes - 1) {
      inicio = Math.max(1, fim - maxBotoes + 1);
    }

    return (
      <div className="paginacao">
        <button
          onClick={() => mudarPagina(paginaAtual - 1)}
          disabled={paginaAtual === 1}
        >
          <i className="fas fa-chevron-left"></i>
        </button>

        {inicio > 1 && (
          <>
            <button onClick={() => mudarPagina(1)}>1</button>
            {inicio > 2 && <span>...</span>}
          </>
        )}

        {Array.from({ length: fim - inicio + 1 }, (_, i) => inicio + i).map((num) => (
          <button
            key={num}
            onClick={() => mudarPagina(num)}
            className={paginaAtual === num ? 'active' : ''}
          >
            {num}
          </button>
        ))}

        {fim < totalPaginas && (
          <>
            {fim < totalPaginas - 1 && <span>...</span>}
            <button onClick={() => mudarPagina(totalPaginas)}>{totalPaginas}</button>
          </>
        )}

        <button
          onClick={() => mudarPagina(paginaAtual + 1)}
          disabled={paginaAtual === totalPaginas}
        >
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>
    );
  };

  return (
    <div>
      <div className="tabela-wrapper">
        <table>
          <thead>
            <tr>
              <th onClick={() => handleOrdenar('data')}>
                Data <i className="fas fa-sort"></i>
              </th>
              <th onClick={() => handleOrdenar('doc_caixa')}>
                Doc. Caixa <i className="fas fa-sort"></i>
              </th>
              <th onClick={() => handleOrdenar('natureza')}>
                Natureza <i className="fas fa-sort"></i>
              </th>
              <th onClick={() => handleOrdenar('categoria')}>
                Categoria <i className="fas fa-sort"></i>
              </th>
              <th onClick={() => handleOrdenar('credor')}>
                Credor <i className="fas fa-sort"></i>
              </th>
              <th onClick={() => handleOrdenar('descricao')}>
                Descrição <i className="fas fa-sort"></i>
              </th>
              <th>Receitas</th>
              <th>Desp. Bruta</th>
              <th>Deduções</th>
              <th>Desp. Líquida</th>
              <th>Processo</th>
            </tr>
          </thead>
          <tbody>
            {dadosPagina.map((item, index) => (
              <tr key={index}>
                <td>{formatarData(item.data)}</td>
                <td>{item.doc_caixa || '-'}</td>
                <td>{item.natureza || '-'}</td>
                <td>{item.categoria || '-'}</td>
                <td>{item.credor || '-'}</td>
                <td>{item.descricao || '-'}</td>
                <td>{formatarMoeda(item.receitas)}</td>
                <td>{formatarMoeda(item.despesa_bruta)}</td>
                <td>{formatarMoeda(item.deducoes)}</td>
                <td>{formatarMoeda(item.despesa_liquida)}</td>
                <td>
                  {item.processo ? (
                    <a
                      href={item.processo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-processo"
                    >
                      <i className="fas fa-paperclip"></i>
                    </a>
                  ) : (
                    '-'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {renderPaginacao()}
    </div>
  );
}

export default Tabela;