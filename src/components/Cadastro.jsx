import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cadastrarUsuario, formatarTelefone, validarTelefone } from '../services/supabase';

function Cadastro() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    cargo: '',
    senha: ''
  });
  const [erros, setErros] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Formatar telefone automaticamente
    if (name === 'telefone') {
      const formatado = formatarTelefone(value);
      setFormData({ ...formData, [name]: formatado });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    
    // Limpar erro do campo ao digitar
    if (erros[name]) {
      setErros({ ...erros, [name]: '' });
    }
  };

  const validarFormulario = () => {
    const novosErros = {};

    if (!formData.nome.trim()) {
      novosErros.nome = 'Nome é obrigatório';
    }

    if (!formData.email.trim()) {
      novosErros.email = 'E-mail é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      novosErros.email = 'E-mail inválido';
    }

    if (!formData.telefone.trim()) {
      novosErros.telefone = 'Telefone é obrigatório';
    } else if (!validarTelefone(formData.telefone)) {
      novosErros.telefone = 'Telefone inválido. Insira o DDD + O Número 9 + seu número (XX)9XXXXXXXX';
    }

    if (!formData.cargo.trim()) {
      novosErros.cargo = 'Cargo é obrigatório';
    }

    if (!formData.senha.trim()) {
      novosErros.senha = 'Senha é obrigatória';
    } else if (formData.senha.length < 6) {
      novosErros.senha = 'Senha deve ter no mínimo 6 caracteres';
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) {
      mostrarModal('info', 'Atenção', 'Preencha todos os campos corretamente');
      return;
    }

    setLoading(true);

    try {
      const resultado = await cadastrarUsuario(formData);

      if (resultado.sucesso) {
        navigate('/confirmacao');
      } else {
        if (resultado.mensagem === 'EMAIL_EXISTE') {
          mostrarModal(
            'erro',
            'E-mail já cadastrado',
            'O e-mail informado já está sendo usado. Entre em contato com o suporte caso tenha esquecido seus dados.'
          );
        } else {
          mostrarModal('erro', 'Erro', resultado.mensagem);
        }
      }
    } catch (error) {
      console.error('Erro no cadastro:', error);
      mostrarModal('erro', 'Erro', 'Erro ao realizar cadastro');
    } finally {
      setLoading(false);
    }
  };

  const mostrarModal = (tipo, titulo, mensagem) => {
    setModal({ tipo, titulo, mensagem });
  };

  const fecharModal = () => {
    setModal(null);
  };

  const abrirWhatsApp = () => {
    window.open('https://wa.me/5588994014262', '_blank');
  };

  return (
    <div className="tela-auth">
      <div className="auth-box">
        <div className="auth-icon" style={{ background: '#48bb78' }}>
          <i className="fas fa-user-plus"></i>
        </div>
        <h2>
          <i className="fas fa-user-plus"></i> Solicitar Cadastro
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="nome"
              placeholder="Nome Completo"
              value={formData.nome}
              onChange={handleChange}
              disabled={loading}
              className={erros.nome ? 'error' : ''}
            />
            {erros.nome && <p className="error-msg">{erros.nome}</p>}
          </div>

          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="E-mail"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              className={erros.email ? 'error' : ''}
            />
            {erros.email && <p className="error-msg">{erros.email}</p>}
          </div>

          <div className="form-group">
            <input
              type="tel"
              name="telefone"
              placeholder="(88) 9XXXXXXXX"
              value={formData.telefone}
              onChange={handleChange}
              disabled={loading}
              maxLength="15"
              className={erros.telefone ? 'error' : ''}
            />
            {erros.telefone && <p className="error-msg">{erros.telefone}</p>}
          </div>

          <div className="form-group">
            <input
              type="text"
              name="cargo"
              placeholder="Cargo ou Função"
              value={formData.cargo}
              onChange={handleChange}
              disabled={loading}
              className={erros.cargo ? 'error' : ''}
            />
            {erros.cargo && <p className="error-msg">{erros.cargo}</p>}
          </div>

          <div className="form-group">
            <input
              type="password"
              name="senha"
              placeholder="Defina uma senha"
              value={formData.senha}
              onChange={handleChange}
              disabled={loading}
              className={erros.senha ? 'error' : ''}
            />
            {erros.senha && <p className="error-msg">{erros.senha}</p>}
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Cadastrando...
              </>
            ) : (
              'Solicitar Acesso'
            )}
          </button>
        </form>

        <p className="link-auth">
          Já tem conta?{' '}
          <a onClick={() => navigate('/login')}>Voltar ao Login</a>
        </p>
      </div>

      {/* Modal */}
      {modal && (
        <div className="modal-overlay" onClick={fecharModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">
              {modal.tipo === 'info' && (
                <i className="fas fa-info-circle" style={{ color: '#f59e0b' }}></i>
              )}
              {modal.tipo === 'erro' && (
                <i className="fas fa-exclamation-circle" style={{ color: '#f56565' }}></i>
              )}
            </div>
            <h3 className="modal-title">{modal.titulo}</h3>
            <p className="modal-text">{modal.mensagem}</p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              {modal.tipo === 'erro' && (
                <button onClick={abrirWhatsApp} className="btn-whatsapp" style={{ padding: '10px 20px' }}>
                  <i className="fab fa-whatsapp"></i> WhatsApp
                </button>
              )}
              <button onClick={fecharModal} className="btn btn-primary">
                Voltar ao {modal.tipo === 'erro' ? 'login' : 'cadastro'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cadastro;