"use client";

import { useState } from "react";
import { registerUser } from "@/src/lib/api";
import { useRouter } from "next/navigation";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"error" | "success" | "">("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: any) {
    e.preventDefault();
    setMessage("");
    setMessageType("");
    setLoading(true);

    try {
      const result = await registerUser(form);

      if (result.error) {
        setMessage(result.error);
        setMessageType("error");
      } else {
        setMessage("✓ Usuário registrado com sucesso! Redirecionando para login...");
        setMessageType("success");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    } catch (err: any) {
      setMessage("Erro ao conectar com o servidor.");
      setMessageType("error");
      console.error("Erro:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-semibold mb-2 text-center text-gray-900 dark:text-white">Criar Conta</h2>
        <p className="text-sm text-center text-gray-600 dark:text-gray-300 mb-6">Cadastre-se para começar a usar o STY Bank</p>

        {message && (
          <div className={`mb-4 p-3 rounded text-center font-medium ${
            messageType === "error" 
              ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200" 
              : "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome</label>
            <input
              type="text"
              placeholder="Seu nome completo"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <input
              type="email"
              placeholder="seu@email.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Senha</label>
            <input
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition mt-6"
          >
            {loading ? "Registrando..." : "Criar Conta"}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          Já tem conta?{" "}
          <a href="/login" className="text-blue-600 hover:underline font-medium">
            Entrar aqui
          </a>
        </div>
      </div>
    </div>
  );
}
