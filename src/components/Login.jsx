import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';

function Login({ setUsuario }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [modal, setModal] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');

    if (!email || !senha) {
      mostrarModal('info', 'Atenção', 'Preencha todos os campos');
      return;
    }

    setLoading(true);

    try {
      // Buscar usuário no Supabase
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('email', email)
        .eq('senha', senha)
        .single();

      if (error || !data) {
        mostrarModal(
          'erro',
          'Erro de Autenticação',
          'E-mail ou Senha Incorretos. Entre em contato com o suporte caso tenha esquecido seus dados.'
        );
        setLoading(false);
        return;
      }

      // Verificar status
      if (data.status === 'PENDENTE') {
        mostrarModal(
          'pendente',
          'Cadastro pendente de aprovação',
          'Seu cadastro está aguardando liberação. Entre em contato com o suporte para agilizar.'
        );
        setLoading(false);
        return;
      }

      // Login bem-sucedido
      setUsuario(data);
      navigate('/dashboard');
      
    } catch (error) {
      console.error('Erro no login:', error);
      mostrarModal('erro', 'Erro', 'Erro ao conectar com o servidor');
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
        <div className="auth-icon">
          <i className="fas fa-lock"></i>
        </div>
        <h2>
          <i className="fas fa-lock"></i> Acesso ao Painel
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              disabled={loading}
            />
          </div>

          {erro && <p className="error-msg">{erro}</p>}

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Logando...
              </>
            ) : (
              'Entrar'
            )}
          </button>
        </form>

        <p className="link-auth">
          Não tem conta?{' '}
          <a onClick={() => navigate('/cadastro')}>Cadastre-se aqui</a>
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
              {modal.tipo === 'pendente' && (
                <i className="fas fa-clock" style={{ color: '#f59e0b' }}></i>
              )}
            </div>
            <h3 className="modal-title">{modal.titulo}</h3>
            <p className="modal-text">{modal.mensagem}</p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              {(modal.tipo === 'erro' || modal.tipo === 'pendente') && (
                <button onClick={abrirWhatsApp} className="btn-whatsapp" style={{ padding: '10px 20px' }}>
                  <i className="fab fa-whatsapp"></i> WhatsApp
                </button>
              )}
              <button onClick={fecharModal} className="btn btn-primary">
                {modal.tipo === 'info' ? 'OK' : 'Voltar ao login'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;