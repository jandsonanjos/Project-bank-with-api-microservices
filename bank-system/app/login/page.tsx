"use client";

import { useEffect, useState } from "react";
import { loginUser, getAccount } from "@/src/lib/api";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // se houver token, tentar buscar conta
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        (async () => {
          const acc = await getAccount();
          if (!acc || acc.error) {
            // token inválido ou expirado
            localStorage.removeItem("token");
            setUser(null);
          } else {
            setUser(acc);
          }
        })();
      }
    }
  }, []);

  async function handleSubmit(e: any) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await loginUser(form);

    setLoading(false);
    if (res.error) {
      setError(res.error);
      return;
    }

    if (typeof window !== "undefined") {
      localStorage.setItem("token", res.token);
    }

    // buscar conta e redirecionar
    const acc = await getAccount();
    if (acc && !acc.error) {
      setUser(acc);
      router.replace("/dashboard");
    } else {
      // mesmo se getAccount falhar, redirecionar para dashboard
      router.replace("/dashboard");
    }
  }

  function handleLogout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
    setUser(null);
    router.push("/");
  }

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-900">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <h2 className="text-xl font-semibold mb-2 text-center">Olá, {user.name || user.email}</h2>
          <p className="text-sm text-center text-gray-600 dark:text-gray-300 mb-6">Você já está logado.</p>
          <div className="flex flex-col gap-3">
            <button
              className="w-full px-4 py-2 bg-blue-600 text-white rounded"
              onClick={() => router.push("/dashboard")}
            >
              Ir para dashboard
            </button>
            <button
              className="w-full px-4 py-2 bg-red-600 text-white rounded"
              onClick={handleLogout}
            >
              Sair
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-semibold mb-2 text-center">Entrar</h2>
        <p className="text-sm text-center text-gray-600 dark:text-gray-300 mb-4">Acesse sua conta para gerenciar suas finanças</p>
        {error && <div className="mb-4 text-red-600 text-center">{error}</div>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            type="email"
            placeholder="Email"
            value={form.email}
            autoComplete="email"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />

          <input
            className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            type="password"
            placeholder="Senha"
            value={form.password}
            autoComplete="current-password"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />

          <button
            className="w-full mt-2 px-4 py-3 bg-blue-600 text-white rounded-md disabled:opacity-50"
            type="submit"
            disabled={loading}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>

          <button
            type="button"
            className="w-full mt-2 text-sm text-gray-600 hover:underline"
            onClick={() => router.push("/register")}
          >
            Criar conta
          </button>
        </form>
      </div>
    </div>
  );
}
