import React from "react";
import { auth } from "./firebase";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiTrendingUp, FiAlertCircle } from "react-icons/fi";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`;

const PageWrap = styled.div`
  min-height: 100vh;
  padding: 2.5rem;
  background: #f4f1de;
  display: flex;
  justify-content: center;
  font-family: "Inter", sans-serif;
`;

const Container = styled.div`
  max-width: 900px;
  width: 100%;
  animation: ${fadeIn} 250ms ease;
`;

const BackButton = styled.button`
  margin-bottom: 24px;
  padding: 10px 20px;
  background-color: #1f2937;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SectionTitle = styled.h2`
  font-size: 26px;
  margin-bottom: 12px;
  color: #111827;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SectionText = styled.p`
  font-size: 16px;
  margin-bottom: 24px;
  color: #4b5563;
`;

const Form = styled.form`
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
`;

const Input = styled.input`
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #d1d5db;
  font-size: 16px;
  width: 140px;
  background-color: #fff;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);
`;

const Button = styled.button`
  padding: 12px 20px;
  background-color: ${(props) => (props.disabled ? "#9ca3af" : "#2563eb")};
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: background 0.3s ease;
`;

const ResultCard = styled.div`
  margin-top: 32px;
  background-color: #ffffff;
  padding: 20px;
  border-radius: 14px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
`;

const ErrorBox = styled.div`
  color: #b91c1c;
  margin-top: 24px;
  font-weight: 500;
  background-color: #fee2e2;
  padding: 12px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ManualResultCard = styled.div`
  margin-top: 24px;
  background-color: #ffffff;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  color: #111827;
  font-weight: 500;
`;

export default function CalculadoraRoi() {
  const [symbol, setSymbol] = React.useState("AAPL");
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState(null);
  const [error, setError] = React.useState("");

  const [manualInvestment, setManualInvestment] = React.useState("");
  const [manualReturn, setManualReturn] = React.useState("");
  const [manualResult, setManualResult] = React.useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Usuário não autenticado");

      const token = await user.getIdToken();

      const res = await fetch(
        `http://localhost:3001/api/roi/${encodeURIComponent(symbol)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        let msg = "Erro ao consultar ROI";
        try {
          const errData = await res.json();
          if (errData.msg) msg = errData.msg;
        } catch (_) {}
        throw new Error(msg);
      }

      const data = await res.json();

      const chartData = data.data.map((price, index) => ({
        day: index + 1,
        price,
        roi: ((price - data.first) / data.first) * 100,
      }));

      setResult({ ...data, chartData });
    } catch (err) {
      setError(err.message || "Erro ao consultar ROI");
    } finally {
      setLoading(false);
    }
  };

  const handleManualCalculate = (e) => {
    e.preventDefault();
    setManualResult(null);

    const invest = parseFloat(manualInvestment.replace(",", "."));
    const ret = parseFloat(manualReturn.replace(",", "."));

    if (isNaN(invest) || isNaN(ret) || invest <= 0) {
      setManualResult("Valores inválidos");
      return;
    }

    const roi = ((ret - invest) / invest) * 100;
    setManualResult(roi.toFixed(2));
  };

  return (
    <PageWrap>
      <Container>
        <BackButton onClick={() => navigate(-1)}>
          <FiArrowLeft /> Voltar
        </BackButton>

        {/* ROI via Finnhub */}
        <SectionTitle>
          <FiTrendingUp /> Calculadora ROI - Ações
        </SectionTitle>
        <SectionText>
          Insira o código da ação ou ativo para obter o ROI simples e ajustado
          pelo tempo.
        </SectionText>

        <Form onSubmit={handleSubmit}>
          <Input
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            required
            placeholder="Ex: AAPL"
          />
          <Button type="submit" disabled={loading}>
            {loading ? "Carregando..." : "Consultar"}
          </Button>
        </Form>

        {error && (
          <ErrorBox>
            <FiAlertCircle /> {error}
          </ErrorBox>
        )}

        {result && (
          <ResultCard>
            <h3 style={{ marginBottom: "8px", color: "#10b981", fontSize: "20px" }}>
              ROI Simples: <strong>{result.roiSimple}%</strong> | ROI Ajustado:{" "}
              <strong>{result.roiAdjusted}%</strong>
            </h3>
            <p style={{ color: "#374151", marginBottom: "16px" }}>
              Preço inicial: {result.first} | Preço final: {result.last} | Período:{" "}
              {result.years} anos | Taxa: {result.rate}%
            </p>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={result.chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="day"
                  label={{ value: "Dia", position: "insideBottomRight", offset: -5 }}
                />
                <YAxis
                  yAxisId="left"
                  label={{ value: "Preço", angle: -90, position: "insideLeft" }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  label={{ value: "ROI %", angle: 90, position: "insideRight" }}
                />
                <Tooltip />
                <Legend verticalAlign="top" />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="price"
                  stroke="#2563eb"
                  name="Preço"
                  dot={false}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="roi"
                  stroke="#10b981"
                  name="ROI (%)"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </ResultCard>
        )}

        <hr style={{ margin: "40px 0", borderColor: "#d1d5db" }} />

        {/* ROI Manual */}
        <SectionTitle>
          <FiTrendingUp /> Calculadora ROI Manual
        </SectionTitle>
        <SectionText>
          Insira valores de investimento e retorno para calcular o ROI manualmente.
        </SectionText>

        <Form onSubmit={handleManualCalculate}>
          <Input
            value={manualInvestment}
            onChange={(e) => setManualInvestment(e.target.value)}
            required
            placeholder="Investimento"
            style={{ width: "120px" }}
          />
          <Input
            value={manualReturn}
            onChange={(e) => setManualReturn(e.target.value)}
            required
            placeholder="Retorno"
            style={{ width: "120px" }}
          />
          <Button type="submit" style={{ backgroundColor: "#10b981" }}>
            Calcular
          </Button>
        </Form>

        {manualResult && <ManualResultCard>ROI Manual: <strong>{manualResult}%</strong></ManualResultCard>}
      </Container>
    </PageWrap>
  );
}
