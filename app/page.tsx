"use client";

import { useState } from "react";

const areas = ["Marketing", "Comercial", "Financeiro", "Pedagógico", "CS (Customer Success)", "RH", "Outro"];

const niveis = [
  "Nunca usei",
  "Já testei algumas vezes, mas não uso com regularidade",
  "Uso ocasionalmente para tarefas pontuais",
  "Uso regularmente no meu trabalho",
];

const ferramentas = ["ChatGPT", "G4S", "Gemini (Google)", "Copilot (Microsoft)", "Outra", "Nenhuma"];

type FormData = {
  nome: string;
  area: string;
  nivel: string;
  ferramentasUsadas: string[];
  rotina: string;
  tarefaManual: string;
  sistemas: string;
  automatizar: string;
  infoOutroSetor: string;
};

const initialForm: FormData = {
  nome: "",
  area: "",
  nivel: "",
  ferramentasUsadas: [],
  rotina: "",
  tarefaManual: "",
  sistemas: "",
  automatizar: "",
  infoOutroSetor: "",
};

export default function Home() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function toggleFerramenta(f: string) {
    setForm((prev) => ({
      ...prev,
      ferramentasUsadas: prev.ferramentasUsadas.includes(f)
        ? prev.ferramentasUsadas.filter((x) => x !== f)
        : [...prev.ferramentasUsadas, f],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!form.nome || !form.area || !form.nivel || form.ferramentasUsadas.length === 0 || !form.rotina || !form.tarefaManual || !form.sistemas || !form.automatizar) {
      setError("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Erro ao enviar");
      setSubmitted(true);
    } catch {
      setError("Ocorreu um erro ao enviar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 max-w-md w-full text-center">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Obrigada, {form.nome.split(" ")[0]}!</h2>
          <p className="text-gray-500">Suas respostas foram registradas. Em breve entraremos em contato com o próximo passo.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Diagnóstico de IA</h1>
          <p className="text-gray-500 mt-2">
            Este formulário faz parte do nosso programa de uso de Inteligência Artificial. Leva menos de 5 minutos e vai nos ajudar a montar um programa personalizado para a sua área.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Nome */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nome completo <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              placeholder="Seu nome"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-800"
            />
          </div>

          {/* Área */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Em qual área você trabalha? <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {areas.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => setForm({ ...form, area: a })}
                  className={`text-left px-4 py-2.5 rounded-lg border text-sm transition-all ${
                    form.area === a
                      ? "bg-gray-900 text-white border-gray-900 font-medium"
                      : "border-gray-200 text-gray-600 hover:border-gray-400"
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          {/* Nível IA */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Como você descreveria seu uso atual de IA? <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              {niveis.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setForm({ ...form, nivel: n })}
                  className={`w-full text-left px-4 py-2.5 rounded-lg border text-sm transition-all ${
                    form.nivel === n
                      ? "bg-gray-900 text-white border-gray-900 font-medium"
                      : "border-gray-200 text-gray-600 hover:border-gray-400"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Ferramentas */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Quais ferramentas de IA você já usou? <span className="text-gray-400 font-normal">(pode marcar mais de uma)</span> <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {ferramentas.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => toggleFerramenta(f)}
                  className={`text-left px-4 py-2.5 rounded-lg border text-sm transition-all ${
                    form.ferramentasUsadas.includes(f)
                      ? "bg-gray-900 text-white border-gray-900 font-medium"
                      : "border-gray-200 text-gray-600 hover:border-gray-400"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Rotina */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Descreva brevemente sua rotina principal no trabalho <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-400 mb-3">Ex: &ldquo;Gero relatórios de matrícula toda segunda, atendo leads pelo WhatsApp e atualizo planilhas de metas.&rdquo;</p>
            <textarea
              value={form.rotina}
              onChange={(e) => setForm({ ...form, rotina: e.target.value })}
              rows={3}
              placeholder="Descreva sua rotina..."
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-800 resize-none"
            />
          </div>

          {/* Tarefa manual */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Qual tarefa consome mais tempo e ainda é feita manualmente? <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-400 mb-3">Ex: copiar dados, preencher planilhas, gerar relatórios, responder mensagens repetitivas.</p>
            <textarea
              value={form.tarefaManual}
              onChange={(e) => setForm({ ...form, tarefaManual: e.target.value })}
              rows={3}
              placeholder="Descreva a tarefa..."
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-800 resize-none"
            />
          </div>

          {/* Sistemas */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Quais sistemas e ferramentas você usa no trabalho? <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-400 mb-3">Ex: RD Station, Google Ads, planilha Excel, sistema acadêmico, WhatsApp, etc.</p>
            <textarea
              value={form.sistemas}
              onChange={(e) => setForm({ ...form, sistemas: e.target.value })}
              rows={2}
              placeholder="Liste os sistemas..."
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-800 resize-none"
            />
          </div>

          {/* Automatizar */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Se você pudesse automatizar UMA coisa hoje, o que seria? <span className="text-red-500">*</span>
            </label>
            <textarea
              value={form.automatizar}
              onChange={(e) => setForm({ ...form, automatizar: e.target.value })}
              rows={3}
              placeholder="Descreva o que automatizaria..."
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-800 resize-none"
            />
          </div>

          {/* Info outro setor */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Tem alguma informação de outro setor que você precisa e tem dificuldade de acessar?{" "}
              <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <p className="text-xs text-gray-400 mb-3">Ex: &ldquo;Preciso saber quantos contratos o financeiro fechou, mas as informações ficam dispersas.&rdquo;</p>
            <textarea
              value={form.infoOutroSetor}
              onChange={(e) => setForm({ ...form, infoOutroSetor: e.target.value })}
              rows={2}
              placeholder="Descreva se houver..."
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-800 resize-none"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm bg-red-50 border border-red-100 rounded-lg px-4 py-3">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 hover:bg-gray-700 text-white font-semibold py-3.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Enviando..." : "Enviar respostas →"}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-8 pb-8">Escola Técnica Stela · Diagnóstico de IA 2026</p>
      </div>
    </main>
  );
}
