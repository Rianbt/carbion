// CalculadoraRoi.js
import React from 'react';
import { auth } from './firebase';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiTrendingUp, FiAlertCircle } from 'react-icons/fi';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function CalculadoraRoi() {
  const [symbol, setSymbol] = React.useState('AAPL');
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState(null);
  const [error, setError] = React.useState('');

  const [manualInvestment, setManualInvestment] = React.useState('');
  const [manualReturn, setManualReturn] = React.useState('');
  const [manualResult, setManualResult] = React.useState(null);

  const navigate = useNavigate();

  // Função para consultar ROI via backend (Finnhub)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Usuário não autenticado');

      const token = await user.getIdToken();

      const res = await fetch(`http://localhost:3001/api/roi/${encodeURIComponent(symbol)}`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (!res.ok) {
        let msg = 'Erro ao consultar ROI';
        try {
          const errData = await res.json();
          if (errData.msg) msg = errData.msg;
        } catch (_) {}
        throw new Error(msg);
      }

      const data = await res.json();

      // Normaliza dados para gráfico
      const chartData = data.data.map((price, index) => ({
        day: index + 1,
        price,
        roi: ((price - data.first) / data.first) * 100,
      }));

      setResult({ ...data, chartData });

    } catch (err) {
      setError(err.message || 'Erro ao consultar ROI');
    } finally {
      setLoading(false);
    }
  };

  // Função para calcular ROI manual
  const handleManualCalculate = (e) => {
    e.preventDefault();
    setManualResult(null);

    const invest = parseFloat(manualInvestment.replace(',', '.'));
    const ret = parseFloat(manualReturn.replace(',', '.'));

    if (isNaN(invest) || isNaN(ret) || invest <= 0) {
      setManualResult('Valores inválidos');
      return;
    }

    const roi = ((ret - invest) / invest) * 100;
    setManualResult(roi.toFixed(2));
  };

  return (
    <div style={{
      padding: '40px',
      maxWidth: '900px',
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

      {/* ROI via Finnhub */}
      <h2 style={{ fontSize: '26px', marginBottom: '12px', color: '#111827', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <FiTrendingUp /> Calculadora ROI - Ações
      </h2>
      <p style={{ fontSize: '16px', marginBottom: '24px', color: '#4b5563' }}>
        Insira o código da ação ou ativo para obter o ROI simples e ajustado pelo tempo.
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <input
          value={symbol}
          onChange={e => setSymbol(e.target.value.toUpperCase())}
          required
          placeholder="Ex: AAPL"
          style={{
            padding: '12px',
            borderRadius: '10px',
            border: '1px solid #d1d5db',
            fontSize: '16px',
            width: '140px',
            backgroundColor: '#fff',
            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)'
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '12px 20px',
            backgroundColor: loading ? '#9ca3af' : '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background 0.3s ease'
          }}
        >
          {loading ? 'Carregando...' : 'Consultar'}
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
          <h3 style={{ marginBottom: '8px', color: '#10b981', fontSize: '20px' }}>
            ROI Simples: <strong>{result.roiSimple}%</strong> | ROI Ajustado: <strong>{result.roiAdjusted}%</strong>
          </h3>
          <p style={{ color: '#374151', marginBottom: '16px' }}>
            Preço inicial: {result.first} | Preço final: {result.last} | Período: {result.years} anos | Taxa: {result.rate}%
          </p>

          {/* Gráfico de preços e ROI cumulativo */}
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={result.chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" label={{ value: 'Dia', position: 'insideBottomRight', offset: -5 }} />
              <YAxis yAxisId="left" label={{ value: 'Preço', angle: -90, position: 'insideLeft' }} />
              <YAxis yAxisId="right" orientation="right" label={{ value: 'ROI %', angle: 90, position: 'insideRight' }} />
              <Tooltip />
              <Legend verticalAlign="top" />
              <Line yAxisId="left" type="monotone" dataKey="price" stroke="#2563eb" name="Preço" dot={false} />
              <Line yAxisId="right" type="monotone" dataKey="roi" stroke="#10b981" name="ROI (%)" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <hr style={{ margin: '40px 0', borderColor: '#d1d5db' }} />

      {/* ROI Manual */}
      <h2 style={{ fontSize: '26px', marginBottom: '12px', color: '#111827', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <FiTrendingUp /> Calculadora ROI Manual
      </h2>
      <p style={{ fontSize: '16px', marginBottom: '24px', color: '#4b5563' }}>
        Insira valores de investimento e retorno para calcular o ROI manualmente.
      </p>

      <form onSubmit={handleManualCalculate} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <input
          value={manualInvestment}
          onChange={e => setManualInvestment(e.target.value)}
          required
          placeholder="Investimento"
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
        <input
          value={manualReturn}
          onChange={e => setManualReturn(e.target.value)}
          required
          placeholder="Retorno"
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
          style={{
            padding: '12px 20px',
            backgroundColor: '#10b981',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Calcular
        </button>
      </form>

      {manualResult && (
        <div style={{
          marginTop: '24px',
          backgroundColor: '#ffffff',
          padding: '16px',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          color: '#111827',
          fontWeight: '500'
        }}>
          ROI Manual: <strong>{manualResult}%</strong>
        </div>
      )}
    </div>
  );
}
