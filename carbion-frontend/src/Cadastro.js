import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from './firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

// optional: if you export firestore 'db' from ./firebase, uncomment below
// import { db } from './firebase';
// import { doc, setDoc } from 'firebase/firestore';

export default function Cadastro() {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const navigate = useNavigate();

  const friendlyError = (code, message) => {
    if (!code) return message || 'Erro desconhecido';
    if (code.includes('auth/email-already-in-use')) return 'E-mail já cadastrado.';
    if (code.includes('auth/invalid-email')) return 'E-mail inválido.';
    if (code.includes('auth/weak-password')) return 'Senha fraca. Use pelo menos 6 caracteres.';
    return message || code;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) return setError('Informe seu nome.');
    if (!email.trim()) return setError('Informe seu e-mail.');
    if (!password || password.length < 6) return setError('Senha precisa ter ao menos 6 caracteres.');

    setLoading(true);
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email.trim(), password);
      // atualiza displayName no Firebase Auth
      await updateProfile(userCred.user, { displayName: name.trim() });

      // opcional: salvar perfil no Firestore se exportou db
      // try {
      //   await setDoc(doc(db, 'users', userCred.user.uid), {
      //     name: name.trim(),
      //     email: email.trim(),
      //     createdAt: new Date().toISOString()
      //   });
      // } catch (e) {
      //   console.warn('Não foi possível salvar usuário no Firestore:', e);
      // }

      // navegar para dashboard
      navigate('/dashboard');
    } catch (err) {
      const code = err?.code || err?.message || '';
      setError(friendlyError(code, err?.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 520, margin: '32px auto', padding: 20, fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      <h2>Cadastre-se</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <label>
          Nome
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Seu nome"
            required
            style={{ width: '100%', padding: 8 }}
          />
        </label>

        <label>
          E-mail
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="email@exemplo.com"
            required
            style={{ width: '100%', padding: 8 }}
          />
        </label>

        <label>
          Senha
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Senha (mínimo 6 caracteres)"
            required
            style={{ width: '100%', padding: 8 }}
          />
        </label>

        <div style={{ display: 'flex', gap: 8 }}>
          <button type="submit" disabled={loading} style={{ padding: '10px 16px' }}>
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
          <button type="button" onClick={() => navigate('/login')} style={{ padding: '10px 16px' }}>
            Ir para login
          </button>
        </div>

        {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
      </form>
    </div>
  );
}

