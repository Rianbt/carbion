
import React from 'react';
import { Link } from 'react-router-dom';
import './headerLogado.css';

export default function headerLogado() {
  return (
      <header>
        <a href="#"><img src="/Images/logo.png" alt="" className="logo" /></a>
        <nav className="headerItens">
            <Link to="/"><a>HOME</a></Link>
          
          <a href="#">MINHA EMPRESA</a>
          <a href="#">CONTATO</a>
        </nav>
        </header>
        )
        }