import React from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';

export default function Home() {
  return (
    <div>
      <header>
        <a href="#"><img src="/Images/logo.png" alt="" className="logo" /></a>
        <nav className="headerItens">
          <a href="/">HOME</a>
          <a href="#">QUEM SOMOS</a>
          <a href="#">CONTATO</a>
          <a href="/cadastro">CADASTRE-SE</a>
        </nav>
        <Link to="/login"><input type="button" value="LOGIN" className="botaoLogin" /></Link>
      </header>

      <section className="sec1">
        <h1 className="title">CARBION</h1>
        <div className="botoes">
          <input type="button" className="saibaMais" value="saiba mais" />
          <input type="button" className="servicos" value=" serviços " />
        </div>
        <img src="/Images/infografico.png" alt="" />
        <hr className="section_divisor" />
      </section>

      <section className="sec2">
        <h1>Lorem</h1>
        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nam alias assumenda optio sapiente officiis exercitationem ratione, vel praesentium laboriosam aut qui totam voluptates autem porro. Velit dolore rem doloribus corporis! Lorem ipsum dolor sit amet consectetur, adipisicing elit. Illo magnam architecto, maiores ducimus nihil placeat veniam sed est, ratione exercitationem nam ad, ullam laudantium soluta! Atque laudantium aspernatur non! Vitae.</p>

        <div className="sec2_paragrafos_unidades">
          <hr className="mini_line_divisor" />
          <h2>Lorem</h2>
          <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Enim neque porro tempora nihil aut ipsum voluptatum tempore amet eum cum, sint numquam. Maxime totam consequatur ratione inventore sapiente libero aliquam! Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam, praesentium esse laboriosam recusandae commodi accusantium vitae enim, consequatur voluptate eos maxime ipsam fuga quis aspernatur consequuntur. Corporis commodi debitis assumenda.</p>
        </div>
        <div className="sec2_paragrafos_unidades">
          <hr className="mini_line_divisor" />
          <h2>Lorem</h2>
          <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Enim neque porro tempora nihil aut ipsum voluptatum tempore amet eum cum, sint numquam. Maxime totam consequatur ratione inventore sapiente libero aliquam! Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam, praesentium esse laboriosam recusandae commodi accusantium vitae enim, consequatur voluptate eos maxime ipsam fuga quis aspernatur consequuntur. Corporis commodi debitis assumenda.</p>
        </div>
        <div className="sec2_paragrafos_unidades">
          <hr className="mini_line_divisor" />
          <h2>Lorem</h2>
          <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Enim neque porro tempora nihil aut ipsum voluptatum tempore amet eum cum, sint numquam. Maxime totam consequatur ratione inventore sapiente libero aliquam! Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam, praesentium esse laboriosam recusandae commodi accusantium vitae enim, consequatur voluptate eos maxime ipsam fuga quis aspernatur consequuntur. Corporis commodi debitis assumenda.</p>
        </div>
        <img src="/Images/infografico.png" alt="teste" />
      </section>

      <section className="sec3">
        <hr className="section_divisor" />
        <div className="sec3_paragrafos_">
          <div className="sec3_paragrafos_unidade">
            <h3>Lorem</h3>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi rerum eius animi nostrum reprehenderit aperiam totam ab quas eligendi incidunt error ipsam hic vero, aspernatur architecto iusto, omnis accusantium optio!</p>
          </div>
          <div className="sec3_paragrafos_unidade">
            <h3>Lorem</h3>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi rerum eius animi nostrum reprehenderit aperiam totam ab quas eligendi incidunt error ipsam hic vero, aspernatur architecto iusto, omnis accusantium optio!</p>
          </div>
          <div className="sec3_paragrafos_unidade">
            <h3>Lorem</h3>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi rerum eius animi nostrum reprehenderit aperiam totam ab quas eligendi incidunt error ipsam hic vero, aspernatur architecto iusto, omnis accusantium optio!</p>
          </div>
        </div>
        <img src="/Images/logo.png" alt="paksnd" />
      </section>

      <section className="sec4">
        <hr className="section_divisor" />
        <div className="sec4_paragrafos_">
          <div className="sec4_paragrafos_unidade">
            <h3>lorem</h3>
            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nostrum, illo reiciendis illum voluptatibus possimus labore sequi repudiandae officia, eius nulla vel accusamus ullam quod cumque maxime dolorum sit qui atque.</p>
          </div>
          <div className="sec4_paragrafos_unidade">
            <h3>lorem</h3>
            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nostrum, illo reiciendis illum voluptatibus possimus labore sequi repudiandae officia, eius nulla vel accusamus ullam quod cumque maxime dolorum sit qui atque.</p>
          </div>
        </div>
      </section>

      <hr className="section_divisor" />

      <footer>
        <div>
          <img src="#" alt="a" />
          <div className="lista1_footer">
            <a href="#">Empresa</a>
            <a href="#">Sobre</a>
            <a href="#">Notícias</a>
            <a href="#">marca</a>
          </div>
          <div className="lista2_footer">
            <a href="#">Recursos</a>
            <a href="#">Suporte</a>
            <a href="#">Proteção</a>
            <a href="#">Comentários</a>
          </div>
          <div className="lista3_footer">
            <a href="#">Políica</a>
            <a href="#">Termos</a>
            <a href="#">Privacidade</a>
            <a href="#">Configurações de cookies</a>
            <a href="#">Diretrizes</a>
            <a href="#">Reconhecimentos</a>
            <a href="#">Licenças</a>
            <a href="#">Insformações da empresa</a>
          </div>
        </div>
        <h3>Social</h3>
        <div className="icons">
          <a href="#"><img src="insta" alt="Instagram" /></a>
          <a href="#"><img src="linkedin" alt="LinkedIn" /></a>
          <a href="#"><img src="discord" alt="Discord" /></a>
          <a href="#"><img src="email" alt="Email" /></a>
        </div>
        <h1>CARBION</h1>
      </footer>
    </div>
  );
}