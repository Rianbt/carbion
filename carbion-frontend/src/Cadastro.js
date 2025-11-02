import React, { useState } from 'react';
import './Login.css'; // Reutilizando o CSS do Login (assumindo que é compartilhado)
import { useNavigate } from 'react-router-dom';
import { auth } from './firebase'; // Importe a configuração do Firebase (mesma do Login)
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'; // Adicionado updateProfile à importação

const API_URL = 'http://localhost:3001';

export default function Cadastro() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setMsg('');
    
    // Validações básicas (mantidas)
    if (!name || !email || !password || !confirmPassword) {
      setMsg('Todos os campos são obrigatórios');
      return;
    }

    if (password !== confirmPassword) {
      setMsg('As senhas não conferem');
      return;
    }

    setLoading(true);

    try {
      // Registro via Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Opcional: Atualizar displayName no Firebase
      await updateProfile(userCredential.user, { displayName: name });
      
      setMsg('Cadastro realizado com sucesso!');
      // Limpa os campos após cadastro bem-sucedido
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      // Navegue para login após sucesso
      setTimeout(() => navigate('/login'), 2000); // Delay para mostrar mensagem
    } catch (err) {
      setMsg('Erro ao realizar cadastro: ' + err.message);
    }
    
    setLoading(false);
  };

  const handleGoBack = () => {
    navigate(-1); // Volta para a página anterior
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: "url('/images/login.jpg') no-repeat center center",
        backgroundSize: 'cover',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      {/* Botão de voltar */}
      <button 
        onClick={handleGoBack}
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backdropFilter: 'blur(5px)',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
          e.target.style.transform = 'scale(1.1)';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
          e.target.style.transform = 'scale(1)';
        }}
      >
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="white" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
      </button>

      <div className="wrapper">
        <h1>Cadastro Carbion</h1>
        <form onSubmit={handleRegister}>
          <div className="input-box">
            <input
              className="input"
              placeholder="Nome completo"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
            <i className="fa fa-user" aria-hidden="true"></i>
          </div>
          
          <div className="input-box">
            <input
              className="input"
              placeholder="E-mail"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <i className="fa fa-envelope" aria-hidden="true"></i>
          </div>
          
          <div className="input-box">
            <input
              className="input"
              placeholder="Senha"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <i className="fa fa-lock" aria-hidden="true"></i>
          </div>
          
          <div className="input-box">
            <input
              className="input"
              placeholder="Confirmar senha"
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
            />
            <i className="fa fa-lock" aria-hidden="true"></i>
          </div>
          
          <button type="submit" className="btn" disabled={loading}>
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
          
          <div style={{ 
            color: msg === 'Cadastro realizado com sucesso!' ? 'green' : 'red', 
            marginTop: 10, 
            textAlign: 'center' 
          }}>
            {msg}
          </div>
          
          <div className="register-link">
            <p>Já tem conta? <a href="/login">Faça login</a></p>
          </div>
        </form>
      </div>
    </div>
  );
}
