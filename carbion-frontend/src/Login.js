import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:3001';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMsg('');
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        setToken(data.token);
        setMsg('Login realizado com sucesso!');
      } else {
        setMsg(data.msg || 'Erro ao fazer login');
      }
    } catch (err) {
      setMsg('Erro de conexão com o servidor');
    }
    setLoading(false);
  };

  const handleLogout = () => {
    setToken('');
    setEmail('');
    setPassword('');
    setMsg('');
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
        <h1>Login Carbion</h1>
        {!token ? (
          <form onSubmit={handleLogin}>
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
            <button type="submit" className="btn" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
            <div style={{ color: msg === 'Login realizado com sucesso!' ? 'green' : 'red', marginTop: 10, textAlign: 'center' }}>{msg}</div>
            <div className="register-link">
              <p>Não tem conta? <a href="/cadastro">Cadastre-se</a></p>
            </div>
          </form>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: 'green' }}>Você está logado!</p>
            <button className="btn" onClick={handleLogout}>Sair</button>
          </div>
        )}
      </div>
    </div>
  );
}