import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

// ========================================
// CADASTRAR USUÁRIO — Supabase
// (Migrado do Google Sheets)
// ========================================
export async function cadastrarUsuario(dados) {
  try {
    // Verificar se email já existe
    const { data: existente } = await supabase
      .from('usuarios')
      .select('email')
      .eq('email', dados.email.trim().toLowerCase())
      .single();

    if (existente) {
      return { sucesso: false, mensagem: 'EMAIL_EXISTE' };
    }

    // Inserir novo usuário com status False
    const { error } = await supabase
      .from('usuarios')
      .insert([{
        nome: dados.nome,
        email: dados.email.trim().toLowerCase(),
        telefone: dados.telefone,
        cargo: dados.cargo,
        senha: dados.senha,
        status: false
      }]);

    if (error) throw error;

    return { sucesso: true, mensagem: 'Cadastro realizado com sucesso!' };
  } catch (erro) {
    console.error('Erro ao cadastrar usuário:', erro);
    return { sucesso: false, mensagem: erro.message || 'Erro ao cadastrar usuário' };
  }
}

// ========================================
// VALIDAR TELEFONE — aceita qualquer DDD
// ========================================
export function validarTelefone(telefone) {
  const numeros = telefone.replace(/\D/g, '');
  // Qualquer DDD (11-99) + 9 + 8 dígitos = 11 dígitos
  const regex = /^[1-9]{2}9\d{8}$/;
  return regex.test(numeros);
}

// ========================================
// FORMATAR TELEFONE
// ========================================
export function formatarTelefone(valor) {
  const numeros = valor.replace(/\D/g, '');

  if (numeros.length === 0) return '';
  if (numeros.length <= 2) return `(${numeros}`;
  if (numeros.length <= 3) return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
  if (numeros.length <= 7) return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 3)}${numeros.slice(3)}`;
  return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 3)}${numeros.slice(3, 7)}-${numeros.slice(7, 11)}`;
}

// ========================================
// BUSCAR DADOS DA TABELA BASE
// ========================================
export async function buscarDadosBase(filtros = {}) {
  try {
    let query = supabase
      .from('base')
      .select('data, doc_caixa, natureza, categoria, credor, descricao, receitas, despesa_bruta, deducoes, despesa_liquida, processo')
      .order('data', { ascending: true });

    if (filtros.dataInicial && filtros.dataFinal) {
      query = query
        .gte('data', filtros.dataInicial)
        .lte('data', filtros.dataFinal);
    } else if (filtros.mes && filtros.ano) {
      const mesNum = String(filtros.mes).padStart(2, '0');
      const anoNum = String(filtros.ano);
      const dataInicio = `${anoNum}-${mesNum}-01`;

      let proximoMes = parseInt(filtros.mes) + 1;
      let proximoAno = parseInt(filtros.ano);

      if (proximoMes > 12) {
        proximoMes = 1;
        proximoAno += 1;
      }

      const dataFim = `${proximoAno}-${String(proximoMes).padStart(2, '0')}-01`;

      query = query
        .gte('data', dataInicio)
        .lt('data', dataFim);
    } else if (filtros.ano && !filtros.mes) {
      // Filtro só por ano
      const dataInicio = `${filtros.ano}-01-01`;
      const dataFim = `${parseInt(filtros.ano) + 1}-01-01`;
      query = query
        .gte('data', dataInicio)
        .lt('data', dataFim);
    }

    if (filtros.natureza && filtros.natureza !== 'TODOS') {
      query = query.eq('natureza', filtros.natureza);
    }
    if (filtros.categoria) {
      query = query.eq('categoria', filtros.categoria);
    }
    if (filtros.credor) {
      query = query.eq('credor', filtros.credor);
    }
    if (filtros.docCaixa) {
      query = query.ilike('doc_caixa', `%${filtros.docCaixa}%`);
    }
    if (filtros.descricao) {
      query = query.ilike('descricao', `%${filtros.descricao}%`);
    }

    // Buscar TODAS as linhas com paginação automática
    let allData = [];
    let from = 0;
    const pageSize = 1000;
    let hasMore = true;

    while (hasMore) {
      const { data, error } = await query.range(from, from + pageSize - 1);

      if (error) throw error;

      if (data && data.length > 0) {
        allData = allData.concat(data);
        from += pageSize;
        if (data.length < pageSize) hasMore = false;
      } else {
        hasMore = false;
      }
    }

    console.log(`✅ Total de registros carregados: ${allData.length}`);

    const totais = { receitas: 0, despesaBruta: 0, deducoes: 0, despesaLiquida: 0 };

    allData.forEach(item => {
      totais.receitas += parseFloat(item.receitas || 0);
      totais.despesaBruta += parseFloat(item.despesa_bruta || 0);
      totais.deducoes += parseFloat(item.deducoes || 0);
      totais.despesaLiquida += parseFloat(item.despesa_liquida || 0);
    });

    return { sucesso: true, dados: allData, totais };
  } catch (erro) {
    console.error('Erro ao buscar dados:', erro);
    return { sucesso: false, mensagem: erro.message };
  }
}

// ========================================
// BUSCAR ANOS DISPONÍVEIS NA BASE
// ========================================
export async function buscarAnosDisponiveis() {
  try {
    const { data, error } = await supabase
      .from('base')
      .select('data');

    if (error) throw error;

    const anos = [...new Set(
      data.map(item => new Date(item.data).getFullYear()).filter(a => !isNaN(a))
    )].sort((a, b) => b - a);

    return anos;
  } catch (erro) {
    console.error('Erro ao buscar anos:', erro);
    return [];
  }
}

// ========================================
// BUSCAR CATEGORIAS E CREDORES ÚNICOS
// ========================================
export async function buscarFiltrosDisponiveis() {
  try {
    const { data, error } = await supabase
      .from('base')
      .select('categoria, credor');

    if (error) throw error;

    const categorias = [...new Set(data.map(item => item.categoria).filter(Boolean))].sort();
    const credores = [...new Set(data.map(item => item.credor).filter(Boolean))].sort();

    return { categorias, credores };
  } catch (erro) {
    console.error('Erro ao buscar filtros:', erro);
    return { categorias: [], credores: [] };
  }
}

// ========================================
// DADOS PARA GRÁFICOS
// ========================================
export async function buscarDadosGraficos(filtros = {}) {
  try {
    const resultado = await buscarDadosBase(filtros);

    if (!resultado.sucesso || resultado.dados.length === 0) {
      return { sucesso: false };
    }

    const dados = resultado.dados;

    const despesasPorCategoria = {};
    dados.forEach(item => {
      if (item.natureza === 'DESPESA') {
        if (!despesasPorCategoria[item.categoria]) despesasPorCategoria[item.categoria] = 0;
        despesasPorCategoria[item.categoria] += parseFloat(item.despesa_liquida || 0);
      }
    });

    const evolucaoMensal = {};
    dados.forEach(item => {
      const data = new Date(item.data);
      const mesAno = `${String(data.getMonth() + 1).padStart(2, '0')}/${data.getFullYear()}`;
      if (!evolucaoMensal[mesAno]) evolucaoMensal[mesAno] = { receitas: 0, despesas: 0 };
      if (item.natureza === 'RECEITA') {
        evolucaoMensal[mesAno].receitas += parseFloat(item.receitas || 0);
      } else {
        evolucaoMensal[mesAno].despesas += parseFloat(item.despesa_liquida || 0);
      }
    });

    const despesasPorCredor = {};
    dados.forEach(item => {
      if (item.natureza === 'DESPESA') {
        if (!despesasPorCredor[item.credor]) despesasPorCredor[item.credor] = 0;
        despesasPorCredor[item.credor] += parseFloat(item.despesa_liquida || 0);
      }
    });

    const top10Credores = Object.entries(despesasPorCredor)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    return {
      sucesso: true,
      despesasPorCategoria,
      evolucaoMensal,
      top10Credores,
      totais: resultado.totais
    };
  } catch (erro) {
    console.error('Erro ao buscar dados para gráficos:', erro);
    return { sucesso: false };
  }
}
