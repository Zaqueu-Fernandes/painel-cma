import { useNavigate } from 'react-router-dom';

function Confirmacao() {
  const navigate = useNavigate();

  const abrirWhatsApp = () => {
    window.open('https://wa.me/5588994014262', '_blank');
  };

  return (
    <div className="tela-confirmacao">
      <div className="check-circle">
        <i className="fas fa-check"></i>
      </div>
      <h2>Cadastro Concluído!</h2>
      <p>Cadastro pendente de aprovação</p>
      <p className="texto-pequeno">
        (entre em contato com o suporte para agilizar a liberação)
      </p>
      <button onClick={abrirWhatsApp} className="btn-whatsapp">
        <i className="fab fa-whatsapp"></i> Chamar no WhatsApp
      </button>
      <p className="link-voltar">
        <a onClick={() => navigate('/login')}>Voltar ao login</a>
      </p>
    </div>
  );
}

export default Confirmacao;