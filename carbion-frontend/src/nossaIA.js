import React, { useState } from "react";
import { auth } from "./firebase";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiFileText, FiAlertCircle } from "react-icons/fi";
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
  max-width: 800px;
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

const Title = styled.h2`
  font-size: 28px;
  margin-bottom: 12px;
  color: #111827;
`;

const Subtitle = styled.p`
  font-size: 16px;
  margin-bottom: 32px;
  color: #4b5563;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const TextArea = styled.textarea`
  padding: 16px;
  border-radius: 12px;
  border: 1px solid #d1d5db;
  font-size: 16px;
  background-color: #fff;
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.05);
  resize: vertical;
`;

const Button = styled.button`
  padding: 12px 24px;
  background-color: ${(props) => (props.disabled ? "#9ca3af" : "#10b981")};
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: background 0.3s ease;
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

const ReportCard = styled.div`
  margin-top: 32px;
  background-color: #ffffff;
  padding: 24px;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  white-space: pre-wrap;
`;

const ReportTitle = styled.h3`
  margin-bottom: 16px;
  color: #2563eb;
  font-size: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export default function NossaIA() {
  const [prompt, setPrompt] = useState("");
  const [report, setReport] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setReport("");

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Usuário não autenticado");

      const token = await user.getIdToken();

      const response = await fetch(`${API_URL}/api/report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ prompt }),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.msg || "Erro no servidor");
      }

      const data = await response.json();
      setReport(data.report);
    } catch (err) {
      console.error("Erro completo:", err);
      setError(err.message || "Erro ao comunicar com servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrap>
      <Container>
        <BackButton onClick={() => navigate(-1)}>
          <FiArrowLeft /> Voltar
        </BackButton>

        <Title>Nossa IA</Title>
        <Subtitle>
          Solicite um relatório ou sugestão para reduzir emissões de forma inteligente.
        </Subtitle>

        <Form onSubmit={handleSubmit}>
          <TextArea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Descreva o que deseja..."
            rows={6}
            required
          />
          <Button type="submit" disabled={loading}>
            {loading ? "Gerando..." : "Gerar relatório"}
          </Button>
        </Form>

        {error && (
          <ErrorBox>
            <FiAlertCircle /> {error}
          </ErrorBox>
        )}

        {report && (
          <ReportCard>
            <ReportTitle>
              <FiFileText /> Relatório
            </ReportTitle>
            <div style={{ color: "#374151", lineHeight: "1.6" }}>{report}</div>
          </ReportCard>
        )}
      </Container>
    </PageWrap>
  );
}
