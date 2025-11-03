import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

const questions = [
  { id: 1, question: "Qual é o consumo anual de energia elétrica da empresa?", category: "Energia", options: [ { text: "Menos de 10.000 kWh/ano", score: 10 }, { text: "Entre 10.000 e 50.000 kWh/ano", score: 40 }, { text: "Entre 50.000 e 200.000 kWh/ano", score: 80 }, { text: "Acima de 200.000 kWh/ano", score: 120 }, ], },
  { id: 2, question: "Quantos litros de combustível foram consumidos pela frota da empresa no último ano?", category: "Frota", options: [ { text: "Menos de 1.000 L", score: 10 }, { text: "Entre 1.000 e 10.000 L", score: 40 }, { text: "Entre 10.000 e 50.000 L", score: 80 }, { text: "Acima de 50.000 L", score: 120 }, ], },
  { id: 3, question: "Qual é a principal fonte de energia elétrica utilizada?", category: "Fonte de Energia", options: [ { text: "Geração própria 100% renovável", score: 10 }, { text: "Energia de fonte renovável (solar, eólica, etc.)", score: 20 }, { text: "Energia mista (parte rede pública, parte renovável)", score: 60 }, { text: "Rede pública convencional (sem fonte renovável)", score: 100 }, ], },
  { id: 4, question: "Como é feito o deslocamento dos funcionários até o trabalho?", category: "Transporte", options: [ { text: "Bicicleta, caminhada ou home office", score: 10 }, { text: "Majoritariamente transporte público", score: 30 }, { text: "Transporte fornecido pela empresa (van, ônibus, etc.)", score: 50 }, { text: "Majoritariamente carro particular", score: 100 }, ], },
  { id: 5, question: "Qual é o destino final dos resíduos sólidos da empresa?", category: "Reciclagem", options: [ { text: "Política de resíduo zero (reaproveitamento e compostagem)", score: 10 }, { text: "Coleta seletiva completa com parceiros de reciclagem", score: 30 }, { text: "Coleta seletiva parcial (alguns materiais reciclados)", score: 70 }, { text: "Lixo comum (sem separação)", score: 100 }, ], },
  { id: 6, question: "Quantos voos corporativos foram realizados pela empresa no último ano?", category: "Transporte aéreo", options: [ { text: "Nenhum", score: 10 }, { text: "1 a 10 voos", score: 40 }, { text: "11 a 50 voos", score: 80 }, { text: "Mais de 50 voos", score: 120 }, ], },
];

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`;

const AppWrap = styled.div`
  min-height: 100vh;
  background: #f4f1de;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 2rem;
  font-family: 'Inter', sans-serif;
  color: #233d2b;
`;

const Card = styled.div`
  width: 100%;
  max-width: 840px;
  background: #ffffff;
  border-radius: 14px;
  box-shadow: 0 10px 30px rgba(20,60,40,0.08);
  padding: 28px;
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 24px;
  animation: ${fadeIn} 240ms ease;
  @media (max-width: 900px) { grid-template-columns: 1fr; }
`;

const Left = styled.div``;
const Right = styled.div`display: flex; flex-direction: column; gap: 16px;`;

const Title = styled.h1`margin:0 0 8px 0; font-size: 1.6rem; font-weight:700; color: #233d2b;`;
const Subtitle = styled.p`margin:0 0 18px 0; font-weight:500; color: #6b705c;`;

const ProgressBarWrap = styled.div`height:10px; background:#eef6e9; border-radius:99px; overflow:hidden;`;
const Progress = styled.div`height:100%; width:${p=>p.width}%; background:linear-gradient(90deg,#2b7857,#4caf50); transition:width 300ms ease;`;

const QuestionCard = styled.div`
  background: linear-gradient(180deg, #ffffff 0%, #f6fff6 100%);
  border-radius: 12px;
  padding: 18px;
  box-shadow: 0 6px 18px rgba(20,60,40,0.08);
`;

const QText = styled.p`margin:0 0 12px 0; font-weight:600; font-size:16px; color:#143b2a;`;

const Options = styled.div`display:flex; flex-direction:column; gap:10px;`;
const Option = styled.label`
  display:flex; align-items:center; gap:12px; border-radius:14px;
  padding:14px; cursor:pointer;
  border:1px solid ${p=>p.selected?'#2b7857':'rgba(34,61,43,0.06)'};
  background:${p=>p.selected?'#e3f4e3':'#fbfdff'};
  transition: all 0.22s ease;
  &:hover { transform: translateY(-4px); box-shadow: 0 12px 28px rgba(18,60,40,0.14);}
  span { color:#143b2a; font-size:14px; font-weight:500; }
`;

const Controls = styled.div`display:flex; gap:12px; margin-top:16px;`;
const Button = styled.button`
  background: ${p=>p.ghost?'#ffffff':'linear-gradient(90deg,#2b7857,#4caf50)'};
  color:${p=>p.ghost?'#233d2b':'#fff'};
  border:${p=>p.ghost?'1px solid rgba(34,61,43,0.06)':'none'};
  padding:10px 14px; border-radius:12px; cursor:pointer; font-weight:600;
  min-width:120px;
  transition: transform 120ms ease;
  :disabled {opacity:0.5; cursor:not-allowed;}
  :hover:not(:disabled){transform:translateY(-3px);}
`;

const Small = styled.div`color:#6b705c; font-size:13px;`;

const ResultBox = styled.div`
  background: linear-gradient(180deg,#fff 0%, #f7fff7 100%);
  border-radius: 12px; padding:16px;
  box-shadow:0 8px 28px rgba(20,60,40,0.06);
  border:1px solid rgba(26,43,35,0.04);
`;

const HistoryList = styled.ul`list-style:none; padding:0; margin:0; display:grid; gap:8px;`;
const HistoryItem = styled.li`
  background:#fff; border-radius:8px; padding:8px 10px; font-size:13px; color:#233d2b;
  box-shadow:0 4px 10px rgba(20,60,40,0.03);
`;

const PieWrap = styled.div`display:flex; justify-content:center; align-items:center; height:200px;`;

function SimplePie({ data, colors=["#2b7857","#4caf50","#a2d5a2","#80cfa0","#a7d6a6","#b0e5b0"] }){
  const total = data.reduce((s,d)=>s+Math.max(0,d.value),0)||1;
  let angle=0; const center=80; const radius=60;
  return <PieWrap><svg width="200" height="200" viewBox="0 0 200 200">
    <g transform={`translate(${center+20},${center+20})`}>
      {data.map((d,i)=>{
        const value=Math.max(0,d.value);
        const portion=value/total;
        const start=angle;
        const end=start+portion*2*Math.PI;
        const largeArc=end-start>Math.PI?1:0;
        const x1=Math.cos(start)*radius; const y1=Math.sin(start)*radius;
        const x2=Math.cos(end)*radius; const y2=Math.sin(end)*radius;
        const path=`M0 0 L${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
        angle=end;
        return <path key={i} d={path} fill={colors[i%colors.length]} stroke="#fff" strokeWidth="1"/>;
      })}
    </g>
  </svg></PieWrap>
}

export default function CarbionCalculator(){
  const navigate = useNavigate();
  const [currentIndex,setCurrentIndex]=useState(0);
  const [answers,setAnswers]=useState({});
  const [selectedOpt,setSelectedOpt]=useState(null);
  const [submitted,setSubmitted]=useState(false);
  const [history,setHistory]=useState([]);
  
  useEffect(()=>{
    const saved=localStorage.getItem("carbioncalculatorResult");
    const savedHistory=localStorage.getItem("carbioncalculatorHistory");
    if(saved){setAnswers(JSON.parse(saved)); setSubmitted(true);}
    if(savedHistory){try{setHistory(JSON.parse(savedHistory));}catch{setHistory([]);}}
  },[]);
  
  useEffect(()=>{
    const qId=questions[currentIndex]?.id;
    if(qId && answers[qId]!==undefined){setSelectedOpt(answers[qId]);}else{setSelectedOpt(null);}
  },[currentIndex,answers]);

  function handleSelect(score){setSelectedOpt(score);}
  function handleNext(){
    if(selectedOpt===null)return;
    const qId=questions[currentIndex].id;
    setAnswers(prev=>({...prev,[qId]:selectedOpt}));
    setSelectedOpt(null);
    if(currentIndex<questions.length-1){setCurrentIndex(i=>i+1);}else{handleSubmit({preventDefault:()=>{}});}
  }
  function handlePrev(){ if(currentIndex===0)return; const prevIndex=currentIndex-1; const prevQId=questions[prevIndex].id; setCurrentIndex(prevIndex); setSelectedOpt(answers[prevQId]??null); }
  function calculateTotal(a=answers){return Object.values(a).reduce((s,v)=>s+Number(v||0),0);}
  function getFeedback(total){if(total<100)return "Excelente! Sua pegada ecológica é baixa."; if(total<250)return "Bom! Mas ainda há espaço para melhorias."; return "Atenção! Suas ações estão gerando alto impacto ambiental.";}
  function getTips(a=answers){const tips=[]; questions.forEach(q=>{const score=a[q.id]||0; if(score>50)tips.push(`Reavalie seus hábitos em "${q.category}".`);}); return tips;}
  function handleSubmit(e){if(e&&e.preventDefault)e.preventDefault(); const lastQ=questions[currentIndex]; if(selectedOpt!==null&&lastQ){const updated={...answers,[lastQ.id]:selectedOpt}; finalizeSubmission(updated); setAnswers(updated);} else {finalizeSubmission(answers);}}
  function finalizeSubmission(finalAnswers){const total=calculateTotal(finalAnswers); setSubmitted(true); const newEntry={date:new Date().toLocaleString(),total,answers:finalAnswers}; const updatedHistory=[...history,newEntry]; setHistory(updatedHistory); localStorage.setItem("carbioncalculatorResult",JSON.stringify(finalAnswers)); localStorage.setItem("carbioncalculatorHistory",JSON.stringify(updatedHistory));}
  function resetForm(){setSubmitted(false); setAnswers({}); setCurrentIndex(0); setSelectedOpt(null); localStorage.removeItem("carbioncalculatorResult"); localStorage.removeItem("carbioncalculatorResultDraft");}
  function clearHistory(){setHistory([]); localStorage.removeItem("carbioncalculatorHistory");}

  const chartData=questions.map(q=>({name:q.category,value:answers[q.id]||0}));
  const totalScore=calculateTotal(answers);
  const progressPercent=Math.round((Object.keys(answers).length/questions.length)*100);

  return(
    <AppWrap>
            <div style={{ width: "100%", maxWidth: "840px" }}>
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
      </div>
      <Card>
        <Left>
          <Title>Calculadora de Pegada de Carbono</Title>
          <Subtitle>Responda as perguntas abaixo — uma por vez. Seu resultado será estimado ao final.</Subtitle>

          <ProgressBarWrap aria-hidden>
            <Progress width={progressPercent}/>
          </ProgressBarWrap>
          <div style={{height:18}}/>

          <QuestionCard>
            <QText>{questions[currentIndex].id}. {questions[currentIndex].question}</QText>
            <Options>
              {questions[currentIndex].options.map((opt,i)=>{
                const selected=selectedOpt===opt.score;
                return(
                  <Option key={i} selected={selected}>
                    <input type="radio" checked={selected} onChange={()=>handleSelect(opt.score)}/>
                    <span>{opt.text}</span>
                  </Option>
                )
              })}
            </Options>
            <Controls>
              <Button ghost onClick={handlePrev} disabled={currentIndex===0}>Voltar</Button>
              <div style={{flex:1}}/>
              <Button onClick={handleNext} disabled={selectedOpt===null}>{currentIndex===questions.length-1?"Calcular":"Próxima pergunta"}</Button>
            </Controls>
          </QuestionCard>

          {submitted && <div style={{marginTop:18}}>
            <QuestionCard>
              <QText>Resumo</QText>
              <Small>Total estimado: <strong>{totalScore}</strong> kg CO₂/mês</Small>
              <Small style={{marginTop:8}}>{getFeedback(totalScore)}</Small>
              <div style={{marginTop:12}}>
                <Small>Dicas rápidas:</Small>
                <ul style={{margin:"8px 0 0 18px"}}>
                  {getTips().length>0?getTips().map((t,i)=><li key={i} style={{fontSize:13}}>{t}</li>):<li style={{fontSize:13}}>Ótimo — sem pontos críticos detectados.</li>}
                </ul>
              </div>
              <div style={{marginTop:12,display:"flex",gap:8}}>
                <Button onClick={resetForm}>Refazer cálculo</Button>
                <Button ghost onClick={clearHistory}>Excluir histórico</Button>
              </div>
            </QuestionCard>
          </div>}
        </Left>

        <Right>
          <ResultBox>
            <Small>Progresso</Small>
            <div style={{fontSize:18,fontWeight:700,marginTop:8}}>{progressPercent}%</div>
            <div style={{marginTop:12}}>
              <Small>Histórico</Small>
              <HistoryList>
                {history.length===0 && <div style={{fontSize:13,color:"#6b705c"}}>Sem histórico</div>}
                {history.slice().reverse().map((h,i)=>(
                  <HistoryItem key={i}>
                    <div style={{display:"flex",justifyContent:"space-between"}}>
                      <div>{new Date(h.date).toLocaleString()}</div>
                      <div><strong>{h.total}</strong></div>
                    </div>
                    <div style={{marginTop:6,fontSize:12,color:"#6b705c"}}>{Object.keys(h.answers||{}).length} respostas</div>
                  </HistoryItem>
                ))}
              </HistoryList>
            </div>
          </ResultBox>

          <ResultBox>
            <Small>Gráfico por categoria</Small>
            <SimplePie data={chartData}/>
          </ResultBox>

          <ResultBox>
            <Small>Resultado acumulado</Small>
            <div style={{fontSize:20,fontWeight:700,marginTop:8}}>{totalScore} kg CO₂/mês</div>
            <div style={{marginTop:8}}><Small>{getFeedback(totalScore)}</Small></div>
          </ResultBox>
        </Right>
      </Card>
    </AppWrap>
  )
}
