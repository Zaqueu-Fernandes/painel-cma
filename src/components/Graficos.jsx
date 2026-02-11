import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

function Graficos({ dadosGraficos }) {
  const chartPizzaRef = useRef(null);
  const chartLinhaRef = useRef(null);
  const chartColunasRef = useRef(null);
  const chartBarrasRef = useRef(null);

  const chartPizzaInstance = useRef(null);
  const chartLinhaInstance = useRef(null);
  const chartColunasInstance = useRef(null);
  const chartBarrasInstance = useRef(null);

  useEffect(() => {
    if (!dadosGraficos) return;

    // Destruir gráficos existentes
    if (chartPizzaInstance.current) chartPizzaInstance.current.destroy();
    if (chartLinhaInstance.current) chartLinhaInstance.current.destroy();
    if (chartColunasInstance.current) chartColunasInstance.current.destroy();
    if (chartBarrasInstance.current) chartBarrasInstance.current.destroy();

    criarGraficos();

    return () => {
      if (chartPizzaInstance.current) chartPizzaInstance.current.destroy();
      if (chartLinhaInstance.current) chartLinhaInstance.current.destroy();
      if (chartColunasInstance.current) chartColunasInstance.current.destroy();
      if (chartBarrasInstance.current) chartBarrasInstance.current.destroy();
    };
  }, [dadosGraficos]);

  const criarGraficos = () => {
    // 1. Gráfico Pizza - Despesas por Categoria
    const categorias = Object.keys(dadosGraficos.despesasPorCategoria);
    const valoresCategorias = Object.values(dadosGraficos.despesasPorCategoria);

    if (chartPizzaRef.current) {
      chartPizzaInstance.current = new Chart(chartPizzaRef.current, {
        type: 'pie',
        data: {
          labels: categorias,
          datasets: [
            {
              data: valoresCategorias,
              backgroundColor: [
                '#48bb78',
                '#4299e1',
                '#f59e0b',
                '#f56565',
                '#9f7aea',
                '#38b2ac',
                '#ed8936',
                '#fc8181',
                '#63b3ed',
                '#68d391'
              ]
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: {
              position: 'bottom'
            }
          }
        }
      });
    }

    // 2. Evolução Mensal - Linha
    const mesesOrdenados = Object.keys(dadosGraficos.evolucaoMensal).sort((a, b) => {
      const [mesA, anoA] = a.split('/');
      const [mesB, anoB] = b.split('/');
      return new Date(anoA, mesA - 1) - new Date(anoB, mesB - 1);
    });

    const receitasMensais = mesesOrdenados.map((m) => dadosGraficos.evolucaoMensal[m].receitas);
    const despesasMensais = mesesOrdenados.map((m) => dadosGraficos.evolucaoMensal[m].despesas);

    if (chartLinhaRef.current) {
      chartLinhaInstance.current = new Chart(chartLinhaRef.current, {
        type: 'line',
        data: {
          labels: mesesOrdenados,
          datasets: [
            {
              label: 'Receitas',
              data: receitasMensais,
              borderColor: '#48bb78',
              backgroundColor: 'rgba(72, 187, 120, 0.1)',
              tension: 0.3
            },
            {
              label: 'Despesas',
              data: despesasMensais,
              borderColor: '#f56565',
              backgroundColor: 'rgba(245, 101, 101, 0.1)',
              tension: 0.3
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: {
              position: 'bottom'
            }
          }
        }
      });
    }

    // 3. Receitas vs Despesas - Colunas
    if (chartColunasRef.current) {
      chartColunasInstance.current = new Chart(chartColunasRef.current, {
        type: 'bar',
        data: {
          labels: mesesOrdenados,
          datasets: [
            {
              label: 'Receitas',
              data: receitasMensais,
              backgroundColor: '#48bb78'
            },
            {
              label: 'Despesas',
              data: despesasMensais,
              backgroundColor: '#f56565'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: {
              position: 'bottom'
            }
          }
        }
      });
    }

    // 4. Top 10 Credores - Barras Horizontais
    const credoresTop = dadosGraficos.top10Credores.map((c) => c[0]);
    const valoresTop = dadosGraficos.top10Credores.map((c) => c[1]);

    if (chartBarrasRef.current) {
      chartBarrasInstance.current = new Chart(chartBarrasRef.current, {
        type: 'bar',
        data: {
          labels: credoresTop,
          datasets: [
            {
              label: 'Despesas',
              data: valoresTop,
              backgroundColor: '#4299e1'
            }
          ]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: {
              display: false
            }
          }
        }
      });
    }
  };

  return (
    <div className="graficos-grid">
      <div className="grafico-box">
        <h4>Despesas por Categoria</h4>
        <canvas ref={chartPizzaRef}></canvas>
      </div>

      <div className="grafico-box">
        <h4>Receitas vs Despesas</h4>
        <canvas ref={chartColunasRef}></canvas>
      </div>

      <div className="grafico-box grafico-wide">
        <h4>Evolução Mensal</h4>
        <canvas ref={chartLinhaRef}></canvas>
      </div>

      <div className="grafico-box grafico-wide">
        <h4>Top 10 Credores</h4>
        <canvas ref={chartBarrasRef}></canvas>
      </div>
    </div>
  );
}

export default Graficos;