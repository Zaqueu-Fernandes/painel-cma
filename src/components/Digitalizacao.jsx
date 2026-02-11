import { useState, useEffect } from 'react';
import { buscarDadosBase } from '../services/supabase';
import Filtros from './Filtros';
import Cards from './Cards';
import Tabela from './Tabela';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// CORREÇÃO: Recebe filtros do Dashboard e aplica automaticamente (Problemas 8 e 9)
function Digitalizacao({ fazerLogout, filtros, setFiltros }) {
  const [dados, setDados] = useState([]);
  const [totais, setTotais] = useState({
    receitas: 0,
    despesaBruta: 0,
    deducoes: 0,
    despesaLiquida: 0
  });
  const [loading, setLoading] = useState(true);
  const [semDados, setSemDados] = useState(false);

  // CORREÇÃO: Aplicar filtros automaticamente quando mudarem (Problema 9)
  useEffect(() => {
    carregarDados();
  }, [filtros]);

  const carregarDados = async () => {
    setLoading(true);
    setSemDados(false);

    try {
      const resultado = await buscarDadosBase(filtros);

      if (resultado.sucesso) {
        setDados(resultado.dados);
        setTotais(resultado.totais);
        
        if (resultado.dados.length === 0) {
          setSemDados(true);
        }
      } else {
        setSemDados(true);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setSemDados(true);
    } finally {
      setLoading(false);
    }
  };

  const exportarPDF = () => {
    const doc = new jsPDF('landscape');

    // Cabeçalho
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Câmara Municipal de Araripe', 148, 15, { align: 'center' });

    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text('Relatório de Digitalização', 148, 23, { align: 'center' });

    doc.setLineWidth(0.5);
    doc.line(14, 28, 283, 28);

    // Preparar dados para tabela
    const dadosTabela = dados.map((item) => [
      new Date(item.data).toLocaleDateString('pt-BR'),
      item.doc_caixa || '-',
      item.natureza || '-',
      item.categoria || '-',
      item.credor || '-',
      formatarMoeda(item.receitas),
      formatarMoeda(item.despesa_bruta),
      formatarMoeda(item.deducoes),
      formatarMoeda(item.despesa_liquida)
    ]);

    // Adicionar tabela
    doc.autoTable({
      head: [
        [
          'Data',
          'Doc',
          'Natureza',
          'Categoria',
          'Credor',
          'Receitas',
          'Desp. Bruta',
          'Deduções',
          'Desp. Líquida'
        ]
      ],
      body: dadosTabela,
      startY: 32,
      theme: 'grid',
      headStyles: { fillColor: [45, 80, 22] },
      styles: { fontSize: 8 }
    });

    // Rodapé
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.line(14, 195, 283, 195);
      doc.text(
        'Copyright © 2026 | Zaqueu Fernandes | Suporte: 88 9 9401-4262',
        148,
        202,
        { align: 'center' }
      );
    }

    doc.save(`relatorio-digitalizacao-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor || 0);
  };

  return (
    <div className="container-painel">
      {/* CORREÇÃO: Passa filtros e setFiltros como props */}
      <Filtros
        filtros={filtros}
        setFiltros={setFiltros}
        fazerLogout={fazerLogout}
      />

      <Cards totais={totais} />

      {loading && (
        <div className="loading-container">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Buscando dados na base...</p>
        </div>
      )}

      {!loading && semDados && (
        <div className="loading-container">
          <i className="fas fa-inbox" style={{ color: '#cbd5e0' }}></i>
          <p>Nenhum dado encontrado na base</p>
        </div>
      )}

      {!loading && !semDados && (
        <>
          <div className="tabela-header">
            <h3>
              <i className="fas fa-table"></i> Registros ({dados.length})
            </h3>
            <button onClick={exportarPDF} className="btn-export">
              <i className="fas fa-file-pdf"></i> Exportar PDF
            </button>
          </div>
          <Tabela dados={dados} />
        </>
      )}
    </div>
  );
}

export default Digitalizacao;