import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './Landing';
import Login from './Login';
import Cadastro from './Cadastro';

import Dashboard from './dashboard';
import CalculadoraRoi from './calculadoraRoi';
import CalculadoraCarbono from './calculadoraCarbono'; // arquivo existente: calculadoraCarbonol.js
import Analise from './nossaIA'; // página de análise / IA



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/calculadoraRoi" element={<CalculadoraRoi />} />
        <Route path="/calculadoraCarbono" element={<CalculadoraCarbono />} />
        <Route path="/nossaIA" element={<Analise />} />
      </Routes>
    </Router>
  );
}

export default App;