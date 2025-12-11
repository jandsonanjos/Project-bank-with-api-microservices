"use client";

import { useState } from "react";
import { registerUser } from "@/src/lib/api";
import { useRouter } from "next/navigation";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: any) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const result = await registerUser({ name, email, password });
      console.log("Resposta do backend:", result);

      if (result.error) {
        setMessage(result.error);
      } else {
        setMessage("Usuário registrado com sucesso!");
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      }
    } catch (err: any) {
      setMessage("Erro ao conectar com o servidor.");
      console.error("Erro:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nome"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button type="submit" disabled={loading}>
        {loading ? "Registrando..." : "Registrar"}
      </button>

      {message && <p className="message">{message}</p>}
    </form>
  );
}
