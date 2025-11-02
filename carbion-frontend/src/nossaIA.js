import React, { useState } from 'react';
import { auth } from './firebase';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export default function NossaIA() {
  const [prompt, setPrompt] = useState('');
  const [report, setReport] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setReport('');

    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Usuário não autenticado');

      // gera token para enviar ao backend
      const token = await user.getIdToken();
      console.log('Token obtido:', token ? 'Sim' : 'Não');

      const response = await fetch(`${API_URL}/api/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ prompt }),
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.msg || 'Erro no servidor');
      }

      const data = await response.json();
      setReport(data.report);

    } catch (err) {
      console.error('Erro completo:', err);
      setError(err.message || 'Erro ao comunicar com servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      padding: '40px',
      maxWidth: '800px',
      margin: '0 auto',
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      backgroundColor: '#f4f6f8',
      borderRadius: '16px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.08)'
    }}>
      <button
        onClick={() => navigate(-1)}
        style={{
          marginBottom: '24px',
          padding: '10px 20px',
          backgroundColor: '#1f2937',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          fontSize: '14px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        Voltar
      </button>

      <h2 style={{ fontSize: '28px', marginBottom: '12px', color: '#111827' }}>Nossa IA</h2>
      <p style={{ fontSize: '16px', marginBottom: '32px', color: '#4b5563' }}>
        Solicite um relatório ou sugestão para reduzir emissões de forma inteligente.
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <textarea
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="Descreva o que deseja..."
          rows={6}
          required
          style={{
            padding: '16px',
            borderRadius: '12px',
            border: '1px solid #d1d5db',
            fontSize: '16px',
            backgroundColor: '#fff',
            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)',
            resize: 'vertical'
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '12px 24px',
            backgroundColor: loading ? '#9ca3af' : '#10b981',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background 0.3s ease'
          }}
        >
          {loading ? 'Gerando...' : 'Gerar relatório'}
        </button>
      </form>

      {error && (
        <div style={{
          color: '#b91c1c',
          marginTop: '24px',
          fontWeight: '500',
          backgroundColor: '#fee2e2',
          padding: '12px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          {error}
        </div>
      )}

      {report && (
        <div style={{
          marginTop: '32px',
          backgroundColor: '#ffffff',
          padding: '24px',
          borderRadius: '16px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          whiteSpace: 'pre-wrap'
        }}>
          <h3 style={{ marginBottom: '16px', color: '#2563eb', fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            Relatório
          </h3>
          <div style={{ color: '#374151', lineHeight: '1.6' }}>{report}</div>
        </div>
      )}
    </div>
  );
}
