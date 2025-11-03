import React from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';
import { Link as ScrollLink } from "react-scroll";

export default function Home() {
  return (
    <div>
      <div className='container'>
      <header>
        <Link to="/"><img src="/Images/logo.png" alt="" className="logo" /></Link>
        <nav className="headerItens">
          <Link to="/" className='headerItem'>HOME</Link>
          <ScrollLink to="sobre" smooth={true} duration={600} className='headerItem'>SOBRE</ScrollLink>
      <ScrollLink to="contato" smooth={true} duration={600} className='headerItem'>CONTATO</ScrollLink>
          <Link to="/cadastro" className='headerItem'>CADASTRE-SE</Link>
        </nav>
        <Link to="/login"><input type="button" value="LOGIN" className="botaoLogin headerItem"/></Link>
      </header>

      <section className="sec1">
        <h1 className="title">CARBION</h1>
        <div className="botoes">
          <input type="button" className="saibaMais" value="saiba mais" />
          <input type="button" className="servicos" value=" serviços " />
        </div>
        <img src="/Images/infografico.png" alt="" />
        <hr color='#B6C474' className="section_divisor" />
      </section>

      <section className="sec2">
        <div class="sec2_introducao">
        <h1 class="sec2_tit">Sustentabilidade para sua PME</h1>
        <p class="sec2_paragrafo">Transforme a sustentabilidade em vantagem competitiva. Com a Carbion, PMEs podem reduzir custos, otimizar processos e medir impactos ambientais de forma simples, prática e estratégica. Descubra como ações responsáveis podem gerar valor real para seu negócio, melhorar resultados e fortalecer sua presença no mercado.</p>
</div>
       
          <div className='mini_divisor'>
          <hr color='#B6C474' className="mini_line_divisor" />
          <hr color='#B6C474' className="mini_line_divisor" />
          <hr color='#B6C474' className="mini_line_divisor" />
</div>
<div className='sec2_mini_paragrafos'>
   <div className="sec2_paragrafos_unidades">
    <h1 className='numbers'>1</h1>
          <h2 className='mini_tit' >Monitoramento eficiente</h2>
          <p>Nossa plataforma permite acompanhar as emissões de carbono e os impactos ambientais em tempo real, fornecendo dados confiáveis que ajudam a tomar decisões inteligentes e reduzir desperdícios de recursos essenciais da operação.</p>
        </div>
        <div className="sec2_paragrafos_unidades">
          
          <h1 className='numbers'>2</h1>
          <h2 className='mini_tit'>Redução de custos</h2>
          <p>Ao adotar práticas sustentáveis guiadas pela Carbion, PMEs economizam energia, água e materiais, otimizando processos e aumentando a produtividade sem comprometer a qualidade ou a operação diária.</p>
        </div>
        <div className="sec2_paragrafos_unidades">
          
          <h1 className='numbers'>3</h1>
          <h2 className='mini_tit'>Alcance suas metas ESG</h2>
          <p>Com relatórios claros e recomendações personalizadas, PMEs atingem metas ESG de forma estratégica, fortalecendo sua reputação e mostrando compromisso com responsabilidade ambiental de maneira concreta e mensurável.</p>
        </div>
      
        </div>
          <img className='img_break' src="/Images/pageBreak.svg" alt="teste" />
      </section>

      <section id='sobre' className="sec3">
        <hr className="section_divisor" color='#B6C474'/>
        <div className="sec3_paragrafos">
          <div className="sec3_paragrafos_unidade">
            <h3>Tecnologia</h3>
            <p>Desenvolvemos uma plataforma moderna e segura, que combina React.js, Node.js e MongoDB para oferecer uma experiência fluida, intuitiva e confiável, permitindo que PMEs tenham total controle sobre suas ações sustentáveis e dados ambientais de maneira simples e prática.</p>
            <p>Nossa solução foi pensada para tornar a sustentabilidade acessível, ajudando cada empresa a organizar informações, monitorar resultados e implementar melhorias contínuas sem complicações ou investimentos excessivos em tecnologia.</p>
          </div>
          <div className="sec3_paragrafos_unidade">
            <h3>Resultados</h3>
            <p>A Carbion transforma ações responsáveis em benefícios reais para os negócios, mostrando que sustentabilidade e lucratividade podem caminhar juntas. Com relatórios claros, cada dado se torna um indicador útil para tomadas de decisão estratégicas e eficientes.</p>
            <p>Além de reduzir impactos ambientais, a plataforma ajuda PMEs a identificar oportunidades de economia e otimização de processos, tornando cada medida aplicada uma forma de gerar valor concreto e visível para clientes e colaboradores.</p>
          </div>
          <div className="sec3_paragrafos_unidade">
            <h3>Impacto real</h3>
            
            <p>Cada ação sustentável, por menor que seja, contribui para um mundo melhor e fortalece a reputação das PMEs. A Carbion mostra como pequenas decisões podem ter grande efeito, traduzindo responsabilidade ambiental em resultados palpáveis.</p>
            <p>Nosso propósito é simplificar a implementação de estratégias verdes, tornando a sustentabilidade algo mensurável e acessível, ao mesmo tempo que garante que cada PME consiga crescer de forma consciente, eficiente e alinhada com o mercado.</p>
          </div>
        </div>
        <img src="/Images/somos.png" alt="Somos" />
      </section>

        <hr className="section_divisor" color='#B6C474'/>

      <section className="sec4">



<img src="/Images/mockup.png" alt="paksnd" />
        <div className="sec4_paragrafos_">

          <div className="sec4_paragrafos_unidade">

            <h3>Visão</h3>
            <p>Nossa plataforma oferece uma visão clara e objetiva do impacto ambiental da PME, permitindo acompanhar resultados, comparar métricas e identificar oportunidades de melhoria com rapidez e precisão em todos os setores do negócio.</p>
          </div>

          <div className="sec4_paragrafos_unidade">

            <h3>Processos</h3>
            <p>Além de reduzir custos, a Carbion ajuda a implementar mudanças estratégicas que fortalecem processos internos, promovem eficiência operacional e geram valor contínuo para clientes, funcionários e investidores de forma sustentável.</p>
          </div>
          
          <div className="sec4_paragrafos_unidade">

            <h3>Decisões</h3>
            <p>Com relatórios detalhados e sugestões práticas, PMEs tomam decisões inteligentes, alcançam metas de sustentabilidade e se posicionam de forma competitiva em um mercado cada vez mais consciente, exigente e dinâmico.</p>
          </div>

        </div>

      </section>



      <hr className="section_divisor"color='#B6C474' />
</div>
      <footer>
        <div>
          <img  className='folha' src="/images/leaf.png" alt="folha" />
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
          <div className="icons">
        <h3 className='social'>Social</h3>
      
          <a href="#"><img src="/images/instagram.png" alt="Instagram" /></a>
          <a href="#"><img src="/images/linkedin.png" alt="LinkedIn" /></a>
          <a href="#"><img src="/images/discord.png" alt="Discord" /></a>
          <a href="#"><img src="/images/email.png" alt="Email" /></a>
        </div>
        <h1 className='footer_tit' >CARBION</h1>
        <p className='copyright'>Copyright ©2025 CARBION Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}