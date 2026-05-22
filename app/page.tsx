"use client";

import { useState } from "react";

const areas = ["Marketing", "Comercial", "Financeiro", "Pedagógico", "CS (Customer Success)", "RH", "Outro"];

const niveis = [
  "Nunca usei",
  "Já testei algumas vezes, mas não uso com regularidade",
  "Uso ocasionalmente para tarefas pontuais",
  "Uso regularmente no meu trabalho",
];

const ferramentas = ["ChatGPT", "Claude", "Gemini (Google)", "Copilot (Microsoft)", "Outra", "Nenhuma"];

type FormData = {
  nome: string;
  area: string;
  areaOutro: string;
  nivel: string;
  ferramentasUsadas: string[];
  ferramentaOutra: string;
  rotina: string;
  tarefaManual: string;
  sistemas: string;
  automatizar: string;
  infoOutroSetor: string;
};

const initialForm: FormData = {
  nome: "",
  area: "",
  areaOutro: "",
  nivel: "",
  ferramentasUsadas: [],
  ferramentaOutra: "",
  rotina: "",
  tarefaManual: "",
  sistemas: "",
  automatizar: "",
  infoOutroSetor: "",
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs tracking-[0.2em] uppercase text-[#A0845C] font-semibold mb-5">
      {children}
    </p>
  );
}

function Question({
  number,
  label,
  hint,
  required = true,
  children,
}: {
  number: string;
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-lg px-6 py-7 mb-3 shadow-sm">
      <div className="flex gap-4 mb-5">
        <span className="text-xs tracking-widest text-[#A0845C] font-bold mt-1 shrink-0">{number}</span>
        <div>
          <p className="text-base font-semibold text-gray-900 leading-snug">
            {label}
            {!required && <span className="text-gray-400 font-normal text-sm ml-1">(opcional)</span>}
          </p>
          {hint && <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">{hint}</p>}
        </div>
      </div>
      <div className="pl-8">{children}</div>
    </div>
  );
}

function OptionButton({
  selected,
  onClick,
  children,
  fullWidth = false,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  fullWidth?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left px-4 py-3.5 text-sm font-medium transition-all rounded-md border-2 ${
        fullWidth ? "w-full" : ""
      } ${
        selected
          ? "border-[#A0845C] text-gray-900 bg-[#fdf6ed]"
          : "border-gray-200 text-gray-600 bg-gray-50 hover:border-gray-400 hover:text-gray-900"
      }`}
    >
      <span
        className={`inline-flex items-center justify-center w-4 h-4 rounded-sm border-2 mr-3 shrink-0 align-middle transition-colors ${
          selected ? "border-[#A0845C] bg-[#A0845C]" : "border-gray-300 bg-white"
        }`}
      >
        {selected && (
          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 8">
            <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      {children}
    </button>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  autoFocus,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      autoFocus={autoFocus}
      className="w-full border-2 border-gray-200 focus:border-[#A0845C] rounded-md px-4 py-3 text-base text-gray-900 placeholder-gray-400 outline-none transition-colors bg-white"
    />
  );
}

function TextArea({
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full border-2 border-gray-200 focus:border-[#A0845C] rounded-md px-4 py-3 text-base text-gray-900 placeholder-gray-400 outline-none transition-colors bg-white resize-none"
    />
  );
}

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

    if (
      !form.nome ||
      !form.area ||
      (form.area === "Outro" && !form.areaOutro) ||
      !form.nivel ||
      form.ferramentasUsadas.length === 0 ||
      (form.ferramentasUsadas.includes("Outra") && !form.ferramentaOutra) ||
      !form.rotina ||
      !form.tarefaManual ||
      !form.sistemas ||
      !form.automatizar
    ) {
      setError("Preencha todos os campos obrigatórios antes de continuar.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...form,
        area: form.area === "Outro" ? `Outro: ${form.areaOutro}` : form.area,
        ferramentasUsadas: form.ferramentasUsadas.map((f) =>
          f === "Outra" ? `Outra: ${form.ferramentaOutra}` : f
        ),
      };

      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
      <main className="min-h-screen bg-[#F5F2EE] flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-white rounded-xl p-10 shadow-sm text-center">
          <div className="text-4xl mb-5">✅</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Obrigada, {form.nome.split(" ")[0]}!
          </h2>
          <p className="text-base text-gray-600 leading-relaxed">
            Suas respostas foram registradas. Em breve entraremos em contato com o próximo passo.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F5F2EE]">
      {/* Header */}
      <header className="border-b border-[#E5E0D8] bg-white px-8 py-4">
        <span className="text-sm tracking-[0.25em] uppercase text-gray-800 font-semibold">Idens</span>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="mb-10">
          <SectionLabel>Pré-diagnóstico · Escola Técnica Stela</SectionLabel>
          <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-3">
            O que você precisa<br />
            <span className="text-[#A0845C]">resolver.</span>
          </h1>
          <p className="text-base text-gray-600 leading-relaxed max-w-sm">
            Leva menos de 5 minutos. Suas respostas vão nos ajudar a montar um programa personalizado para a sua área.
          </p>
        </div>

        <form onSubmit={handleSubmit}>

          {/* Nome */}
          <Question number="01" label="Qual é o seu nome completo?">
            <TextInput
              value={form.nome}
              onChange={(v) => setForm({ ...form, nome: v })}
              placeholder="Seu nome completo"
            />
          </Question>

          {/* Área */}
          <Question number="02" label="Em qual área você trabalha?">
            <div className="grid grid-cols-2 gap-2">
              {areas.map((a) => (
                <OptionButton
                  key={a}
                  selected={form.area === a}
                  onClick={() => setForm({ ...form, area: a, areaOutro: "" })}
                >
                  {a}
                </OptionButton>
              ))}
            </div>
            {form.area === "Outro" && (
              <div className="mt-3">
                <TextInput
                  value={form.areaOutro}
                  onChange={(v) => setForm({ ...form, areaOutro: v })}
                  placeholder="Qual área?"
                  autoFocus
                />
              </div>
            )}
          </Question>

          {/* Nível */}
          <Question number="03" label="Como você descreveria seu uso atual de Inteligência Artificial?">
            <div className="space-y-2">
              {niveis.map((n) => (
                <OptionButton
                  key={n}
                  selected={form.nivel === n}
                  onClick={() => setForm({ ...form, nivel: n })}
                  fullWidth
                >
                  {n}
                </OptionButton>
              ))}
            </div>
          </Question>

          {/* Ferramentas */}
          <Question
            number="04"
            label="Quais ferramentas de IA você já usou?"
            hint="Pode marcar mais de uma opção."
          >
            <div className="grid grid-cols-2 gap-2">
              {ferramentas.map((f) => (
                <OptionButton
                  key={f}
                  selected={form.ferramentasUsadas.includes(f)}
                  onClick={() => toggleFerramenta(f)}
                >
                  {f}
                </OptionButton>
              ))}
            </div>
            {form.ferramentasUsadas.includes("Outra") && (
              <div className="mt-3">
                <TextInput
                  value={form.ferramentaOutra}
                  onChange={(v) => setForm({ ...form, ferramentaOutra: v })}
                  placeholder="Qual ferramenta?"
                  autoFocus
                />
              </div>
            )}
          </Question>

          {/* Rotina */}
          <Question
            number="05"
            label="Descreva brevemente sua rotina principal no trabalho."
            hint='Ex: "Gero relatórios toda segunda, atendo leads pelo WhatsApp e atualizo planilhas de metas."'
          >
            <TextArea
              value={form.rotina}
              onChange={(v) => setForm({ ...form, rotina: v })}
              placeholder="Descreva sua rotina..."
            />
          </Question>

          {/* Tarefa manual */}
          <Question
            number="06"
            label="Qual tarefa consome mais tempo no seu dia e ainda é feita manualmente?"
            hint="Ex: copiar dados, preencher planilhas, gerar relatórios, responder mensagens repetitivas."
          >
            <TextArea
              value={form.tarefaManual}
              onChange={(v) => setForm({ ...form, tarefaManual: v })}
              placeholder="Descreva a tarefa..."
            />
          </Question>

          {/* Sistemas */}
          <Question
            number="07"
            label="Quais sistemas e ferramentas você usa no trabalho?"
            hint="Ex: RD Station, Google Ads, planilha Excel, sistema acadêmico, WhatsApp, etc."
          >
            <TextArea
              value={form.sistemas}
              onChange={(v) => setForm({ ...form, sistemas: v })}
              placeholder="Liste os sistemas..."
              rows={2}
            />
          </Question>

          {/* Automatizar */}
          <Question
            number="08"
            label="Se você pudesse automatizar UMA coisa hoje, o que seria?"
          >
            <TextArea
              value={form.automatizar}
              onChange={(v) => setForm({ ...form, automatizar: v })}
              placeholder="Descreva o que você gostaria de automatizar..."
            />
          </Question>

          {/* Info outro setor */}
          <Question
            number="09"
            label="Tem alguma informação de outro setor que você precisa com frequência e tem dificuldade de acessar?"
            hint='Ex: "Preciso saber quantos contratos o financeiro fechou, mas as informações ficam em lugares diferentes."'
            required={false}
          >
            <TextArea
              value={form.infoOutroSetor}
              onChange={(v) => setForm({ ...form, infoOutroSetor: v })}
              placeholder="Descreva se houver..."
              rows={2}
            />
          </Question>

          {/* Submit */}
          <div className="pt-6 pb-4">
            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-4 py-3 mb-5">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 hover:bg-[#A0845C] text-white font-semibold text-base py-4 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? "Enviando..." : "Enviar respostas →"}
            </button>
          </div>
        </form>

        <p className="text-xs text-gray-400 text-center mt-10 pb-8">
          Escola Técnica Stela · Diagnóstico de IA 2026
        </p>
      </div>
    </main>
  );
}
