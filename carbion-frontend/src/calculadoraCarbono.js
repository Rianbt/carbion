import React from 'react';
import { auth } from './firebase';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiZap, FiAlertCircle } from 'react-icons/fi';

export default function CalculadoraCarbono() {
  const [energy, setEnergy] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState(null);
  const [error, setError] = React.useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const user = auth.currentUser;
      if (!user) return navigate('/login');
      const token = await user.getIdToken();
      const res = await fetch('http://localhost:3001/api/carbon-footprint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ energy: Number(energy) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.msg || data?.error || 'Erro');
      setResult(data);
    } catch (err) {
      setError(err.message || 'Erro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      padding: '40px',
      maxWidth: '600px',
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
        <FiArrowLeft /> Voltar
      </button>

      <h2 style={{ fontSize: '26px', marginBottom: '12px', color: '#111827' }}>
        <FiZap style={{ marginRight: '8px' }} /> Calculadora Pegada de Carbono
      </h2>
      <p style={{ fontSize: '16px', marginBottom: '24px', color: '#4b5563' }}>
        Insira o consumo de energia (kWh) para estimar emissões de CO₂ com base nos dados da Climatiq.
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <input
          value={energy}
          onChange={e => setEnergy(e.target.value)}
          placeholder="kWh"
          required
          type="number"
          min="0"
          step="any"
          style={{
            padding: '12px',
            borderRadius: '10px',
            border: '1px solid #d1d5db',
            fontSize: '16px',
            width: '120px',
            backgroundColor: '#fff',
            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)'
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '12px 20px',
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
          {loading ? 'Calculando...' : 'Calcular'}
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
          <FiAlertCircle /> {error}
        </div>
      )}

      {result && (
        <div style={{
          marginTop: '32px',
          backgroundColor: '#ffffff',
          padding: '20px',
          borderRadius: '14px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
        }}>
          <h3 style={{ marginBottom: '8px', color: '#2563eb', fontSize: '20px' }}>
            Estimativa de CO₂: <strong>{result.co2e} tCO₂e</strong>
          </h3>
          <small style={{ color: '#6b7280' }}>
            Resultado salvo no seu histórico. PowerBI pode consumir via <code>/api/chart-data</code>.
          </small>
        </div>
      )}
    </div>
  );
}
