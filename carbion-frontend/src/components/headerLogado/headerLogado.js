<<<<<<< HEAD
import React from 'react';
import { Link } from 'react-router-dom';
import './headerLogado.css';

export default function HeaderLogado() {
  return (
      <header>
        <Link to="/"><img src="/Images/logo.png" alt="" className="logo" /></Link>
        <nav className="headerItens">
            <Link to="/" className="headerItem">HOME</Link>
            <Link to="/cadastro" className="headerItem">CADASTRE-SE</Link>
            <Link to="/login" className="headerItem">LOGIN</Link>
            <a href="#" className="headerItem">MINHA EMPRESA</a>
            <a href="#" className="headerItem">CONTATO</a>
        </nav>
      </header>
  );
}
=======

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
>>>>>>> 1a3512bf17d9afa5dfcbd7899836122f5e9f0eb3
