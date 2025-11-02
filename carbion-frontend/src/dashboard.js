import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from './firebase'; // adicionado para obter displayName
import { FiTrendingUp, FiFeather, FiCpu, FiUser } from 'react-icons/fi';

const dashboardStyle = {
  fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  backgroundColor: '#f4f1de',
  minHeight: '100vh',
  padding: '2rem',
  color: '#233d2b',
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '1.75rem',
};

const greetingStyle = {
  fontSize: '1.6rem',
  fontWeight: 700,
};

const subTextStyle = {
  marginTop: '0.3rem',
  fontWeight: 500,
  color: '#6b705c',
};

const optionsContainer = {
  display: 'flex',
  justifyContent: 'center',
  gap: '1.5rem',
  flexWrap: 'wrap',
  marginTop: '2rem',
};

const optionCard = {
  background: 'linear-gradient(180deg, #ffffff 0%, #f6fff6 100%)',
  borderRadius: '14px',
  padding: '1.35rem 1.25rem',
  width: '280px',
  cursor: 'pointer',
  boxShadow: '0 8px 30px rgba(20,60,40,0.08)',
  transition: 'transform 0.22s ease, box-shadow 0.22s ease',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  border: '1px solid rgba(34,61,43,0.06)',
};

const optionCardHover = {
  transform: 'translateY(-10px) scale(1.02)',
  boxShadow: '0 18px 46px rgba(18,60,40,0.14)',
};

const optionIcon = {
  width: '78px',
  height: '78px',
  borderRadius: '18px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(135deg, rgba(43,120,87,0.12), rgba(76,175,80,0.06))',
  boxShadow: 'inset 0 -6px 14px rgba(43,120,87,0.03)',
};

const optionTitle = {
  marginTop: '12px',
  fontWeight: 700,
  fontSize: '1.05rem',
  color: '#143b2a',
};

const statsArea = {
  display: 'flex',
  gap: '1rem',
  flexWrap: 'wrap',
  alignItems: 'stretch',
};

const statCard = {
  flex: '1 1 240px',
  minWidth: '220px',
  background: 'linear-gradient(180deg,#fff 0%, #f7fff7 100%)',
  borderRadius: '12px',
  padding: '1rem 1.25rem',
  boxShadow: '0 8px 28px rgba(20,60,40,0.06)',
  border: '1px solid rgba(26,43,35,0.04)',
};

const statValueMain = {
  fontSize: '1.35rem',
  fontWeight: 800,
  color: '#133a2a',
};

const statLabel = {
  fontSize: '0.9rem',
  color: '#5f6b5f',
  marginTop: '0.35rem',
};

const chartWrap = {
  marginTop: '1rem',
  padding: '12px',
  borderRadius: '10px',
  background: 'linear-gradient(180deg,#ffffff, #f3fff3)',
  boxShadow: 'inset 0 -10px 30px rgba(34,61,43,0.02)',
};

function Sparkline({ data = [], color = '#2f8a57' }) {
  if (!data.length) return <div style={{ height: 60 }} />;
  const w = 300, h = 60, pad = 6;
  const vals = data.map(d => typeof d.emissoes === 'number' ? d.emissoes : parseFloat(d.emissoes) || 0);
  const max = Math.max(...vals);
  const min = Math.min(...vals);
  const range = max - min || 1;
  const step = (w - pad * 2) / (vals.length - 1 || 1);
  const points = vals.map((v, i) => {
    const x = pad + i * step;
    const y = pad + (1 - (v - min) / range) * (h - pad * 2);
    return `${x},${y}`;
  }).join(' ');
  const areaPoints = `M${pad},${h - pad} ` + vals.map((v, i) => {
    const x = pad + i * step;
    const y = pad + (1 - (v - min) / range) * (h - pad * 2);
    return `${x},${y}`;
  }).join(' ') + ` L${w - pad},${h - pad} Z`;
  return (
    <svg width={w} height={h} style={{ display: 'block' }}>
      <path d={areaPoints} fill={color} opacity="0.08" />
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {vals.map((v, i) => {
        const x = pad + i * step;
        const y = pad + (1 - (v - min) / range) * (h - pad * 2);
        return <circle key={i} cx={x} cy={y} r={2.5} fill={color} />;
      })}
    </svg>
  );
}

function Dashboard() {
  const [hoverIndex, setHoverIndex] = React.useState(null);
  const [chartData, setChartData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [username, setUsername] = React.useState(''); // mover para estado local
  const navigate = useNavigate();

  React.useEffect(() => {
    // tenta obter nome do usuário no Firebase Auth
    const u = auth.currentUser;
    if (u) {
      const name = u.displayName || (u.email ? u.email.split('@')[0] : 'Usuário');
      setUsername(name);
    } else {
      // se não autenticado, redireciona para login
      navigate('/login');
    }
  }, [navigate]);

  const options = [
    { id: 1, title: 'Calculadora ROI', icon: <FiTrendingUp size={34} color="#2f8a57" />, route: '/calculadoraRoi' },
    { id: 2, title: 'Calculadora Pegada de Carbono', icon: <FiFeather size={34} color="#2f8a57" />, route: '/calculadoraCarbono' },
    { id: 3, title: 'Análise de Dados', icon: <FiCpu size={34} color="#2f8a57" />, route: '/nossaIA' },
  ];

  React.useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const user = auth.currentUser;
        if (!user) {
          navigate('/login');
          return;
        }
        const token = await user.getIdToken();
        const res = await fetch('http://localhost:3001/api/chart-data', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Falha ao buscar dados');
        const data = await res.json();
        if (mounted) {
          const normalized = data.map(d => ({ mes: d.mes, emissoes: Number(d.emissoes) || 0 }))
            .sort((a, b) => new Date(a.mes) - new Date(b.mes));
          setChartData(normalized);
        }
      } catch {
        setError('Não foi possível carregar os dados. Faça login e tente novamente.');
      } finally {
        setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [navigate]);

  const totalEmissions = chartData.reduce((s, item) => s + (Number(item.emissoes) || 0), 0).toFixed(2);
  const latest = chartData.length ? chartData[chartData.length - 1].emissoes : 0;
  const previous = chartData.length > 1 ? chartData[chartData.length - 2].emissoes : latest;
  const changePercent = previous ? (((latest - previous) / Math.abs(previous)) * 100).toFixed(1) : '0.0';

  const handleOptionClick = (route) => {
    navigate(route);
  };

return (
  <div style={dashboardStyle}>
    <header style={headerStyle}>
      <div>
        <p style={greetingStyle}>Olá {username} <span role="img" aria-label="wave">👋</span></p>
        <p style={subTextStyle}>Painel — controle inteligente</p>
        <small style={{ color: '#6b705c', fontWeight: 600 }}>Carbion • Insights</small>
      </div>
      <div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          backgroundColor: '#e9f5ec',
          padding: '0.5rem 0.75rem',
          borderRadius: '10px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
        }}>
          <FiUser size={20} color="#2f8a57" />
          <span style={{ fontWeight: 600, color: '#2f8a57' }}>{username}</span>
        </div>
      </div>
    </header>


      <section style={statsArea}>
        <div style={statCard}>
          <div style={statValueMain}>{loading ? '—' : `${totalEmissions} tCO₂e`}</div>
          <div style={statLabel}>Emissões registradas (histórico)</div>
          <div style={chartWrap}>
            {loading ? <div style={{ height: 60 }} /> : <Sparkline data={chartData} color="#2f8a57" />}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
              <small style={{ color: '#5f6b5f' }}>Último: {latest} t</small>
              <small style={{ color: changePercent >= 0 ? '#bb3e03' : '#1b8a4a' }}>{changePercent}%</small>
            </div>
          </div>
        </div>

        <div style={statCard}>
          <div style={statValueMain}>Projetos ativos: 6</div>
          <div style={statLabel}>Status dos projetos</div>
          <div style={{ marginTop: 12 }}>
            <small style={{ color: '#5f6b5f' }}>Veja ideias, relatórios e histórico de ações.</small>
          </div>
        </div>

        <div style={statCard}>
          <div style={statValueMain}>Redução projetada: 18%</div>
          <div style={statLabel}>Meta média por portfólio</div>
          <div style={{ marginTop: 12 }}>
            <small style={{ color: '#5f6b5f' }}>A IA sugere ações com base no histórico.</small>
          </div>
        </div>
      </section>

      <section style={{ marginTop: 24 }}>
        <div style={optionsContainer}>
          {options.map((option, index) => (
            <div
              key={option.id}
              style={{
                ...optionCard,
                ...(hoverIndex === index ? optionCardHover : {}),
              }}
              onClick={() => handleOptionClick(option.route)}
              onMouseEnter={() => setHoverIndex(index)}
              onMouseLeave={() => setHoverIndex(null)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter') handleOptionClick(option.route); }}
            >
              <div style={optionIcon}>{option.icon}</div>
              <div style={optionTitle}>{option.title}</div>
              <small style={{ color: '#6b705c', marginTop: 8 }}>Clique para abrir</small>
            </div>
          ))}
        </div>
      </section>

      {error && (
        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          backgroundColor: '#ffe5e5',
          color: '#a94442',
          borderRadius: '10px',
          fontWeight: 600,
          textAlign: 'center'
        }}>
          {error}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
