import { useState, useEffect } from 'react';
import { buscarDadosGraficos } from '../services/supabase';
import Filtros from './Filtros';
import Graficos from './Graficos';
import jsPDF from 'jspdf';

// CORREÇÃO: Recebe filtros do Dashboard e aplica automaticamente (Problemas 8 e 9)
function AnaliseFinanceira({ fazerLogout, filtros, setFiltros }) {
  const [dadosGraficos, setDadosGraficos] = useState(null);
  const [loading, setLoading] = useState(true);
  const [semDados, setSemDados] = useState(false);

  // CORREÇÃO: Aplicar filtros automaticamente quando mudarem (Problema 9)
  useEffect(() => {
    carregarDadosGraficos();
  }, [filtros]);

  const carregarDadosGraficos = async () => {
    setLoading(true);
    setSemDados(false);

    try {
      const resultado = await buscarDadosGraficos(filtros);

      if (resultado.sucesso) {
        setDadosGraficos(resultado);
      } else {
        setSemDados(true);
      }
    } catch (error) {
      console.error('Erro ao carregar dados gráficos:', error);
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
    doc.text('Análise Financeira', 148, 23, { align: 'center' });

    doc.setLineWidth(0.5);
    doc.line(14, 28, 283, 28);

    // Resumo Financeiro
    let y = 40;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Resumo Financeiro:', 14, y);
    y += 10;

    doc.setFont('helvetica', 'normal');
    doc.text(`Receitas: ${formatarMoeda(dadosGraficos.totais.receitas)}`, 14, y);
    y += 8;
    doc.text(`Despesa Bruta: ${formatarMoeda(dadosGraficos.totais.despesaBruta)}`, 14, y);
    y += 8;
    doc.text(`Deduções: ${formatarMoeda(dadosGraficos.totais.deducoes)}`, 14, y);
    y += 8;
    doc.text(`Despesa Líquida: ${formatarMoeda(dadosGraficos.totais.despesaLiquida)}`, 14, y);
    y += 15;

    // Top 10 Credores
    doc.setFont('helvetica', 'bold');
    doc.text('Top 10 Credores:', 14, y);
    y += 10;

    doc.setFont('helvetica', 'normal');
    dadosGraficos.top10Credores.forEach(([credor, valor], index) => {
      doc.text(`${index + 1}. ${credor}: ${formatarMoeda(valor)}`, 14, y);
      y += 8;
      if (y > 180) {
        doc.addPage();
        y = 20;
      }
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

    doc.save(`analise-financeira-${new Date().toISOString().split('T')[0]}.pdf`);
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

      {loading && (
        <div className="loading-container">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Gerando gráficos...</p>
        </div>
      )}

      {!loading && semDados && (
        <div className="loading-container">
          <i className="fas fa-inbox" style={{ color: '#cbd5e0' }}></i>
          <p>Nenhum dado encontrado na base</p>
        </div>
      )}

      {!loading && !semDados && dadosGraficos && (
        <>
          <div className="tabela-header">
            <h3>
              <i className="fas fa-chart-pie"></i> Análise Gráfica
            </h3>
            <button onClick={exportarPDF} className="btn-export">
              <i className="fas fa-file-pdf"></i> Exportar PDF
            </button>
          </div>
          <Graficos dadosGraficos={dadosGraficos} />
        </>
      )}
    </div>
  );
}

export default AnaliseFinanceira;