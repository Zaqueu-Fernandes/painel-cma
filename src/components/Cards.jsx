function Cards({ totais }) {
  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor || 0);
  };

  return (
    <div className="cards-container">
      <div className="card-total receitas">
        <div className="card-icon">
          <i className="fas fa-arrow-up"></i>
        </div>
        <div className="card-info">
          <span className="card-label">RECEITAS</span>
          <span className="card-value">{formatarMoeda(totais.receitas)}</span>
        </div>
      </div>

      <div className="card-total despesas">
        <div className="card-icon">
          <i className="fas fa-arrow-down"></i>
        </div>
        <div className="card-info">
          <span className="card-label">DESPESA BRUTA</span>
          <span className="card-value">{formatarMoeda(totais.despesaBruta)}</span>
        </div>
      </div>

      <div className="card-total deducoes">
        <div className="card-icon">
          <i className="fas fa-minus"></i>
        </div>
        <div className="card-info">
          <span className="card-label">DEDUÇÕES</span>
          <span className="card-value">{formatarMoeda(totais.deducoes)}</span>
        </div>
      </div>

      <div className="card-total liquida">
        <div className="card-icon">
          <i className="fas fa-calculator"></i>
        </div>
        <div className="card-info">
          <span className="card-label">DESPESA LÍQUIDA</span>
          <span className="card-value">{formatarMoeda(totais.despesaLiquida)}</span>
        </div>
      </div>
    </div>
  );
}

export default Cards;